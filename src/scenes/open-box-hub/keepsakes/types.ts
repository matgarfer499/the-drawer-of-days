export interface KeepsakeIconProps {
  /**
   * Play the idle loop — true until the scene has been seen, then it freezes
   * (the "ya visto" signal). CSS `motion-safe:*` still gates it, so under
   * prefers-reduced-motion the icon rests still regardless.
   */
  animate: boolean;
  className?: string;
}
