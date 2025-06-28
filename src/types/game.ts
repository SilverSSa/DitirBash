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
  darkEtherXP: number;
  sanityResistance: number;
}

export interface InventoryItem {
  id: string;
  name: string;
  type: 'resource' | 'weapon' | 'consumable' | 'tool';
  quantity: number;
  description: string;
  icon: string;
  rarity?: 'common' | 'rare' | 'epic' | 'legendary';
  value?: number;
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
  description: string;
  icon: string;
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
  xpReward: number;
  soulReward: number;
  lootTable: string[];
}

export interface Resource {
  id: string;
  name: string;
  x: number;
  y: number;
  type: 'soul_flower' | 'ancient_ether' | 'dark_ether' | 'stone' | 'wood';
  quantity: number;
  respawnTime: number;
  rarity: 'common' | 'rare' | 'epic';
}

export interface Biome {
  id: string;
  name: string;
  color: string;
  effects: BiomeEffect[];
  enemies: string[];
  resources: string[];
  boss?: string;
  description: string;
  dangerLevel: number;
}

export interface BiomeEffect {
  type: 'sanity_drain' | 'health_drain' | 'cold' | 'heat' | 'poison' | 'mutation';
  intensity: number;
  interval: number;
  description: string;
}

export interface GameState {
  mode: 'roguelike' | 'survival';
  currentBiome: string;
  currentRealm: 'Normal World' | 'Upside-Down' | 'DarkEther Realm';
  timeOfDay: number;
  weather: 'clear' | 'fog' | 'storm' | 'sandstorm';
  darkEyesActive: boolean;
  darkEyesCooldown: number;
  isPaused: boolean;
  gameTime: number;
  staticLights: StaticLight[];
  bossesDefeated: string[];
  worldSeed: string;
  difficulty: number;
}

export interface StaticLight {
  id: string;
  x: number;
  y: number;
  radius: number;
  color: string;
  type: 'orb' | 'purple_orb' | 'beacon';
  fuel: number;
  maxFuel: number;
}

export interface CraftingRecipe {
  id: string;
  name: string;
  result: InventoryItem;
  ingredients: { itemId: string; quantity: number }[];
  station: 'mixer' | 'lightforge' | 'shardforge' | 'soulbinder';
  description: string;
  unlockLevel: number;
}

export interface CraftingStation {
  id: string;
  name: string;
  type: 'mixer' | 'lightforge' | 'shardforge' | 'soulbinder';
  x: number;
  y: number;
  recipes: string[];
  isActive: boolean;
}

export interface Boss {
  id: string;
  name: string;
  biome: string;
  health: number;
  maxHealth: number;
  phases: BossPhase[];
  currentPhase: number;
  abilities: BossAbility[];
  lootTable: InventoryItem[];
  isDefeated: boolean;
}

export interface BossPhase {
  healthThreshold: number;
  abilities: string[];
  behavior: 'aggressive' | 'defensive' | 'berserker';
}

export interface BossAbility {
  id: string;
  name: string;
  damage: number;
  range: number;
  cooldown: number;
  effect: string;
}