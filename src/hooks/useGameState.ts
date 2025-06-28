import { useState, useEffect, useCallback } from 'react';
import { Player, Enemy, Resource, GameState, InventoryItem, StaticLight } from '../types/game';
import { BIOMES, ITEMS, WEAPONS, BOSSES } from '../data/gameData';

const WORLD_SIZE = 1000;
const PLAYER_SPEED = 3;
const SANITY_DRAIN_RATE = 0.2;

export const useGameState = () => {
  const [player, setPlayer] = useState<Player>({
    id: 'player1',
    name: 'Survivor',
    x: WORLD_SIZE / 2,
    y: WORLD_SIZE / 2,
    health: 100,
    maxHealth: 100,
    sanity: 100,
    maxSanity: 100,
    souls: 50,
    shards: 0,
    level: 1,
    xp: 0,
    inventory: [
      { ...ITEMS.soul_flower, quantity: 5 },
      { ...ITEMS.ancient_ether, quantity: 3 },
      { ...ITEMS.sanity_potion, quantity: 2 },
      { ...ITEMS.health_potion, quantity: 2 }
    ],
    equippedWeapon: null,
    lightRadius: 100,
    isMoving: false,
    direction: 0,
    darkEtherXP: 0,
    sanityResistance: 0
  });

  const [enemies, setEnemies] = useState<Enemy[]>([]);
  const [resources, setResources] = useState<Resource[]>([]);
  const [gameState, setGameState] = useState<GameState>({
    mode: 'survival',
    currentBiome: 'verdant_hollow',
    currentRealm: 'Normal World',
    timeOfDay: 0.5,
    weather: 'clear',
    darkEyesActive: false,
    darkEyesCooldown: 0,
    isPaused: false,
    gameTime: 0,
    staticLights: [],
    bossesDefeated: [],
    worldSeed: Math.random().toString(36),
    difficulty: 1
  });

  const [keys, setKeys] = useState<Set<string>>(new Set());

  // Initialize world
  useEffect(() => {
    generateEnemies();
    generateResources();
  }, [gameState.currentBiome, gameState.currentRealm]);

  // Game loop
  useEffect(() => {
    if (gameState.isPaused) return;

    const gameLoop = setInterval(() => {
      updatePlayer();
      updateEnemies();
      updateGameState();
      updateWeather();
    }, 16); // 60 FPS

    return () => clearInterval(gameLoop);
  }, [keys, gameState.isPaused]);

  // Keyboard input
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      setKeys(prev => new Set(prev).add(e.key.toLowerCase()));
      
      // Handle special keys
      if (e.key.toLowerCase() === 'f') {
        activateDarkEyes();
      }
      if (e.key.toLowerCase() === 'r' && player.equippedWeapon) {
        unequipWeapon();
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      setKeys(prev => {
        const newKeys = new Set(prev);
        newKeys.delete(e.key.toLowerCase());
        return newKeys;
      });
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [player.equippedWeapon]);

  const generateEnemies = () => {
    const newEnemies: Enemy[] = [];
    const biome = BIOMES[gameState.currentBiome];
    const enemyCount = gameState.currentRealm === 'DarkEther Realm' ? 15 : 12;
    
    for (let i = 0; i < enemyCount; i++) {
      const enemyType = biome.enemies[Math.floor(Math.random() * biome.enemies.length)];
      const isDark = gameState.currentRealm === 'DarkEther Realm' || Math.random() > 0.7;
      
      newEnemies.push({
        id: `enemy_${i}`,
        name: enemyType,
        x: Math.random() * WORLD_SIZE,
        y: Math.random() * WORLD_SIZE,
        health: isDark ? 80 : 50,
        maxHealth: isDark ? 80 : 50,
        damage: isDark ? 15 : 10,
        speed: isDark ? 1.5 : 1,
        type: Math.random() > 0.8 ? 'hostile' : Math.random() > 0.5 ? 'neutral' : 'passive',
        element: 'normal',
        isDark,
        lastAttack: 0,
        xpReward: isDark ? 15 : 10,
        soulReward: isDark ? 8 : 5,
        lootTable: ['soul_flower', 'ancient_ether']
      });
    }

    // Add boss if not defeated
    if (biome.boss && !gameState.bossesDefeated.includes(biome.boss)) {
      const boss = BOSSES[biome.boss];
      if (boss) {
        newEnemies.push({
          id: `boss_${biome.boss}`,
          name: boss.name,
          x: Math.random() * WORLD_SIZE,
          y: Math.random() * WORLD_SIZE,
          health: boss.health,
          maxHealth: boss.maxHealth,
          damage: 25,
          speed: 0.8,
          type: 'boss',
          element: 'dark',
          isDark: true,
          lastAttack: 0,
          xpReward: 100,
          soulReward: 50,
          lootTable: boss.lootTable.map(item => item.id)
        });
      }
    }
    
    setEnemies(newEnemies);
  };

  const generateResources = () => {
    const newResources: Resource[] = [];
    const biome = BIOMES[gameState.currentBiome];
    const resourceCount = gameState.currentRealm === 'DarkEther Realm' ? 20 : 18;
    
    for (let i = 0; i < resourceCount; i++) {
      const resourceType = biome.resources[Math.floor(Math.random() * biome.resources.length)];
      
      newResources.push({
        id: `resource_${i}`,
        name: resourceType,
        x: Math.random() * WORLD_SIZE,
        y: Math.random() * WORLD_SIZE,
        type: resourceType as any,
        quantity: Math.floor(Math.random() * 3) + 1,
        respawnTime: 0,
        rarity: Math.random() > 0.8 ? 'rare' : Math.random() > 0.95 ? 'epic' : 'common'
      });
    }
    
    setResources(newResources);
  };

  const updatePlayer = () => {
    setPlayer(prev => {
      let newX = prev.x;
      let newY = prev.y;
      let isMoving = false;

      const speed = prev.sanity < 25 ? PLAYER_SPEED * 0.5 : PLAYER_SPEED;

      if (keys.has('w') || keys.has('arrowup')) {
        newY = Math.max(20, prev.y - speed);
        isMoving = true;
      }
      if (keys.has('s') || keys.has('arrowdown')) {
        newY = Math.min(WORLD_SIZE - 20, prev.y + speed);
        isMoving = true;
      }
      if (keys.has('a') || keys.has('arrowleft')) {
        newX = Math.max(20, prev.x - speed);
        isMoving = true;
      }
      if (keys.has('d') || keys.has('arrowright')) {
        newX = Math.min(WORLD_SIZE - 20, prev.x + speed);
        isMoving = true;
      }

      // Apply biome effects
      const biome = BIOMES[gameState.currentBiome];
      let newSanity = prev.sanity;
      let newHealth = prev.health;

      biome.effects.forEach(effect => {
        if (Date.now() % effect.interval < 16) {
          switch (effect.type) {
            case 'sanity_drain':
              newSanity = Math.max(0, newSanity - (effect.intensity * (1 - prev.sanityResistance / 100)));
              break;
            case 'health_drain':
            case 'heat':
            case 'cold':
            case 'poison':
              newHealth = Math.max(0, newHealth - effect.intensity);
              break;
          }
        }
      });

      // Natural sanity drain
      if (Date.now() % 2000 < 16) {
        const drainRate = gameState.currentRealm === 'DarkEther Realm' ? SANITY_DRAIN_RATE * 2 : SANITY_DRAIN_RATE;
        newSanity = Math.max(0, newSanity - drainRate);
      }

      // Dark Eyes sanity drain
      if (gameState.darkEyesActive && Date.now() % 1000 < 16) {
        newSanity = Math.max(0, newSanity - 1);
      }

      return {
        ...prev,
        x: newX,
        y: newY,
        isMoving,
        sanity: newSanity,
        health: newHealth
      };
    });
  };

  const updateEnemies = () => {
    setEnemies(prev => prev.map(enemy => {
      if (enemy.type === 'hostile' || enemy.type === 'boss') {
        const dx = player.x - enemy.x;
        const dy = player.y - enemy.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < 150) {
          const moveX = (dx / distance) * enemy.speed;
          const moveY = (dy / distance) * enemy.speed;
          
          // Attack player if close enough
          if (distance < 30 && Date.now() - enemy.lastAttack > 2000) {
            setPlayer(prevPlayer => ({
              ...prevPlayer,
              health: Math.max(0, prevPlayer.health - enemy.damage)
            }));
            
            return {
              ...enemy,
              x: enemy.x + moveX,
              y: enemy.y + moveY,
              lastAttack: Date.now()
            };
          }
          
          return {
            ...enemy,
            x: enemy.x + moveX,
            y: enemy.y + moveY
          };
        }
      }
      return enemy;
    }));
  };

  const updateGameState = () => {
    setGameState(prev => ({
      ...prev,
      gameTime: prev.gameTime + 16,
      timeOfDay: (prev.timeOfDay + 0.0001) % 1,
      darkEyesCooldown: Math.max(0, prev.darkEyesCooldown - 16)
    }));
  };

  const updateWeather = () => {
    // Random weather changes
    if (Math.random() < 0.0001) {
      const weathers = ['clear', 'fog', 'storm', 'sandstorm'];
      const currentBiome = BIOMES[gameState.currentBiome];
      
      let availableWeathers = ['clear'];
      if (currentBiome.id === 'ash_dunes') availableWeathers.push('sandstorm');
      if (currentBiome.id === 'frozen_grief') availableWeathers.push('fog');
      if (currentBiome.id === 'crystal_rift') availableWeathers.push('storm');
      
      setGameState(prev => ({
        ...prev,
        weather: availableWeathers[Math.floor(Math.random() * availableWeathers.length)] as any
      }));
    }
  };

  const collectResource = useCallback((resourceId: string) => {
    const resource = resources.find(r => r.id === resourceId);
    if (!resource) return;

    const distance = Math.sqrt(
      Math.pow(player.x - resource.x, 2) + Math.pow(player.y - resource.y, 2)
    );

    if (distance < 40) {
      setPlayer(prev => {
        const existingItem = prev.inventory.find(item => item.id === resource.type);
        const newInventory = [...prev.inventory];
        
        if (existingItem) {
          existingItem.quantity += resource.quantity;
        } else if (newInventory.length < 16) {
          newInventory.push({
            ...ITEMS[resource.type],
            quantity: resource.quantity
          });
        }

        return {
          ...prev,
          inventory: newInventory,
          souls: prev.souls + resource.quantity,
          xp: prev.xp + (resource.rarity === 'epic' ? 5 : resource.rarity === 'rare' ? 3 : 1)
        };
      });

      setResources(prev => prev.filter(r => r.id !== resourceId));
    }
  }, [player.x, player.y, resources]);

  const attackEnemy = useCallback((enemyId: string) => {
    if (!player.equippedWeapon) return;

    const enemy = enemies.find(e => e.id === enemyId);
    if (!enemy) return;

    const distance = Math.sqrt(
      Math.pow(player.x - enemy.x, 2) + Math.pow(player.y - enemy.y, 2)
    );

    if (distance <= player.equippedWeapon.range && player.souls >= player.equippedWeapon.soulCost) {
      setPlayer(prev => ({
        ...prev,
        souls: prev.souls - player.equippedWeapon!.soulCost
      }));

      setEnemies(prev => prev.map(e => {
        if (e.id === enemyId) {
          const newHealth = Math.max(0, e.health - player.equippedWeapon!.damage);
          
          if (newHealth === 0) {
            // Enemy defeated
            setPlayer(prevPlayer => ({
              ...prevPlayer,
              xp: prevPlayer.xp + e.xpReward,
              souls: prevPlayer.souls + e.soulReward,
              level: Math.floor((prevPlayer.xp + e.xpReward) / 100) + 1
            }));

            // Add boss to defeated list
            if (e.type === 'boss') {
              setGameState(prevState => ({
                ...prevState,
                bossesDefeated: [...prevState.bossesDefeated, e.name.toLowerCase().replace(' ', '_')]
              }));
            }

            return null;
          }
          
          return { ...e, health: newHealth };
        }
        return e;
      }).filter(Boolean) as Enemy[]);
    }
  }, [player.x, player.y, player.equippedWeapon, player.souls, enemies]);

  const useItem = useCallback((itemId: string) => {
    setPlayer(prev => {
      const item = prev.inventory.find(i => i.id === itemId);
      if (!item || item.quantity <= 0) return prev;

      const newInventory = [...prev.inventory];
      const itemIndex = newInventory.findIndex(i => i.id === itemId);
      
      let newHealth = prev.health;
      let newSanity = prev.sanity;

      switch (itemId) {
        case 'health_potion':
          newHealth = Math.min(prev.maxHealth, prev.health + 50);
          break;
        case 'sanity_potion':
          newSanity = Math.min(prev.maxSanity, prev.sanity + 50);
          break;
        case 'ether_cleanser':
          newHealth = Math.min(prev.maxHealth, prev.health + 25);
          newSanity = Math.min(prev.maxSanity, prev.sanity + 25);
          break;
      }

      if (newInventory[itemIndex].quantity > 1) {
        newInventory[itemIndex].quantity--;
      } else {
        newInventory.splice(itemIndex, 1);
      }

      return {
        ...prev,
        inventory: newInventory,
        health: newHealth,
        sanity: newSanity
      };
    });
  }, []);

  const equipWeapon = useCallback((weaponId: string) => {
    const weapon = WEAPONS[weaponId];
    if (!weapon) return;

    setPlayer(prev => ({
      ...prev,
      equippedWeapon: weapon
    }));
  }, []);

  const unequipWeapon = useCallback(() => {
    setPlayer(prev => ({
      ...prev,
      equippedWeapon: null
    }));
  }, []);

  const activateDarkEyes = useCallback(() => {
    if (gameState.darkEyesCooldown > 0) return;

    setGameState(prev => ({
      ...prev,
      darkEyesActive: true,
      darkEyesCooldown: 120000 // 2 minutes
    }));

    setTimeout(() => {
      setGameState(prev => ({
        ...prev,
        darkEyesActive: false
      }));
    }, 60000); // 1 minute duration
  }, [gameState.darkEyesCooldown]);

  const changeBiome = useCallback((biomeId: string) => {
    setGameState(prev => ({
      ...prev,
      currentBiome: biomeId
    }));
  }, []);

  const changeRealm = useCallback((realm: 'Normal World' | 'Upside-Down' | 'DarkEther Realm') => {
    setGameState(prev => ({
      ...prev,
      currentRealm: realm,
      difficulty: realm === 'DarkEther Realm' ? 3 : realm === 'Upside-Down' ? 2 : 1
    }));
  }, []);

  const placeLight = useCallback(() => {
    const lightOrb = player.inventory.find(item => item.id === 'light_orb' || item.id === 'purple_orb');
    if (!lightOrb) return;

    const newLight: StaticLight = {
      id: `light_${Date.now()}`,
      x: player.x,
      y: player.y,
      radius: 60,
      color: lightOrb.id === 'purple_orb' ? '#8b5cf6' : '#ffffff',
      type: lightOrb.id === 'purple_orb' ? 'purple_orb' : 'orb',
      fuel: 100,
      maxFuel: 100
    };

    setGameState(prev => ({
      ...prev,
      staticLights: [...prev.staticLights, newLight]
    }));

    // Remove item from inventory
    setPlayer(prev => {
      const newInventory = [...prev.inventory];
      const itemIndex = newInventory.findIndex(i => i.id === lightOrb.id);
      
      if (newInventory[itemIndex].quantity > 1) {
        newInventory[itemIndex].quantity--;
      } else {
        newInventory.splice(itemIndex, 1);
      }

      return {
        ...prev,
        inventory: newInventory
      };
    });
  }, [player.inventory, player.x, player.y]);

  return {
    player,
    enemies,
    resources,
    gameState,
    collectResource,
    useItem,
    equipWeapon,
    unequipWeapon,
    activateDarkEyes,
    changeBiome,
    changeRealm,
    attackEnemy,
    placeLight,
    worldSize: WORLD_SIZE
  };
};