import type { EndingDefinition, EndingId } from "../types/game";

interface EndingGraphProps {
  endings: EndingDefinition[];
  fate: number;
  luck: number;
  activeEndingId: EndingId | null;
}

const WIDTH = 420;
const HEIGHT = 280;
const PADDING = 28;

function toX(fate: number) {
  return PADDING + ((fate + 30) / 60) * (WIDTH - PADDING * 2);
}

function toY(luck: number) {
  return HEIGHT - PADDING - ((luck + 30) / 60) * (HEIGHT - PADDING * 2);
}

export function EndingGraph({
  endings,
  fate,
  luck,
  activeEndingId,
}: EndingGraphProps) {
  const playerX = toX(fate);
  const playerY = toY(luck);

  return (
    <section className="panel ending-graph reveal">
      <h3>Endings map (X=fate, Y=luck)</h3>
      <svg
        viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
        role="img"
        aria-label="Ending graph showing fate on x axis and luck on y axis"
      >
        <rect x="0" y="0" width={WIDTH} height={HEIGHT} rx="16" />

        <line
          x1={PADDING}
          y1={HEIGHT / 2}
          x2={WIDTH - PADDING}
          y2={HEIGHT / 2}
        />
        <line
          x1={WIDTH / 2}
          y1={PADDING}
          x2={WIDTH / 2}
          y2={HEIGHT - PADDING}
        />

        {endings.map((ending) => {
          const active = ending.id === activeEndingId;
          return (
            <g key={ending.id} className={active ? "active-ending" : ""}>
              <circle
                cx={toX(ending.axisPoint.fate)}
                cy={toY(ending.axisPoint.luck)}
                r={active ? 9 : 7}
              >
                <title>
                  {ending.id}: {ending.title}
                </title>
              </circle>
              <text
                x={toX(ending.axisPoint.fate) + 10}
                y={toY(ending.axisPoint.luck) - 8}
              >
                {ending.id}
              </text>
            </g>
          );
        })}

        <g className="player-point">
          <circle cx={playerX} cy={playerY} r={7} />
          <text x={playerX + 10} y={playerY + 14}>
            You
          </text>
        </g>
      </svg>
      <p className="hint">
        Current coordinates: fate {fate}, luck {luck}
      </p>
    </section>
  );
}
