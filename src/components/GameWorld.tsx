import React from 'react';
import { Player, Enemy, Resource, GameState } from '../types/game';
import { BIOMES } from '../data/gameData';

interface GameWorldProps {
  player: Player;
  enemies: Enemy[];
  resources: Resource[];
  gameState: GameState;
  worldSize: number;
  onResourceClick: (resourceId: string) => void;
}

export const GameWorld: React.FC<GameWorldProps> = ({
  player,
  enemies,
  resources,
  gameState,
  worldSize,
  onResourceClick
}) => {
  const biome = BIOMES[gameState.currentBiome];
  const viewportSize = 400;
  const scale = viewportSize / 200; // Show 200x200 area around player

  // Calculate camera offset to center on player
  const cameraX = Math.max(0, Math.min(worldSize - viewportSize / scale, player.x - viewportSize / scale / 2));
  const cameraY = Math.max(0, Math.min(worldSize - viewportSize / scale, player.y - viewportSize / scale / 2));

  const getSanityEffect = () => {
    const sanityPercent = player.sanity / player.maxSanity;
    if (sanityPercent < 0.25) return 'blur(3px) saturate(0.5) hue-rotate(180deg)';
    if (sanityPercent < 0.5) return 'blur(1px) saturate(0.8)';
    if (sanityPercent < 0.75) return 'saturate(0.9)';
    return 'none';
  };

  const getTimeOfDayFilter = () => {
    const time = gameState.timeOfDay;
    if (time < 0.25 || time > 0.75) {
      // Night
      return 'brightness(0.3) contrast(1.2)';
    } else if (time < 0.3 || time > 0.7) {
      // Dawn/Dusk
      return 'brightness(0.6) sepia(0.3) hue-rotate(15deg)';
    }
    // Day
    return 'brightness(1)';
  };

  return (
    <div className="relative w-full h-full bg-gray-900 overflow-hidden">
      {/* World Container */}
      <div
        className="absolute inset-0 transition-all duration-100"
        style={{
          transform: `translate(${-cameraX * scale}px, ${-cameraY * scale}px) scale(${scale})`,
          filter: `${getSanityEffect()} ${getTimeOfDayFilter()}`,
          backgroundColor: biome.color + '20'
        }}
      >
        {/* Biome Background Pattern */}
        <div
          className="absolute inset-0 opacity-20"
          style={{
            width: worldSize,
            height: worldSize,
            backgroundImage: `radial-gradient(circle at 25% 25%, ${biome.color}40 0%, transparent 50%), 
                             radial-gradient(circle at 75% 75%, ${biome.color}30 0%, transparent 50%)`,
            backgroundSize: '100px 100px'
          }}
        />

        {/* Resources */}
        {resources.map(resource => {
          const distance = Math.sqrt(
            Math.pow(player.x - resource.x, 2) + Math.pow(player.y - resource.y, 2)
          );
          const inLightRadius = distance < player.lightRadius;
          
          return (
            <div
              key={resource.id}
              className={`absolute w-4 h-4 rounded-full cursor-pointer transition-all duration-200 ${
                inLightRadius ? 'opacity-100 scale-100' : 'opacity-30 scale-75'
              }`}
              style={{
                left: resource.x - 8,
                top: resource.y - 8,
                backgroundColor: resource.type === 'soul_flower' ? '#22c55e' : 
                               resource.type === 'ancient_ether' ? '#3b82f6' : 
                               resource.type === 'dark_ether' ? '#8b5cf6' : '#6b7280',
                boxShadow: inLightRadius ? `0 0 10px ${resource.type === 'soul_flower' ? '#22c55e' : 
                                                     resource.type === 'ancient_ether' ? '#3b82f6' : 
                                                     resource.type === 'dark_ether' ? '#8b5cf6' : '#6b7280'}` : 'none'
              }}
              onClick={() => onResourceClick(resource.id)}
            />
          );
        })}

        {/* Enemies */}
        {enemies.map(enemy => {
          const distance = Math.sqrt(
            Math.pow(player.x - enemy.x, 2) + Math.pow(player.y - enemy.y, 2)
          );
          const inLightRadius = distance < player.lightRadius;
          const isDarkVisible = gameState.darkEyesActive || !enemy.isDark;
          
          if (!isDarkVisible && !inLightRadius) return null;

          return (
            <div
              key={enemy.id}
              className={`absolute w-6 h-6 rounded-full transition-all duration-200 ${
                enemy.type === 'hostile' ? 'bg-red-500' : 
                enemy.type === 'neutral' ? 'bg-yellow-500' : 'bg-green-500'
              } ${inLightRadius ? 'opacity-100' : 'opacity-50'} ${
                enemy.isDark ? 'ring-2 ring-purple-500' : ''
              }`}
              style={{
                left: enemy.x - 12,
                top: enemy.y - 12,
                filter: enemy.isDark && gameState.darkEyesActive ? 'drop-shadow(0 0 8px #8b5cf6)' : 'none'
              }}
            >
              {/* Health bar */}
              <div className="absolute -top-2 left-0 w-full h-1 bg-gray-700 rounded">
                <div
                  className="h-full bg-red-500 rounded transition-all duration-200"
                  style={{ width: `${(enemy.health / enemy.maxHealth) * 100}%` }}
                />
              </div>
            </div>
          );
        })}

        {/* Player */}
        <div
          className="absolute w-8 h-8 bg-blue-500 rounded-full border-2 border-white transition-all duration-100"
          style={{
            left: player.x - 16,
            top: player.y - 16,
            boxShadow: '0 0 20px rgba(59, 130, 246, 0.5)'
          }}
        >
          {/* Player direction indicator */}
          <div
            className="absolute w-2 h-2 bg-white rounded-full"
            style={{
              left: '50%',
              top: '10%',
              transform: 'translateX(-50%)'
            }}
          />
        </div>

        {/* Player Light Radius */}
        <div
          className="absolute rounded-full pointer-events-none"
          style={{
            left: player.x - player.lightRadius,
            top: player.y - player.lightRadius,
            width: player.lightRadius * 2,
            height: player.lightRadius * 2,
            background: `radial-gradient(circle, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 50%, transparent 100%)`,
            border: '1px solid rgba(255,255,255,0.1)'
          }}
        />
      </div>

      {/* Dark Eyes Effect */}
      {gameState.darkEyesActive && (
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0 bg-purple-900 opacity-20 animate-pulse" />
          <div className="absolute inset-0 border-4 border-purple-500 animate-pulse" />
        </div>
      )}

      {/* Weather Effects */}
      {gameState.weather === 'fog' && (
        <div className="absolute inset-0 bg-gray-500 opacity-30 pointer-events-none" />
      )}
      {gameState.weather === 'storm' && (
        <div className="absolute inset-0 bg-gray-800 opacity-40 pointer-events-none animate-pulse" />
      )}
    </div>
  );
};