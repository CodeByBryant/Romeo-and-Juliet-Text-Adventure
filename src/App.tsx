import { ChoiceDeck } from "./components/ChoiceDeck";
import { SceneViewport } from "./components/SceneViewport";
import { TypewriterText } from "./components/TypewriterText";
import { useStoryEngine } from "./hooks/useStoryEngine";

function App() {
  const { state, currentScene, choices, choose, reset } = useStoryEngine();

  return (
    <main className="app-shell adventure-shell">
      <header className="hero">
        <p className="kicker">A Shakespearean text adventure</p>
        <h1>Romeo + Juliet</h1>
        <p>
          Play as Romeo and step through Verona with every choice. Love, pride,
          and fate unravel one decision at a time.
        </p>
      </header>

      {state.ending ? (
        <section className="panel ending-panel reveal">
          <p className="eyebrow">Finale</p>
          <h2>{state.ending.title}</h2>
          <TypewriterText
            key={state.ending.id}
            text={state.ending.summary}
            className="narration"
          />
          <p className="ending-note">Begin again to discover another path.</p>
          <button type="button" className="restart" onClick={reset}>
            Begin Again
          </button>
        </section>
      ) : (
        <div className="adventure-layout">
          <SceneViewport scene={currentScene} />
          <ChoiceDeck choices={choices} onChoose={choose} />
        </div>
      )}
    </main>
  );
}

export default App;
