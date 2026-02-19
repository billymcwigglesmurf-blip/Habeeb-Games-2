
export interface Game {
  id: string;
  title: string;
  description: string;
  category: GameCategory;
  thumbnail: string;
  iframeUrl: string;
  isHot?: boolean;
}

export enum GameCategory {
  ACTION = 'Action',
  PUZZLE = 'Puzzle',
  ARCADE = 'Arcade',
  SPORTS = 'Sports',
  CLASSIC = 'Classic',
  STRATEGY = 'Strategy'
}

export type LayoutView = 'grid' | 'list';
