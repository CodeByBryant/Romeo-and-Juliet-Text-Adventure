import { useMemo, useState } from "react";
import {
  ENDINGS,
  START_SCENE_ID,
  STORY_NODE_MAP,
  STORY_NODES,
} from "../data/story";
import {
  clampStat,
  evaluateLuck,
  isChoiceLocked,
  luckText,
  resolveEnding,
  rollD10,
} from "../lib/engine";
import {
  ENDING_GATE_ID,
  type SceneChoice,
  type SceneId,
  type StoryState,
} from "../types/game";

interface ChoiceWithLock extends SceneChoice {
  locked: boolean;
}

function createInitialState(): StoryState {
  return {
    currentSceneId: START_SCENE_ID,
    fate: 0,
    luck: 0,
    inventory: [],
    turn: 0,
    history: [],
    ending: null,
  };
}

export function useStoryEngine() {
  const [state, setState] = useState<StoryState>(createInitialState);

  const currentScene = STORY_NODE_MAP.get(state.currentSceneId);

  const choices = useMemo<ChoiceWithLock[]>(() => {
    if (!currentScene) {
      return [];
    }

    return currentScene.choices.map((choice) => ({
      ...choice,
      locked: isChoiceLocked(choice, state),
    }));
  }, [currentScene, state]);

  const choose = (choiceId: string) => {
    setState((previous) => {
      if (previous.ending) {
        return previous;
      }

      const scene = STORY_NODE_MAP.get(previous.currentSceneId);
      if (!scene) {
        return previous;
      }

      const choice = scene.choices.find(
        (candidate) => candidate.id === choiceId,
      );
      if (!choice || isChoiceLocked(choice, previous)) {
        return previous;
      }

      const roll = rollD10();
      const { adjustedRoll, luckShift } = evaluateLuck(roll, choice.luckBias);
      const criticalFateSwing = luckShift === 2 ? 1 : luckShift === -2 ? -1 : 0;
      const totalFateShift = choice.fateShift + criticalFateSwing;

      const fate = clampStat(previous.fate + totalFateShift);
      const luck = clampStat(previous.luck + luckShift);
      const inventory = Array.from(
        new Set([...previous.inventory, ...(choice.addItems ?? [])]),
      );

      const turn = previous.turn + 1;

      const historyEntry = {
        turn,
        sceneId: scene.id,
        sceneTitle: scene.title,
        choiceId: choice.id,
        choiceLabel: choice.label,
        luckRoll: roll,
        adjustedRoll,
        luckShift,
        fateShift: totalFateShift,
        fateAfter: fate,
        luckAfter: luck,
        note: `${choice.note} ${luckText(luckShift)}`,
        inventoryAfter: inventory,
      };

      if (choice.nextId === ENDING_GATE_ID) {
        return {
          ...previous,
          fate,
          luck,
          inventory,
          turn,
          history: [historyEntry, ...previous.history],
          ending: resolveEnding(ENDINGS, fate, luck),
        };
      }

      return {
        ...previous,
        currentSceneId: choice.nextId as SceneId,
        fate,
        luck,
        inventory,
        turn,
        history: [historyEntry, ...previous.history],
      };
    });
  };

  const reset = () => {
    setState(createInitialState());
  };

  return {
    state,
    currentScene,
    choices,
    choose,
    reset,
    endings: ENDINGS,
    totalNodes: STORY_NODES.length,
  };
}
