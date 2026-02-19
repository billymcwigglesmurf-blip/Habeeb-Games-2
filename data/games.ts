import { Game, GameCategory } from '../types.ts';

export const GAMES_DATA: Game[] = [
  {
    id: 'house-of-hazards',
    title: 'House of Hazards',
    description: 'Complete household chores while dodging ridiculous traps set by your opponents! A hilarious physics-based multiplayer challenge.',
    category: GameCategory.ACTION,
    thumbnail: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?q=80&w=800&auto=format&fit=crop',
    iframeUrl: '/files/houseofhazards/index.html',
    isHot: true
  }
];