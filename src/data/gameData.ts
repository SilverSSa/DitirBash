import { Biome, Weapon, InventoryItem, CraftingRecipe } from '../types/game';

export const BIOMES: Record<string, Biome> = {
  verdant_hollow: {
    id: 'verdant_hollow',
    name: 'Verdant Hollow',
    color: '#22c55e',
    effects: [],
    enemies: ['deer', 'wolf'],
    resources: ['soul_flower', 'wood'],
    boss: 'forest_guardian'
  },
  ash_dunes: {
    id: 'ash_dunes',
    name: 'Ash Dunes',
    color: '#f97316',
    effects: [{ type: 'heat', intensity: 1, interval: 5000 }],
    enemies: ['lizard', 'sand_worm'],
    resources: ['ancient_ether', 'stone'],
    boss: 'flame_titan'
  },
  frozen_grief: {
    id: 'frozen_grief',
    name: 'Frozen Grief',
    color: '#3b82f6',
    effects: [
      { type: 'cold', intensity: 1, interval: 3000 },
      { type: 'sanity_drain', intensity: 2, interval: 10000 }
    ],
    enemies: ['ice_wraith', 'frost_bear'],
    resources: ['dark_ether', 'stone'],
    boss: 'ice_queen'
  },
  crystal_rift: {
    id: 'crystal_rift',
    name: 'Crystal Rift',
    color: '#8b5cf6',
    effects: [{ type: 'sanity_drain', intensity: 3, interval: 8000 }],
    enemies: ['crystal_spider', 'void_stalker'],
    resources: ['dark_ether', 'ancient_ether'],
    boss: 'crystal_lord'
  }
};

export const WEAPONS: Record<string, Weapon> = {
  soul_sword: {
    id: 'soul_sword',
    name: 'Soul Sword',
    damage: 25,
    range: 50,
    type: 'melee',
    element: 'dark',
    cooldown: 1000,
    soulCost: 5
  },
  spirit_bow: {
    id: 'spirit_bow',
    name: 'Spirit Bow',
    damage: 20,
    range: 150,
    type: 'ranged',
    element: 'air',
    cooldown: 1500,
    soulCost: 8
  },
  blizzard_staff: {
    id: 'blizzard_staff',
    name: 'Blizzard Staff',
    damage: 30,
    range: 100,
    type: 'magic',
    element: 'water',
    cooldown: 2000,
    soulCost: 12
  },
  dark_claw: {
    id: 'dark_claw',
    name: 'Dark Claw',
    damage: 35,
    range: 40,
    type: 'melee',
    element: 'dark',
    cooldown: 800,
    soulCost: 10
  }
};

export const ITEMS: Record<string, InventoryItem> = {
  soul_flower: {
    id: 'soul_flower',
    name: 'Soul Flower',
    type: 'resource',
    quantity: 1,
    description: 'A glowing flower that restores sanity',
    icon: '🌸'
  },
  ancient_ether: {
    id: 'ancient_ether',
    name: 'Ancient Ether',
    type: 'resource',
    quantity: 1,
    description: 'Pure energy used for crafting',
    icon: '✨'
  },
  dark_ether: {
    id: 'dark_ether',
    name: 'Dark Ether',
    type: 'resource',
    quantity: 1,
    description: 'Corrupted energy with dark properties',
    icon: '🌑'
  },
  sanity_potion: {
    id: 'sanity_potion',
    name: 'Sanity Potion',
    type: 'consumable',
    quantity: 1,
    description: 'Restores 50 sanity points',
    icon: '🧪'
  },
  health_potion: {
    id: 'health_potion',
    name: 'Health Potion',
    type: 'consumable',
    quantity: 1,
    description: 'Restores 50 health points',
    icon: '❤️'
  }
};

export const CRAFTING_RECIPES: CraftingRecipe[] = [
  {
    id: 'soul_sword_recipe',
    name: 'Soul Sword',
    result: { ...ITEMS.soul_flower, id: 'soul_sword', name: 'Soul Sword', type: 'weapon' },
    ingredients: [
      { itemId: 'soul_flower', quantity: 3 },
      { itemId: 'ancient_ether', quantity: 2 }
    ],
    station: 'mixer'
  },
  {
    id: 'sanity_potion_recipe',
    name: 'Sanity Potion',
    result: ITEMS.sanity_potion,
    ingredients: [
      { itemId: 'soul_flower', quantity: 2 },
      { itemId: 'ancient_ether', quantity: 1 }
    ],
    station: 'mixer'
  },
  {
    id: 'health_potion_recipe',
    name: 'Health Potion',
    result: ITEMS.health_potion,
    ingredients: [
      { itemId: 'soul_flower', quantity: 1 },
      { itemId: 'ancient_ether', quantity: 1 }
    ],
    station: 'lightforge'
  }
];