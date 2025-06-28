import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useGame } from '../context/GameContext';

interface Position {
  x: number;
  y: number;
}

interface Enemy {
  id: string;
  type: 'wolf' | 'mutant' | 'shadow' | 'boss';
  position: Position;
  health: number;
  maxHealth: number;
  isAggressive: boolean;
  isDarkRealm: boolean;
  isDead: boolean;
}

interface Attack {
  id: string;
  position: Position;
  targetPosition: Position;
  damage: number;
  timestamp: number;
}

interface GameWorldProps {
  worldSize: { width: number; height: number };
}

export default function GameWorld({ worldSize }: GameWorldProps) {
  const { state, dispatch } = useGame();
  const [playerPosition, setPlayerPosition] = useState<Position>({ x: 600, y: 450 });
  const [enemies, setEnemies] = useState<Enemy[]>([]);
  const [attacks, setAttacks] = useState<Attack[]>([]);
  const [keysPressed, setKeysPressed] = useState<Set<string>>(new Set());
  const [cameraOffset, setCameraOffset] = useState<Position>({ x: 0, y: 0 });
  const [mousePosition, setMousePosition] = useState<Position>({ x: 0, y: 0 });
  const gameWorldRef = useRef<HTMLDivElement>(null);

  // Initialize enemies
  useEffect(() => {
    const initialEnemies: Enemy[] = [
      {
        id: '1',
        type: 'wolf',
        position: { x: 300, y: 300 },
        health: 50,
        maxHealth: 50,
        isAggressive: false,
        isDarkRealm: false,
        isDead: false
      },
      {
        id: '2',
        type: 'mutant',
        position: { x: 900, y: 600 },
        health: 80,
        maxHealth: 80,
        isAggressive: true,
        isDarkRealm: false,
        isDead: false
      },
      {
        id: '3',
        type: 'shadow',
        position: { x: 450, y: 750 },
        health: 120,
        maxHealth: 120,
        isAggressive: false,
        isDarkRealm: true,
        isDead: false
      },
      {
        id: '4',
        type: 'boss',
        position: { x: 1050, y: 300 },
        health: 300,
        maxHealth: 300,
        isAggressive: false,
        isDarkRealm: false,
        isDead: false
      },
      {
        id: '5',
        type: 'wolf',
        position: { x: 750, y: 150 },
        health: 50,
        maxHealth: 50,
        isAggressive: false,
        isDarkRealm: false,
        isDead: false
      },
      {
        id: '6',
        type: 'mutant',
        position: { x: 200, y: 600 },
        health: 80,
        maxHealth: 80,
        isAggressive: false,
        isDarkRealm: false,
        isDead: false
      }
    ];
    setEnemies(initialEnemies);
  }, []);

  // Handle keyboard input
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      setKeysPressed(prev => new Set(prev).add(e.key.toLowerCase()));
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      setKeysPressed(prev => {
        const newSet = new Set(prev);
        newSet.delete(e.key.toLowerCase());
        return newSet;
      });
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  // Handle mouse movement and clicks
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (gameWorldRef.current) {
        const rect = gameWorldRef.current.getBoundingClientRect();
        setMousePosition({
          x: e.clientX - rect.left + cameraOffset.x,
          y: e.clientY - rect.top + cameraOffset.y
        });
      }
    };

    const handleMouseClick = (e: MouseEvent) => {
      if (gameWorldRef.current && state.equippedWeapon) {
        const rect = gameWorldRef.current.getBoundingClientRect();
        const worldX = e.clientX - rect.left + cameraOffset.x;
        const worldY = e.clientY - rect.top + cameraOffset.y;
        
        performAttack(worldX, worldY);
      }
    };

    const gameWorld = gameWorldRef.current;
    if (gameWorld) {
      gameWorld.addEventListener('mousemove', handleMouseMove);
      gameWorld.addEventListener('click', handleMouseClick);
    }

    return () => {
      if (gameWorld) {
        gameWorld.removeEventListener('mousemove', handleMouseMove);
        gameWorld.removeEventListener('click', handleMouseClick);
      }
    };
  }, [cameraOffset, state.equippedWeapon]);

  // Perform attack
  const performAttack = useCallback((targetX: number, targetY: number) => {
    if (!state.equippedWeapon) return;

    const attackRange = getWeaponRange(state.equippedWeapon);
    const attackDamage = getWeaponDamage(state.equippedWeapon);
    
    // Check distance to target
    const dx = targetX - playerPosition.x;
    const dy = targetY - playerPosition.y;
    const distance = Math.sqrt(dx * dx + dy * dy);

    if (distance <= attackRange) {
      // Create attack visual
      const newAttack: Attack = {
        id: Date.now().toString(),
        position: { x: playerPosition.x, y: playerPosition.y },
        targetPosition: { x: targetX, y: targetY },
        damage: attackDamage,
        timestamp: Date.now()
      };

      setAttacks(prev => [...prev, newAttack]);

      // Check for enemy hits
      setEnemies(prevEnemies => 
        prevEnemies.map(enemy => {
          if (enemy.isDead) return enemy;
          if (enemy.isDarkRealm && !state.isInDarkRealm) return enemy;

          const enemyDx = targetX - enemy.position.x;
          const enemyDy = targetY - enemy.position.y;
          const enemyDistance = Math.sqrt(enemyDx * enemyDx + enemyDy * enemyDy);

          if (enemyDistance <= 40) { // Hit radius
            const newHealth = enemy.health - attackDamage;
            if (newHealth <= 0) {
              // Enemy defeated - award souls
              dispatch({ type: 'ADD_SOULS', payload: getEnemySoulValue(enemy.type) });
              return { ...enemy, health: 0, isDead: true };
            }
            return { ...enemy, health: newHealth, isAggressive: true };
          }
          return enemy;
        })
      );

      // Remove attack visual after animation
      setTimeout(() => {
        setAttacks(prev => prev.filter(attack => attack.id !== newAttack.id));
      }, 500);
    }
  }, [playerPosition, state.equippedWeapon, state.isInDarkRealm, dispatch]);

  // Player movement
  useEffect(() => {
    const movePlayer = () => {
      const speed = 4;
      let newX = playerPosition.x;
      let newY = playerPosition.y;

      if (keysPressed.has('w') || keysPressed.has('arrowup')) newY -= speed;
      if (keysPressed.has('s') || keysPressed.has('arrowdown')) newY += speed;
      if (keysPressed.has('a') || keysPressed.has('arrowleft')) newX -= speed;
      if (keysPressed.has('d') || keysPressed.has('arrowright')) newX += speed;

      // Boundary checking
      newX = Math.max(30, Math.min(worldSize.width - 30, newX));
      newY = Math.max(30, Math.min(worldSize.height - 30, newY));

      if (newX !== playerPosition.x || newY !== playerPosition.y) {
        setPlayerPosition({ x: newX, y: newY });
        
        // Update camera to follow player
        const viewportWidth = 1200;
        const viewportHeight = 800;
        setCameraOffset({
          x: Math.max(0, Math.min(worldSize.width - viewportWidth, newX - viewportWidth / 2)),
          y: Math.max(0, Math.min(worldSize.height - viewportHeight, newY - viewportHeight / 2))
        });
      }
    };

    const interval = setInterval(movePlayer, 16); // ~60fps
    return () => clearInterval(interval);
  }, [keysPressed, playerPosition, worldSize]);

  // Enemy AI
  useEffect(() => {
    const updateEnemies = () => {
      setEnemies(prevEnemies => 
        prevEnemies.map(enemy => {
          if (enemy.isDead) return enemy;
          if (enemy.isDarkRealm && !state.isInDarkRealm) {
            return enemy; // Dark realm enemies not visible
          }

          const dx = playerPosition.x - enemy.position.x;
          const dy = playerPosition.y - enemy.position.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          // Aggro range
          if (distance < 150 && !enemy.isAggressive) {
            return { ...enemy, isAggressive: true };
          }

          // Lose aggro if too far
          if (distance > 300 && enemy.isAggressive) {
            return { ...enemy, isAggressive: false };
          }

          // Move towards player if aggressive
          if (enemy.isAggressive && distance > 40) {
            const speed = getEnemySpeed(enemy.type);
            const moveX = (dx / distance) * speed;
            const moveY = (dy / distance) * speed;

            return {
              ...enemy,
              position: {
                x: enemy.position.x + moveX,
                y: enemy.position.y + moveY
              }
            };
          }

          return enemy;
        })
      );
    };

    const interval = setInterval(updateEnemies, 100);
    return () => clearInterval(interval);
  }, [playerPosition, state.isInDarkRealm]);

  // Helper functions
  const getWeaponRange = (weapon: string) => {
    switch (weapon) {
      case 'Soul Sword': return 80;
      case 'Dark Claw': return 60;
      case 'Spirit Bow': return 200;
      case 'Blizzard Staff': return 150;
      case 'Flame Gauntlet': return 100;
      case 'Stone Hammer': return 70;
      default: return 50;
    }
  };

  const getWeaponDamage = (weapon: string) => {
    switch (weapon) {
      case 'Soul Sword': return 35;
      case 'Dark Claw': return 25;
      case 'Spirit Bow': return 30;
      case 'Blizzard Staff': return 40;
      case 'Flame Gauntlet': return 45;
      case 'Stone Hammer': return 50;
      default: return 20;
    }
  };

  const getEnemySpeed = (type: string) => {
    switch (type) {
      case 'wolf': return 2;
      case 'mutant': return 1.5;
      case 'shadow': return 2.5;
      case 'boss': return 1;
      default: return 1;
    }
  };

  const getEnemySoulValue = (type: string) => {
    switch (type) {
      case 'wolf': return 10;
      case 'mutant': return 25;
      case 'shadow': return 40;
      case 'boss': return 100;
      default: return 5;
    }
  };

  const getEnemyIcon = (type: string) => {
    switch (type) {
      case 'wolf': return '🐺';
      case 'mutant': return '👹';
      case 'shadow': return '👻';
      case 'boss': return '💀';
      default: return '❓';
    }
  };

  const getEnemySize = (type: string) => {
    switch (type) {
      case 'wolf': return 'w-10 h-10';
      case 'mutant': return 'w-12 h-12';
      case 'shadow': return 'w-11 h-11';
      case 'boss': return 'w-20 h-20';
      default: return 'w-10 h-10';
    }
  };

  const getBiomePattern = () => {
    switch (state.currentBiome) {
      case 'Ash Dunes':
        return 'bg-gradient-to-br from-orange-900/20 to-red-900/20';
      case 'Verdant Hollow':
        return 'bg-gradient-to-br from-green-900/20 to-emerald-900/20';
      case 'Crystal Rift':
        return 'bg-gradient-to-br from-purple-900/20 to-indigo-900/20';
      case 'Frozen Grief':
        return 'bg-gradient-to-br from-blue-900/20 to-cyan-900/20';
      case 'Plaguelands':
        return 'bg-gradient-to-br from-yellow-900/20 to-lime-900/20';
      default:
        return 'bg-gradient-to-br from-slate-900/20 to-gray-900/20';
    }
  };

  return (
    <div 
      ref={gameWorldRef}
      className="relative w-full h-full overflow-hidden bg-slate-800 cursor-crosshair"
      style={{ width: '1200px', height: '800px' }}
    >
      {/* World Background */}
      <div 
        className={`absolute inset-0 ${getBiomePattern()}`}
        style={{
          width: `${worldSize.width}px`,
          height: `${worldSize.height}px`,
          transform: `translate(-${cameraOffset.x}px, -${cameraOffset.y}px)`
        }}
      >
        {/* Environmental Elements */}
        {[...Array(30)].map((_, i) => (
          <div
            key={`env-${i}`}
            className="absolute w-6 h-6 bg-green-600 rounded-full opacity-60"
            style={{
              left: `${(i * 123) % worldSize.width}px`,
              top: `${(i * 456) % worldSize.height}px`,
            }}
          />
        ))}

        {/* Resource Nodes */}
        {[...Array(15)].map((_, i) => (
          <div
            key={`resource-${i}`}
            className="absolute w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center text-sm animate-pulse"
            style={{
              left: `${(i * 200 + 100) % (worldSize.width - 100)}px`,
              top: `${(i * 150 + 80) % (worldSize.height - 100)}px`,
            }}
          >
            💎
          </div>
        ))}

        {/* Player */}
        <div
          className="absolute w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center text-3xl border-4 border-white shadow-lg transition-all duration-75 z-20"
          style={{
            left: `${playerPosition.x - 32}px`,
            top: `${playerPosition.y - 32}px`,
          }}
        >
          🧙‍♂️
        </div>

        {/* Player Light Radius */}
        <div
          className="absolute rounded-full bg-yellow-300/20 pointer-events-none z-10"
          style={{
            left: `${playerPosition.x - 80}px`,
            top: `${playerPosition.y - 80}px`,
            width: '160px',
            height: '160px',
          }}
        />

        {/* Attack Range Indicator */}
        {state.equippedWeapon && (
          <div
            className="absolute rounded-full border-2 border-red-400/30 pointer-events-none z-15"
            style={{
              left: `${playerPosition.x - getWeaponRange(state.equippedWeapon)}px`,
              top: `${playerPosition.y - getWeaponRange(state.equippedWeapon)}px`,
              width: `${getWeaponRange(state.equippedWeapon) * 2}px`,
              height: `${getWeaponRange(state.equippedWeapon) * 2}px`,
            }}
          />
        )}

        {/* Attack Visuals */}
        {attacks.map(attack => (
          <div key={attack.id} className="absolute z-25">
            {/* Attack Line */}
            <div
              className="absolute bg-red-500 opacity-80 animate-pulse"
              style={{
                left: `${Math.min(attack.position.x, attack.targetPosition.x)}px`,
                top: `${Math.min(attack.position.y, attack.targetPosition.y) - 1}px`,
                width: `${Math.abs(attack.targetPosition.x - attack.position.x)}px`,
                height: '2px',
                transformOrigin: '0 50%',
                transform: `rotate(${Math.atan2(
                  attack.targetPosition.y - attack.position.y,
                  attack.targetPosition.x - attack.position.x
                )}rad)`
              }}
            />
            {/* Impact Effect */}
            <div
              className="absolute w-8 h-8 bg-red-500 rounded-full opacity-60 animate-ping"
              style={{
                left: `${attack.targetPosition.x - 16}px`,
                top: `${attack.targetPosition.y - 16}px`,
              }}
            />
          </div>
        ))}

        {/* Enemies */}
        {enemies.map(enemy => {
          // Hide dark realm enemies if not using DarkEyes
          if (enemy.isDarkRealm && !state.isInDarkRealm) {
            return null;
          }

          // Hide dead enemies
          if (enemy.isDead) {
            return (
              <div
                key={enemy.id}
                className={`absolute ${getEnemySize(enemy.type)} flex items-center justify-center text-2xl opacity-30 grayscale z-15`}
                style={{
                  left: `${enemy.position.x - (enemy.type === 'boss' ? 40 : 20)}px`,
                  top: `${enemy.position.y - (enemy.type === 'boss' ? 40 : 20)}px`,
                }}
              >
                💀
              </div>
            );
          }

          return (
            <div key={enemy.id} className="absolute z-15">
              {/* Enemy */}
              <div
                className={`${getEnemySize(enemy.type)} flex items-center justify-center text-3xl transition-all duration-100 ${
                  enemy.isAggressive ? 'animate-pulse' : ''
                } ${enemy.isDarkRealm ? 'opacity-70 filter hue-rotate-180' : ''}`}
                style={{
                  left: `${enemy.position.x - (enemy.type === 'boss' ? 40 : 20)}px`,
                  top: `${enemy.position.y - (enemy.type === 'boss' ? 40 : 20)}px`,
                }}
              >
                {getEnemyIcon(enemy.type)}
              </div>

              {/* Enemy Health Bar */}
              {(enemy.isAggressive || enemy.health < enemy.maxHealth) && (
                <div
                  className="absolute w-16 h-2 bg-slate-700 rounded-full border border-slate-600"
                  style={{
                    left: `${enemy.position.x - 32}px`,
                    top: `${enemy.position.y - 40}px`,
                  }}
                >
                  <div
                    className="h-full bg-red-500 rounded-full transition-all duration-300"
                    style={{ width: `${(enemy.health / enemy.maxHealth) * 100}%` }}
                  />
                </div>
              )}

              {/* Aggro Indicator */}
              {enemy.isAggressive && (
                <div
                  className="absolute w-3 h-3 bg-red-500 rounded-full animate-ping"
                  style={{
                    left: `${enemy.position.x - 6}px`,
                    top: `${enemy.position.y - 50}px`,
                  }}
                />
              )}
            </div>
          );
        })}

        {/* Dark Realm Overlay */}
        {state.isInDarkRealm && (
          <div className="absolute inset-0 bg-purple-900/30 pointer-events-none z-30">
            <div className="absolute inset-0 animate-pulse bg-gradient-to-r from-transparent via-purple-500/10 to-transparent" />
          </div>
        )}
      </div>

      {/* Movement Instructions */}
      <div className="absolute bottom-4 left-4 bg-slate-900/90 rounded-lg p-4 text-white text-sm z-40 border border-slate-600">
        <p className="font-semibold mb-2 text-purple-300">Controls:</p>
        <p>WASD / Arrow Keys - Move</p>
        <p>Mouse Click - Attack (with weapon)</p>
        <p>I - Inventory</p>
        <p>E - Weapon Wheel</p>
        {state.equippedWeapon && (
          <p className="mt-2 text-green-400">
            Equipped: {state.equippedWeapon}
          </p>
        )}
      </div>

      {/* Combat Info */}
      {state.equippedWeapon && (
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-slate-900/90 rounded-lg p-3 text-white text-sm z-40 border border-purple-500">
          <div className="flex items-center gap-4">
            <span>Range: {getWeaponRange(state.equippedWeapon)}px</span>
            <span>Damage: {getWeaponDamage(state.equippedWeapon)}</span>
            <span className="text-red-400">Click to attack!</span>
          </div>
        </div>
      )}

      {/* Minimap */}
      <div className="absolute top-4 right-4 w-48 h-36 bg-slate-900/90 border-2 border-slate-600 rounded-lg overflow-hidden z-40">
        <div className="relative w-full h-full">
          {/* Minimap Background */}
          <div className={`w-full h-full ${getBiomePattern()}`} />
          
          {/* Player Dot */}
          <div
            className="absolute w-3 h-3 bg-blue-400 rounded-full border border-white"
            style={{
              left: `${(playerPosition.x / worldSize.width) * 192 - 6}px`,
              top: `${(playerPosition.y / worldSize.height) * 144 - 6}px`,
            }}
          />
          
          {/* Enemy Dots */}
          {enemies.map(enemy => (
            <div
              key={`mini-${enemy.id}`}
              className={`absolute w-2 h-2 rounded-full ${
                enemy.isDead
                  ? 'bg-gray-600'
                  : enemy.isDarkRealm && !state.isInDarkRealm 
                    ? 'hidden' 
                    : enemy.isAggressive 
                      ? 'bg-red-400' 
                      : 'bg-yellow-400'
              }`}
              style={{
                left: `${(enemy.position.x / worldSize.width) * 192 - 4}px`,
                top: `${(enemy.position.y / worldSize.height) * 144 - 4}px`,
              }}
            />
          ))}
        </div>
        <div className="absolute bottom-1 left-1 text-xs text-white/70">
          Minimap
        </div>
      </div>
    </div>
  );
}