export type ActNumber = 1 | 2 | 3 | 4 | 5;

export type Perspective =
  | "Romeo"
  | "Juliet"
  | "Mercutio"
  | "Friar Laurence"
  | "Nurse"
  | "Benvolio"
  | "Tybalt"
  | "Paris"
  | "Capulet"
  | "Prince"
  | "Balthasar"
  | "Messenger"
  | "Watchman";

export type InventoryItem =
  | "capulet-mask"
  | "silver-ring"
  | "duel-scar"
  | "friars-letter"
  | "sleeping-vial"
  | "watch-torch";

export const ENDING_GATE_ID = "ENDING_GATE" as const;

export type SceneId = `a${ActNumber}_${string}`;
export type NodeId = SceneId | typeof ENDING_GATE_ID;

export type ChoiceTone = "impulse" | "restraint" | "omen";

export interface SceneChoice {
  id: string;
  tone: ChoiceTone;
  label: string;
  note: string;
  nextId: NodeId;
  fateShift: number;
  luckBias: number;
  addItems?: InventoryItem[];
  requireItems?: InventoryItem[];
}

export interface SceneNode {
  id: SceneId;
  act: ActNumber;
  title: string;
  perspective: Perspective;
  narration: string;
  quote: string;
  citation: string;
  tags: string[];
  choices: SceneChoice[];
}

export type EndingId =
  | "A"
  | "B"
  | "C"
  | "D";

export interface EndingDefinition {
  id: EndingId;
  title: string;
  summary: string;
  unlockHint: string;
  fateRange: [number, number];
  luckRange: [number, number];
  axisPoint: {
    fate: number;
    luck: number;
  };
}

export interface TurnLogEntry {
  turn: number;
  sceneId: SceneId;
  sceneTitle: string;
  choiceId: string;
  choiceLabel: string;
  luckRoll: number;
  adjustedRoll: number;
  luckShift: number;
  fateShift: number;
  fateAfter: number;
  luckAfter: number;
  note: string;
  inventoryAfter: InventoryItem[];
}

export interface StoryState {
  currentSceneId: SceneId;
  fate: number;
  luck: number;
  inventory: InventoryItem[];
  turn: number;
  history: TurnLogEntry[];
  ending: EndingDefinition | null;
}
