import type { SceneChoice } from "../types/game";

interface ChoiceWithLock extends SceneChoice {
  locked: boolean;
}

interface ChoiceDeckProps {
  choices: ChoiceWithLock[];
  onChoose: (choiceId: string) => void;
}

export function ChoiceDeck({ choices, onChoose }: ChoiceDeckProps) {
  return (
    <section className="panel choice-deck reveal">
      <h3>What will you do?</h3>
      <p className="hint">Choose a clear action to move the story forward.</p>
      <div className="choice-list">
        {choices.map((choice, index) => {
          return (
            <button
              key={choice.id}
              type="button"
              className={`choice choice-${choice.tone}`}
              onClick={() => onChoose(choice.id)}
              disabled={choice.locked}
              title={
                choice.locked
                  ? "Locked: find the right item to unlock this choice."
                  : "Choose this action."
              }
              style={{ animationDelay: `${index * 80}ms` }}
            >
              <span className="choice-number">{index + 1}.</span>
              <span className="choice-label">{choice.label}</span>
              {choice.locked ? (
                <span className="choice-locked">Locked</span>
              ) : null}
            </button>
          );
        })}
      </div>
    </section>
  );
}
