import type { EndingDefinition, SceneChoice, StoryState } from "../types/game";

export const MIN_STAT = -30;
export const MAX_STAT = 30;

export function clampStat(value: number) {
  return Math.max(MIN_STAT, Math.min(MAX_STAT, value));
}

export function rollD10() {
  return Math.floor(Math.random() * 10) + 1;
}

export function evaluateLuck(roll: number, luckBias: number) {
  const adjustedRoll = Math.max(1, Math.min(10, roll + luckBias));
  const luckShift =
    adjustedRoll >= 10
      ? 2
      : adjustedRoll >= 7
        ? 1
        : adjustedRoll >= 4
          ? 0
          : adjustedRoll >= 2
            ? -1
            : -2

  return {
    adjustedRoll,
    luckShift,
  };
}

export function luckText(luckShift: number) {
  if (luckShift >= 2) {
    return "Fortune surges in your favor.";
  }

  if (luckShift === 1) {
    return "The moment tilts slightly toward hope.";
  }

  if (luckShift === 0) {
    return "Luck stays neutral and choice carries the weight.";
  }

  if (luckShift === -1) {
    return "Chance pushes against your plan.";
  }

  return "Fortune strikes hard against you.";
}

export function isChoiceLocked(choice: SceneChoice, state: StoryState) {
  if (!choice.requireItems || choice.requireItems.length === 0) {
    return false;
  }

  return choice.requireItems.some(
    (required) => !state.inventory.includes(required),
  );
}

export function resolveEnding(
  endings: EndingDefinition[],
  fate: number,
  luck: number,
) {
  const ending = endings.find((candidate) => {
    const [fateMin, fateMax] = candidate.fateRange;
    const [luckMin, luckMax] = candidate.luckRange;

    return (
      fate >= fateMin && fate <= fateMax && luck >= luckMin && luck <= luckMax
    );
  });

  if (ending) {
    return ending;
  }

  return endings[endings.length - 1];
}
