
export enum GameStatus {
  IDLE = 'IDLE',
  LOADING = 'LOADING',
  PLAYING = 'PLAYING',
  GAMEOVER = 'GAMEOVER'
}

export interface Target {
  id: string;
  x: number;
  y: number;
  color: string;
  radius: number;
  points: number;
  createdAt: number;
  duration: number;
  type: 'ball' | 'bug';
}

export interface HandPoint {
  x: number;
  y: number;
}

export interface GameState {
  score: number;
  highScore: number;
  status: GameStatus;
  targets: Target[];
  timeLeft: number;
}
