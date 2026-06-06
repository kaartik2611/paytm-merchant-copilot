Voice-first assistant — idle / listening / processing / responding, for consumer (send money, balance, search) and merchant (sales, inventory, business) questions.

```jsx
<VoiceAssistant audience="consumer" />            // uncontrolled — tap to cycle states
<VoiceAssistant state="listening" transcript="Send ₹500 to Mom" />   // controlled
```

- The orb uses the AI sheen; pulse rings animate while listening, the core breathes while processing. Animations respect `prefers-reduced-motion`.
- Pass `state` + `onStateChange` to drive it from real speech events; omit to walk the demo cycle on tap.
