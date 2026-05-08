import type { SceneNode } from "../types/game";
import { TypewriterText } from "./TypewriterText";

interface SceneViewportProps {
  scene: SceneNode | undefined;
}

export function SceneViewport({ scene }: SceneViewportProps) {
  if (!scene) {
    return (
      <section className="panel scene-viewport">
        <h2>Scene data missing</h2>
        <p>The current scene could not be found in the story graph.</p>
      </section>
    );
  }

  return (
    <section className="panel scene-viewport reveal">
      <p className="eyebrow">Act {scene.act} · Romeo</p>
      <h2>{scene.title}</h2>
      <TypewriterText text={scene.narration} className="narration" />
      <blockquote>
        <p>"{scene.quote}"</p>
        <cite>{scene.citation}</cite>
      </blockquote>
    </section>
  );
}
