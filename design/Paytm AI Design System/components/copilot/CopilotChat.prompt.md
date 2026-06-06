Paytm AI Copilot — the conversational assistant surface, as a full-height mobile sheet or a docked web panel.

```jsx
<CopilotChat
  surface="mobile"            // mobile | web
  subtitle="Your money assistant"
  suggestedPrompts={["Where did my money go?", "Pay my electricity bill"]}
  getReply={(q) => "…"}      // swap for a real model call
  onClose={...}
/>
```

- Ships with header (AIAvatar + live status), message stream, typing indicator, suggested prompts (shown until the first reply), and a composer with a voice button.
- `getReply` is a stub for the demo — wire it to your backend. Conversation history is held in component state.
