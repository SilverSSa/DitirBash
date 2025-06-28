import { useState, useEffect, useCallback } from 'react';
import { Player, Enemy, Resource, GameState, InventoryItem } from '../types/game';
import { BIOMES, ITEMS } from '../data/gameData';

const WORLD_SIZE = 800;
const PLAYER_SPEED = 2;
const SANITY_DRAIN_RATE = 0.1;

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
      { ...ITEMS.soul_flower, quantity: 3 },
      { ...ITEMS.ancient_ether, quantity: 2 }
    ],
    equippedWeapon: null,
    lightRadius: 80,
    isMoving: false,
    direction: 0
  });

  const [enemies, setEnemies] = useState<Enemy[]>([]);
  const [resources, setResources] = useState<Resource[]>([]);
  const [gameState, setGameState] = useState<GameState>({
    mode: 'survival',
    currentBiome: 'verdant_hollow',
    timeOfDay: 0.5,
    weather: 'clear',
    darkEyesActive: false,
    darkEyesCooldown: 0,
    isPaused: false,
    gameTime: 0
  });

  const [keys, setKeys] = useState<Set<string>>(new Set());

  // Initialize world
  useEffect(() => {
    generateEnemies();
    generateResources();
  }, [gameState.currentBiome]);

  // Game loop
  useEffect(() => {
    if (gameState.isPaused) return;

    const gameLoop = setInterval(() => {
      updatePlayer();
      updateEnemies();
      updateGameState();
    }, 16); // 60 FPS

    return () => clearInterval(gameLoop);
  }, [keys, gameState.isPaused]);

  // Keyboard input
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      setKeys(prev => new Set(prev).add(e.key.toLowerCase()));
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
  }, []);

  const generateEnemies = () => {
    const newEnemies: Enemy[] = [];
    const biome = BIOMES[gameState.currentBiome];
    
    for (let i = 0; i < 10; i++) {
      newEnemies.push({
        id: `enemy_${i}`,
        name: biome.enemies[Math.floor(Math.random() * biome.enemies.length)],
        x: Math.random() * WORLD_SIZE,
        y: Math.random() * WORLD_SIZE,
        health: 50,
        maxHealth: 50,
        damage: 10,
        speed: 1,
        type: Math.random() > 0.7 ? 'hostile' : 'neutral',
        element: 'normal',
        isDark: Math.random() > 0.8,
        lastAttack: 0
      });
    }
    
    setEnemies(newEnemies);
  };

  const generateResources = () => {
    const newResources: Resource[] = [];
    const biome = BIOMES[gameState.currentBiome];
    
    for (let i = 0; i < 15; i++) {
      newResources.push({
        id: `resource_${i}`,
        name: biome.resources[Math.floor(Math.random() * biome.resources.length)],
        x: Math.random() * WORLD_SIZE,
        y: Math.random() * WORLD_SIZE,
        type: biome.resources[Math.floor(Math.random() * biome.resources.length)] as any,
        quantity: Math.floor(Math.random() * 3) + 1,
        respawnTime: 0
      });
    }
    
    setResources(newResources);
  };

  const updatePlayer = () => {
    setPlayer(prev => {
      let newX = prev.x;
      let newY = prev.y;
      let isMoving = false;

      if (keys.has('w') || keys.has('arrowup')) {
        newY = Math.max(0, prev.y - PLAYER_SPEED);
        isMoving = true;
      }
      if (keys.has('s') || keys.has('arrowdown')) {
        newY = Math.min(WORLD_SIZE, prev.y + PLAYER_SPEED);
        isMoving = true;
      }
      if (keys.has('a') || keys.has('arrowleft')) {
        newX = Math.max(0, prev.x - PLAYER_SPEED);
        isMoving = true;
      }
      if (keys.has('d') || keys.has('arrowright')) {
        newX = Math.min(WORLD_SIZE, prev.x + PLAYER_SPEED);
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
              newSanity = Math.max(0, newSanity - effect.intensity);
              break;
            case 'health_drain':
              newHealth = Math.max(0, newHealth - effect.intensity);
              break;
          }
        }
      });

      // Natural sanity drain
      if (Date.now() % 1000 < 16) {
        newSanity = Math.max(0, newSanity - SANITY_DRAIN_RATE);
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
      if (enemy.type === 'hostile') {
        const dx = player.x - enemy.x;
        const dy = player.y - enemy.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < 100) {
          const moveX = (dx / distance) * enemy.speed;
          const moveY = (dy / distance) * enemy.speed;
          
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

  const collectResource = useCallback((resourceId: string) => {
    const resource = resources.find(r => r.id === resourceId);
    if (!resource) return;

    const distance = Math.sqrt(
      Math.pow(player.x - resource.x, 2) + Math.pow(player.y - resource.y, 2)
    );

    if (distance < 30) {
      setPlayer(prev => {
        const existingItem = prev.inventory.find(item => item.id === resource.type);
        const newInventory = [...prev.inventory];
        
        if (existingItem) {
          existingItem.quantity += resource.quantity;
        } else {
          newInventory.push({
            ...ITEMS[resource.type],
            quantity: resource.quantity
          });
        }

        return {
          ...prev,
          inventory: newInventory,
          souls: prev.souls + resource.quantity
        };
      });

      setResources(prev => prev.filter(r => r.id !== resourceId));
    }
  }, [player.x, player.y, resources]);

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

  return {
    player,
    enemies,
    resources,
    gameState,
    collectResource,
    useItem,
    activateDarkEyes,
    changeBiome,
    worldSize: WORLD_SIZE
  };
};