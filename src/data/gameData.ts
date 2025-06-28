import { Biome, Weapon, InventoryItem, CraftingRecipe, Boss } from '../types/game';

export const BIOMES: Record<string, Biome> = {
  verdant_hollow: {
    id: 'verdant_hollow',
    name: 'Verdant Hollow',
    color: '#22c55e',
    description: 'A peaceful forest biome with abundant soul flowers and gentle creatures.',
    dangerLevel: 1,
    effects: [],
    enemies: ['deer', 'wolf'],
    resources: ['soul_flower', 'wood'],
    boss: 'forest_guardian'
  },
  ash_dunes: {
    id: 'ash_dunes',
    name: 'Ash Dunes',
    color: '#f97316',
    description: 'Scorching desert wasteland with extreme heat and dangerous predators.',
    dangerLevel: 3,
    effects: [{ 
      type: 'heat', 
      intensity: 1, 
      interval: 5000,
      description: 'Extreme heat drains health over time'
    }],
    enemies: ['lizard', 'sand_worm'],
    resources: ['ancient_ether', 'stone'],
    boss: 'flame_titan'
  },
  frozen_grief: {
    id: 'frozen_grief',
    name: 'Frozen Grief',
    color: '#3b82f6',
    description: 'Cursed frozen wasteland where despair seeps into your very soul.',
    dangerLevel: 4,
    effects: [
      { 
        type: 'cold', 
        intensity: 1, 
        interval: 3000,
        description: 'Freezing cold slows movement and drains health'
      },
      { 
        type: 'sanity_drain', 
        intensity: 2, 
        interval: 10000,
        description: 'The cursed atmosphere erodes your sanity'
      }
    ],
    enemies: ['ice_wraith', 'frost_bear'],
    resources: ['dark_ether', 'stone'],
    boss: 'ice_queen'
  },
  crystal_rift: {
    id: 'crystal_rift',
    name: 'Crystal Rift',
    color: '#8b5cf6',
    description: 'Twisted crystalline realm where reality bends and dark energy flows.',
    dangerLevel: 5,
    effects: [{ 
      type: 'sanity_drain', 
      intensity: 3, 
      interval: 8000,
      description: 'Crystal resonance causes severe mental strain'
    }],
    enemies: ['crystal_spider', 'void_stalker'],
    resources: ['dark_ether', 'ancient_ether'],
    boss: 'crystal_lord'
  },
  plaguelands: {
    id: 'plaguelands',
    name: 'Plaguelands',
    color: '#84cc16',
    description: 'Toxic swampland where poison flows and healing is blocked.',
    dangerLevel: 4,
    effects: [
      { 
        type: 'poison', 
        intensity: 2, 
        interval: 4000,
        description: 'Toxic air poisons you continuously'
      }
    ],
    enemies: ['plague_rat', 'toxic_slime'],
    resources: ['dark_ether', 'wood'],
    boss: 'plague_lord'
  },
  sky_islands: {
    id: 'sky_islands',
    name: 'Sky Islands',
    color: '#06b6d4',
    description: 'Floating islands in the void with dimension-walking creatures.',
    dangerLevel: 5,
    effects: [],
    enemies: ['dimension_walker', 'void_bird'],
    resources: ['ancient_ether', 'stone'],
    boss: 'sky_titan'
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
    soulCost: 5,
    description: 'A blade forged from pure soul essence, cuts through both flesh and spirit.',
    icon: '⚔️'
  },
  spirit_bow: {
    id: 'spirit_bow',
    name: 'Spirit Bow',
    damage: 20,
    range: 150,
    type: 'ranged',
    element: 'air',
    cooldown: 1500,
    soulCost: 8,
    description: 'Ethereal bow that fires arrows of condensed air magic.',
    icon: '🏹'
  },
  blizzard_staff: {
    id: 'blizzard_staff',
    name: 'Blizzard Staff',
    damage: 30,
    range: 100,
    type: 'magic',
    element: 'water',
    cooldown: 2000,
    soulCost: 12,
    description: 'Ancient staff that channels the fury of eternal winter.',
    icon: '🔮'
  },
  dark_claw: {
    id: 'dark_claw',
    name: 'Dark Claw',
    damage: 35,
    range: 40,
    type: 'melee',
    element: 'dark',
    cooldown: 800,
    soulCost: 10,
    description: 'Twisted gauntlet infused with dark ether, tears through reality itself.',
    icon: '🖤'
  },
  shadow_shard: {
    id: 'shadow_shard',
    name: 'Shadow Shard',
    damage: 40,
    range: 120,
    type: 'ranged',
    element: 'dark',
    cooldown: 2500,
    soulCost: 15,
    description: 'Crystallized darkness that pierces through multiple enemies.',
    icon: '💎'
  }
};

export const ITEMS: Record<string, InventoryItem> = {
  soul_flower: {
    id: 'soul_flower',
    name: 'Soul Flower',
    type: 'resource',
    quantity: 1,
    description: 'A luminescent flower that blooms in areas of high spiritual energy. Restores sanity when consumed.',
    icon: '🌸',
    rarity: 'common',
    value: 5
  },
  ancient_ether: {
    id: 'ancient_ether',
    name: 'Ancient Ether',
    type: 'resource',
    quantity: 1,
    description: 'Pure crystallized energy from the old world. Essential for crafting powerful items.',
    icon: '✨',
    rarity: 'rare',
    value: 15
  },
  dark_ether: {
    id: 'dark_ether',
    name: 'Dark Ether',
    type: 'resource',
    quantity: 1,
    description: 'Corrupted energy that pulses with malevolent power. Handle with extreme caution.',
    icon: '🌑',
    rarity: 'epic',
    value: 25
  },
  stone: {
    id: 'stone',
    name: 'Stone',
    type: 'resource',
    quantity: 1,
    description: 'Common building material found throughout the realms.',
    icon: '🪨',
    rarity: 'common',
    value: 2
  },
  wood: {
    id: 'wood',
    name: 'Wood',
    type: 'resource',
    quantity: 1,
    description: 'Sturdy timber from the Verdant Hollow. Used in basic crafting.',
    icon: '🪵',
    rarity: 'common',
    value: 3
  },
  sanity_potion: {
    id: 'sanity_potion',
    name: 'Sanity Potion',
    type: 'consumable',
    quantity: 1,
    description: 'A shimmering elixir that clears the mind and restores 50 sanity points.',
    icon: '🧪',
    rarity: 'common',
    value: 20
  },
  health_potion: {
    id: 'health_potion',
    name: 'Health Potion',
    type: 'consumable',
    quantity: 1,
    description: 'Crimson liquid that mends wounds and restores 50 health points.',
    icon: '❤️',
    rarity: 'common',
    value: 18
  },
  light_orb: {
    id: 'light_orb',
    name: 'Light Orb',
    type: 'tool',
    quantity: 1,
    description: 'A portable light source that follows you and illuminates dark areas.',
    icon: '💡',
    rarity: 'rare',
    value: 30
  },
  purple_orb: {
    id: 'purple_orb',
    name: 'Purple Orb',
    type: 'tool',
    quantity: 1,
    description: 'Sanity-safe light source that protects against mental corruption.',
    icon: '🔮',
    rarity: 'epic',
    value: 50
  },
  ether_cleanser: {
    id: 'ether_cleanser',
    name: 'Ether Cleanser',
    type: 'consumable',
    quantity: 1,
    description: 'Purifies dark ether corruption and removes negative status effects.',
    icon: '🧼',
    rarity: 'rare',
    value: 40
  },
  shard_binder: {
    id: 'shard_binder',
    name: 'Shard Binder',
    type: 'tool',
    quantity: 1,
    description: 'One-use device that creates a save point, preventing total loss on death.',
    icon: '💾',
    rarity: 'legendary',
    value: 100
  }
};

export const CRAFTING_RECIPES: CraftingRecipe[] = [
  {
    id: 'soul_sword_recipe',
    name: 'Soul Sword',
    result: { ...ITEMS.soul_flower, ...WEAPONS.soul_sword, type: 'weapon' as const },
    ingredients: [
      { itemId: 'soul_flower', quantity: 3 },
      { itemId: 'ancient_ether', quantity: 2 }
    ],
    station: 'mixer',
    description: 'Forge a blade from soul essence and ancient power.',
    unlockLevel: 1
  },
  {
    id: 'spirit_bow_recipe',
    name: 'Spirit Bow',
    result: { ...ITEMS.ancient_ether, ...WEAPONS.spirit_bow, type: 'weapon' as const },
    ingredients: [
      { itemId: 'wood', quantity: 4 },
      { itemId: 'ancient_ether', quantity: 3 }
    ],
    station: 'mixer',
    description: 'Craft an ethereal bow that fires spirit arrows.',
    unlockLevel: 2
  },
  {
    id: 'dark_claw_recipe',
    name: 'Dark Claw',
    result: { ...ITEMS.dark_ether, ...WEAPONS.dark_claw, type: 'weapon' as const },
    ingredients: [
      { itemId: 'dark_ether', quantity: 2 },
      { itemId: 'stone', quantity: 3 }
    ],
    station: 'mixer',
    description: 'Create a gauntlet infused with dark power.',
    unlockLevel: 3
  },
  {
    id: 'sanity_potion_recipe',
    name: 'Sanity Potion',
    result: ITEMS.sanity_potion,
    ingredients: [
      { itemId: 'soul_flower', quantity: 2 },
      { itemId: 'ancient_ether', quantity: 1 }
    ],
    station: 'mixer',
    description: 'Brew a potion that restores mental clarity.',
    unlockLevel: 1
  },
  {
    id: 'health_potion_recipe',
    name: 'Health Potion',
    result: ITEMS.health_potion,
    ingredients: [
      { itemId: 'soul_flower', quantity: 1 },
      { itemId: 'ancient_ether', quantity: 1 }
    ],
    station: 'lightforge',
    description: 'Create a healing elixir using light magic.',
    unlockLevel: 1
  },
  {
    id: 'light_orb_recipe',
    name: 'Light Orb',
    result: ITEMS.light_orb,
    ingredients: [
      { itemId: 'ancient_ether', quantity: 2 },
      { itemId: 'stone', quantity: 1 }
    ],
    station: 'lightforge',
    description: 'Craft a portable light source.',
    unlockLevel: 2
  },
  {
    id: 'purple_orb_recipe',
    name: 'Purple Orb',
    result: ITEMS.purple_orb,
    ingredients: [
      { itemId: 'ancient_ether', quantity: 1 },
      { itemId: 'dark_ether', quantity: 1 }
    ],
    station: 'lightforge',
    description: 'Create a sanity-safe light source.',
    unlockLevel: 3
  },
  {
    id: 'ether_cleanser_recipe',
    name: 'Ether Cleanser',
    result: ITEMS.ether_cleanser,
    ingredients: [
      { itemId: 'soul_flower', quantity: 3 },
      { itemId: 'ancient_ether', quantity: 2 }
    ],
    station: 'shardforge',
    description: 'Purify corruption with concentrated soul energy.',
    unlockLevel: 4
  }
];

export const BOSSES: Record<string, Boss> = {
  forest_guardian: {
    id: 'forest_guardian',
    name: 'Forest Guardian',
    biome: 'verdant_hollow',
    health: 200,
    maxHealth: 200,
    phases: [
      { healthThreshold: 100, abilities: ['vine_whip', 'heal'], behavior: 'defensive' },
      { healthThreshold: 50, abilities: ['thorn_storm', 'root_bind'], behavior: 'aggressive' }
    ],
    currentPhase: 0,
    abilities: [],
    lootTable: [
      { ...ITEMS.ancient_ether, quantity: 5 },
      { ...ITEMS.soul_flower, quantity: 10 }
    ],
    isDefeated: false
  },
  flame_titan: {
    id: 'flame_titan',
    name: 'Flame Titan',
    biome: 'ash_dunes',
    health: 350,
    maxHealth: 350,
    phases: [
      { healthThreshold: 200, abilities: ['fire_blast'], behavior: 'aggressive' },
      { healthThreshold: 100, abilities: ['meteor_rain', 'flame_aura'], behavior: 'berserker' }
    ],
    currentPhase: 0,
    abilities: [],
    lootTable: [
      { ...ITEMS.ancient_ether, quantity: 8 },
      { ...ITEMS.stone, quantity: 15 }
    ],
    isDefeated: false
  },
  ice_queen: {
    id: 'ice_queen',
    name: 'Ice Queen',
    biome: 'frozen_grief',
    health: 300,
    maxHealth: 300,
    phases: [
      { healthThreshold: 150, abilities: ['ice_shard', 'freeze'], behavior: 'defensive' },
      { healthThreshold: 75, abilities: ['blizzard', 'ice_prison'], behavior: 'aggressive' }
    ],
    currentPhase: 0,
    abilities: [],
    lootTable: [
      { ...ITEMS.dark_ether, quantity: 3 },
      { ...ITEMS.ancient_ether, quantity: 6 }
    ],
    isDefeated: false
  },
  crystal_lord: {
    id: 'crystal_lord',
    name: 'Crystal Lord',
    biome: 'crystal_rift',
    health: 400,
    maxHealth: 400,
    phases: [
      { healthThreshold: 250, abilities: ['crystal_beam'], behavior: 'aggressive' },
      { healthThreshold: 150, abilities: ['reality_warp', 'crystal_storm'], behavior: 'berserker' },
      { healthThreshold: 50, abilities: ['void_collapse'], behavior: 'berserker' }
    ],
    currentPhase: 0,
    abilities: [],
    lootTable: [
      { ...ITEMS.dark_ether, quantity: 10 },
      { ...ITEMS.ancient_ether, quantity: 5 }
    ],
    isDefeated: false
  }
};