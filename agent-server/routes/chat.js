const express = require("express");
const router = express.Router();
const { SarvamAIClient } = require("sarvamai");
const { toolDefinitions, executeTool, getSystemPrompt } = require("../utils/agentTools");

const MAX_TOOL_ROUNDS = 3;

function ts() {
  return new Date().toISOString();
}

router.post("/", async (req, res) => {
  const startMs = Date.now();

  try {
    const apiKey = process.env.SARVAM_API_KEY;
    if (!apiKey || apiKey === "your_key_here") {
      return res.status(503).json({
        error: "SARVAM_API_KEY not configured. Set it in agent-server/.env",
      });
    }

    const { message, history = [], merchantId, language = 'en-IN', voiceMode = false } = req.body;
    if (!message) {
      return res.status(400).json({ error: "message is required" });
    }

    console.log(`[Agent] ${ts()} → POST /api/chat`);
    console.log(`[Agent]    req  ${JSON.stringify({ message, history })}`);

    const client = new SarvamAIClient({ apiSubscriptionKey: apiKey });

    // Keep last 10 messages (5 turns) for multi-turn context
    const messages = [
      { role: "system", content: getSystemPrompt(language, voiceMode) },
      ...history.slice(-10),
      { role: "user", content: message },
    ];

    for (let round = 0; round < MAX_TOOL_ROUNDS; round++) {
      const sarvamReq = { model: "sarvam-30b", messages, tools: toolDefinitions, tool_choice: "auto" };
      console.log(`[Agent] ${ts()} → Sarvam (round ${round + 1})`);
      console.log(`[Agent]    req  ${JSON.stringify(sarvamReq)}`);

      const response = await client.chat.completions(sarvamReq);

      console.log(`[Agent] ${ts()} ← Sarvam (round ${round + 1})`);
      console.log(`[Agent]    res  ${JSON.stringify(response)}`);

      const choice = response.choices[0];
      const assistantMsg = choice.message;

      // No tool calls → LLM gave a final text answer
      if (!assistantMsg.tool_calls || assistantMsg.tool_calls.length === 0) {
        const reply = assistantMsg.content;
        console.log(`[Agent] ${ts()} ← POST /api/chat — 200 (${Date.now() - startMs}ms)`);
        console.log(`[Agent]    res  ${JSON.stringify({ reply })}`);
        return res.json({ reply });
      }

      // Append the assistant's tool-call message to context
      messages.push({
        role: "assistant",
        content: assistantMsg.content || null,
        tool_calls: assistantMsg.tool_calls,
      });

      // Execute each tool and append its result
      for (const toolCall of assistantMsg.tool_calls) {
        const fnName = toolCall.function.name;
        let fnArgs = {};
        try {
          fnArgs = JSON.parse(toolCall.function.arguments);
        } catch {
          // leave fnArgs as empty object
        }

        const result = executeTool(fnName, fnArgs, { merchantId });
        console.log(`[Agent] ${ts()} ⚙ ${fnName}(${JSON.stringify(fnArgs)}) → ${JSON.stringify(result)}`);

        messages.push({
          role: "tool",
          tool_call_id: toolCall.id,
          content: JSON.stringify(result),
        });
      }
    }

    const sarvamFinalReq = { model: "sarvam-30b", messages };
    console.log(`[Agent] ${ts()} → Sarvam (final)`);
    console.log(`[Agent]    req  ${JSON.stringify(sarvamFinalReq)}`);

    const finalResponse = await client.chat.completions(sarvamFinalReq);

    console.log(`[Agent] ${ts()} ← Sarvam (final)`);
    console.log(`[Agent]    res  ${JSON.stringify(finalResponse)}`);

    const finalText =
      finalResponse.choices[0].message.content ||
      "I couldn't complete that analysis. Please try again.";

    console.log(`[Agent] ${ts()} ← POST /api/chat — 200 (${Date.now() - startMs}ms)`);
    console.log(`[Agent]    res  ${JSON.stringify({ reply: finalText })}`);
    return res.json({ reply: finalText });
  } catch (err) {
    console.error(`[Agent] ${ts()} ← POST /api/chat — 500: ${err.message}`);
    return res.status(500).json({
      error: "Chat request failed",
      details: err.message,
    });
  }
});

module.exports = router;
