import { levels, type LevelId } from "../data/scenarios";

export const GAME_PROGRESS_KEY = "hunch_game_progress";
export type GameStatus = "active" | "completed";

export type SavedGameProgress = {
  currentLevel: LevelId;
  currentRound: number;
  gameStatus: GameStatus;
  totalXP: number;
  currentStreak: number;
  bestStreak: number;
  correctAnswers: number;
  completedLevels: number[];
  stage: "hunch" | "action" | "reveal" | "scoreboard";
  selectedChoice: string | null;
  selectedAction: string | null;
  roundXP: number;
  baseRoundXP: number;
  streakBonus: number;
  levelXP: number;
  levelCorrectHunches: number;
  levelCorrectDecisions: number;
};

const levelIds: LevelId[] = ["instinct", "suspicion", "deep-hunch"];
const stages = ["hunch", "action", "reveal", "scoreboard"] as const;

function isNonNegativeInteger(value: unknown): value is number {
  return typeof value === "number" && Number.isInteger(value) && value >= 0;
}

function isValidProgress(value: unknown): value is Partial<SavedGameProgress> {
  if (!value || typeof value !== "object") return false;
  const progress = value as Partial<SavedGameProgress>;
  const level = levels.find((item) => item.id === progress.currentLevel);
  return levelIds.includes(progress.currentLevel as LevelId)
    && isNonNegativeInteger(progress.currentRound)
    && progress.currentRound >= 0
    && !!level
    && progress.currentRound < level.scenarioSet.length
    && isNonNegativeInteger(progress.totalXP)
    && isNonNegativeInteger(progress.currentStreak)
    && isNonNegativeInteger(progress.bestStreak)
    && isNonNegativeInteger(progress.correctAnswers)
    && Array.isArray(progress.completedLevels)
    && progress.completedLevels.every((level) => isNonNegativeInteger(level) && level >= 1 && level <= levelIds.length)
    && stages.includes(progress.stage as typeof stages[number])
    && (progress.selectedChoice === null || typeof progress.selectedChoice === "string")
    && (progress.selectedAction === null || typeof progress.selectedAction === "string")
    && isNonNegativeInteger(progress.roundXP)
    && isNonNegativeInteger(progress.baseRoundXP)
    && isNonNegativeInteger(progress.streakBonus)
    && isNonNegativeInteger(progress.levelXP)
    && isNonNegativeInteger(progress.levelCorrectHunches)
    && isNonNegativeInteger(progress.levelCorrectDecisions)
    && (progress.gameStatus === undefined || progress.gameStatus === "active" || progress.gameStatus === "completed");
}

export function loadGameProgress(): SavedGameProgress | null {
  try {
    const rawProgress = window.localStorage.getItem(GAME_PROGRESS_KEY);
    if (!rawProgress) return null;
    const parsedProgress: unknown = JSON.parse(rawProgress);
    if (!isValidProgress(parsedProgress)) {
      window.localStorage.removeItem(GAME_PROGRESS_KEY);
      return null;
    }
    const progress = parsedProgress as Partial<SavedGameProgress>;
    const isCompleted = progress.gameStatus === "completed"
      || progress.completedLevels?.length === levels.length
      || (progress.currentLevel === levels[levels.length - 1].id && progress.stage === "scoreboard");
    return { ...progress, gameStatus: isCompleted ? "completed" : "active" } as SavedGameProgress;
  } catch {
    try {
      window.localStorage.removeItem(GAME_PROGRESS_KEY);
    } catch {
      return null;
    }
    return null;
  }
}

export function saveGameProgress(progress: SavedGameProgress) {
  try {
    window.localStorage.setItem(GAME_PROGRESS_KEY, JSON.stringify(progress));
  } catch {
    return;
  }
}

export function clearGameProgress() {
  try {
    window.localStorage.removeItem(GAME_PROGRESS_KEY);
  } catch {
    return;
  }
}
