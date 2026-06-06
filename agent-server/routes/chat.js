const express = require("express");
const router = express.Router();
const { SarvamAIClient } = require("sarvamai");
const { toolDefinitions, executeTool, SYSTEM_PROMPT } = require("../utils/agentTools");

const MAX_TOOL_ROUNDS = 3;

router.post("/", async (req, res) => {
  try {
    const apiKey = process.env.SARVAM_API_KEY;
    if (!apiKey || apiKey === "your_key_here") {
      return res.status(503).json({
        error: "SARVAM_API_KEY not configured. Set it in server/.env",
      });
    }

    const { message, history = [] } = req.body;
    if (!message) {
      return res.status(400).json({ error: "message is required" });
    }

    const client = new SarvamAIClient({ apiSubscriptionKey: apiKey });

    // Keep last 10 messages (5 turns) for multi-turn context without ballooning token cost
    const messages = [
      { role: "system", content: SYSTEM_PROMPT },
      ...history.slice(-10),
      { role: "user", content: message },
    ];

    for (let round = 0; round < MAX_TOOL_ROUNDS; round++) {
      const response = await client.chat.completions({
        model: "sarvam-30b",
        messages,
        tools: toolDefinitions,
        tool_choice: "auto",
      });

      const choice = response.choices[0];
      const assistantMsg = choice.message;

      if (!assistantMsg.tool_calls || assistantMsg.tool_calls.length === 0) {
        return res.json({ reply: assistantMsg.content });
      }

      messages.push({
        role: "assistant",
        content: assistantMsg.content || null,
        tool_calls: assistantMsg.tool_calls,
      });

      for (const toolCall of assistantMsg.tool_calls) {
        const fnName = toolCall.function.name;
        let fnArgs = {};
        try {
          fnArgs = JSON.parse(toolCall.function.arguments);
        } catch {
          // empty args if parse fails
        }

        console.log(`[Agent] Tool call: ${fnName}(${JSON.stringify(fnArgs)})`);
        const result = executeTool(fnName, fnArgs);

        messages.push({
          role: "tool",
          tool_call_id: toolCall.id,
          content: JSON.stringify(result),
        });
      }
    }

    // Exhausted tool rounds — do one final call without tools to force a text answer
    const finalResponse = await client.chat.completions({
      model: "sarvam-30b",
      messages,
    });

    return res.json({
      reply:
        finalResponse.choices[0].message.content ||
        "I couldn't complete that analysis. Please try again.",
    });
  } catch (err) {
    console.error("[Chat Error]", err);
    return res.status(500).json({
      error: "Chat request failed",
      details: err.message,
    });
  }
});

module.exports = router;
