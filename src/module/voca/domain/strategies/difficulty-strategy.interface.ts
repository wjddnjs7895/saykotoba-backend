export interface DifficultyStrategy {
  parseDifficulty(value: any): string;
  validateDifficulty(value: any): boolean;
}
