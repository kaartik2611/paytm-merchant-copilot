import * as React from "react";

export type VoiceState = "idle" | "listening" | "processing" | "responding";

/**
 * @startingPoint section="AI Copilot" subtitle="Voice-first assistant — four states" viewport="360x420"
 */
export interface VoiceAssistantProps {
  /** Controlled state. Omit to let the orb walk the demo cycle on tap. */
  state?: VoiceState;
  onStateChange?: (state: VoiceState) => void;
  /** What the user said (shown while listening). */
  transcript?: string;
  /** The assistant's reply (shown while responding). */
  response?: string;
  /** Tunes the default demo copy. */
  audience?: "consumer" | "merchant";
  className?: string;
  style?: React.CSSProperties;
}

/** Voice-first assistant surface with idle / listening / processing / responding states. */
export function VoiceAssistant(props: VoiceAssistantProps): React.JSX.Element;
