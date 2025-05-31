
export type BattleType = 'human_vs_human' | 'ai_vs_ai' | 'human_vs_ai';

export const BATTLE_TYPES: Record<BattleType, string> = {
  human_vs_human: 'Human vs Human',
  ai_vs_ai: 'AI vs AI',
  human_vs_ai: 'Human vs AI'
};

export function isBattleType(value: string | null): value is BattleType {
  return value !== null && Object.keys(BATTLE_TYPES).includes(value);
}

export function getBattleTypeDisplay(battleType: string | null): string {
  if (isBattleType(battleType)) {
    return BATTLE_TYPES[battleType];
  }
  return 'Unknown Battle Type';
}
