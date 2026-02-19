import { Game, GameCategory } from '../types.ts';

export const GAMES_DATA: Game[] = [
  {
    id: 'slope',
    title: 'Slope',
    description: 'A fast-paced 3D running game where you navigate a ball through a futuristic neon city while avoiding obstacles and falling off the edge.',
    category: GameCategory.ARCADE,
    thumbnail: 'https://images.unsplash.com/photo-1614850523296-d8c1af93d400?q=80&w=800&auto=format&fit=crop',
    iframeUrl: 'https://plain.slope.run/',
    isHot: true
  },
  {
    id: '2048',
    title: '2048',
    description: 'Join the numbers and get to the 2048 tile! A classic addictive puzzle game that requires strategy and foresight.',
    category: GameCategory.PUZZLE,
    thumbnail: 'https://images.unsplash.com/photo-1553481187-be93c21490a9?q=80&w=800&auto=format&fit=crop',
    iframeUrl: 'https://2048game.com/',
    isHot: false
  },
  {
    id: 'minecraft-classic',
    title: 'Minecraft Classic',
    description: 'The original creative building game. Play the classic version of Minecraft in your browser with up to 9 friends.',
    category: GameCategory.CLASSIC,
    thumbnail: 'https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?q=80&w=800&auto=format&fit=crop',
    iframeUrl: 'https://classic.minecraft.net/',
    isHot: true
  },
  {
    id: 'cookie-clicker',
    title: 'Cookie Clicker',
    description: 'The ultimate idle game. Bake billions of cookies by clicking and hiring grandmas, building farms, and more.',
    category: GameCategory.ARCADE,
    thumbnail: 'https://images.unsplash.com/photo-1499636136210-6f4ee915583e?q=80&w=800&auto=format&fit=crop',
    iframeUrl: 'https://orteil.dashnet.org/cookieclicker/',
    isHot: false
  },
  {
    id: 'vex-3',
    title: 'Vex 3',
    description: 'A challenging platformer where you must jump, climb, and slide your way through dangerous levels filled with traps.',
    category: GameCategory.ACTION,
    thumbnail: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=800&auto=format&fit=crop',
    iframeUrl: 'https://vex3.io/',
    isHot: true
  }
];