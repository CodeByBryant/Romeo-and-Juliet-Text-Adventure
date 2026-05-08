import type { TurnLogEntry } from '../types/game'

interface HistoryTapeProps {
  history: TurnLogEntry[]
}

export function HistoryTape({ history }: HistoryTapeProps) {
  const visible = history.slice(0, 8)

  return (
    <section className="panel history-tape reveal">
      <h3>Recent decisions</h3>
      {visible.length === 0 ? (
        <p className="hint">Your route log appears here after the first choice.</p>
      ) : (
        <ol>
          {visible.map((entry) => (
            <li key={`${entry.turn}-${entry.choiceId}`}>
              <header>
                <strong>Turn {entry.turn}</strong>
                <span>{entry.sceneId}</span>
              </header>
              <p className="title">{entry.sceneTitle}</p>
              <p>{entry.choiceLabel}</p>
              <p className="mini">
                Roll {entry.luckRoll} {'->'} {entry.adjustedRoll} | Fate{' '}
                {entry.fateAfter} | Luck {entry.luckAfter}
              </p>
            </li>
          ))}
        </ol>
      )}
    </section>
  )
}
