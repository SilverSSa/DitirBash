export interface Player {
  id: string;
  name: string;
  x: number;
  y: number;
  health: number;
  maxHealth: number;
  sanity: number;
  maxSanity: number;
  souls: number;
  shards: number;
  level: number;
  xp: number;
  inventory: InventoryItem[];
  equippedWeapon: Weapon | null;
  lightRadius: number;
  isMoving: boolean;
  direction: number;
}

export interface InventoryItem {
  id: string;
  name: string;
  type: 'resource' | 'weapon' | 'consumable' | 'tool';
  quantity: number;
  description: string;
  icon: string;
}

export interface Weapon {
  id: string;
  name: string;
  damage: number;
  range: number;
  type: 'melee' | 'ranged' | 'magic';
  element: 'fire' | 'water' | 'stone' | 'air' | 'dark';
  cooldown: number;
  soulCost: number;
}

export interface Enemy {
  id: string;
  name: string;
  x: number;
  y: number;
  health: number;
  maxHealth: number;
  damage: number;
  speed: number;
  type: 'passive' | 'neutral' | 'hostile' | 'boss';
  element: string;
  isDark: boolean;
  lastAttack: number;
}

export interface Resource {
  id: string;
  name: string;
  x: number;
  y: number;
  type: 'soul_flower' | 'ancient_ether' | 'dark_ether' | 'stone' | 'wood';
  quantity: number;
  respawnTime: number;
}

export interface Biome {
  id: string;
  name: string;
  color: string;
  effects: BiomeEffect[];
  enemies: string[];
  resources: string[];
  boss?: string;
}

export interface BiomeEffect {
  type: 'sanity_drain' | 'health_drain' | 'cold' | 'heat' | 'poison';
  intensity: number;
  interval: number;
}

export interface GameState {
  mode: 'roguelike' | 'survival';
  currentBiome: string;
  timeOfDay: number;
  weather: 'clear' | 'fog' | 'storm' | 'sandstorm';
  darkEyesActive: boolean;
  darkEyesCooldown: number;
  isPaused: boolean;
  gameTime: number;
}

export interface CraftingRecipe {
  id: string;
  name: string;
  result: InventoryItem;
  ingredients: { itemId: string; quantity: number }[];
  station: 'mixer' | 'lightforge' | 'shardforge' | 'soulbinder';
}