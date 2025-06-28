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
  onEnemyClick: (enemyId: string) => void;
}

export const GameWorld: React.FC<GameWorldProps> = ({
  player,
  enemies,
  resources,
  gameState,
  worldSize,
  onResourceClick,
  onEnemyClick
}) => {
  const biome = BIOMES[gameState.currentBiome];
  const viewportSize = 600;
  const scale = 1.5;

  // Calculate camera offset to center on player
  const cameraX = player.x - viewportSize / 2;
  const cameraY = player.y - viewportSize / 2;

  const getSanityEffect = () => {
    const sanityPercent = player.sanity / player.maxSanity;
    if (sanityPercent < 0.25) return 'blur(4px) saturate(0.3) hue-rotate(180deg) contrast(1.5)';
    if (sanityPercent < 0.5) return 'blur(2px) saturate(0.6) contrast(1.2)';
    if (sanityPercent < 0.75) return 'saturate(0.8) contrast(1.1)';
    return 'none';
  };

  const getTimeOfDayFilter = () => {
    const time = gameState.timeOfDay;
    if (time < 0.25 || time > 0.75) {
      return 'brightness(0.4) contrast(1.3) sepia(0.2)';
    } else if (time < 0.3 || time > 0.7) {
      return 'brightness(0.7) sepia(0.4) hue-rotate(15deg)';
    }
    return 'brightness(1)';
  };

  const getWeatherEffect = () => {
    switch (gameState.weather) {
      case 'fog':
        return 'blur(1px) opacity(0.8)';
      case 'storm':
        return 'contrast(1.3) brightness(0.6)';
      case 'sandstorm':
        return 'sepia(0.6) blur(2px) brightness(0.7)';
      default:
        return 'none';
    }
  };

  return (
    <div className="relative w-full h-full bg-gray-900 overflow-hidden">
      {/* World Container */}
      <div
        className="absolute transition-all duration-100"
        style={{
          width: worldSize,
          height: worldSize,
          transform: `translate(${-cameraX}px, ${-cameraY}px) scale(${scale})`,
          filter: `${getSanityEffect()} ${getTimeOfDayFilter()} ${getWeatherEffect()}`,
          backgroundColor: biome.color + '15'
        }}
      >
        {/* Biome Background Pattern */}
        <div
          className="absolute inset-0 opacity-30"
          style={{
            width: worldSize,
            height: worldSize,
            backgroundImage: `
              radial-gradient(circle at 20% 20%, ${biome.color}40 0%, transparent 40%),
              radial-gradient(circle at 80% 80%, ${biome.color}30 0%, transparent 40%),
              radial-gradient(circle at 40% 60%, ${biome.color}20 0%, transparent 30%)
            `,
            backgroundSize: '200px 200px, 150px 150px, 100px 100px'
          }}
        />

        {/* Grid Pattern for Better Visibility */}
        <div
          className="absolute inset-0 opacity-10"
          style={{
            width: worldSize,
            height: worldSize,
            backgroundImage: `
              linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
            `,
            backgroundSize: '50px 50px'
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
              className={`absolute cursor-pointer transition-all duration-300 transform hover:scale-110 ${
                inLightRadius ? 'opacity-100 scale-100' : 'opacity-40 scale-75'
              }`}
              style={{
                left: resource.x - 12,
                top: resource.y - 12,
                width: 24,
                height: 24
              }}
              onClick={() => onResourceClick(resource.id)}
            >
              <div
                className="w-full h-full rounded-full border-2 border-white/30"
                style={{
                  backgroundColor: resource.type === 'soul_flower' ? '#22c55e' : 
                                 resource.type === 'ancient_ether' ? '#3b82f6' : 
                                 resource.type === 'dark_ether' ? '#8b5cf6' : 
                                 resource.type === 'stone' ? '#6b7280' : '#92400e',
                  boxShadow: inLightRadius ? `0 0 15px ${resource.type === 'soul_flower' ? '#22c55e' : 
                                                       resource.type === 'ancient_ether' ? '#3b82f6' : 
                                                       resource.type === 'dark_ether' ? '#8b5cf6' : 
                                                       resource.type === 'stone' ? '#6b7280' : '#92400e'}` : 'none'
                }}
              >
                <div className="w-full h-full flex items-center justify-center text-white text-xs font-bold">
                  {resource.quantity}
                </div>
              </div>
            </div>
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
              className={`absolute cursor-pointer transition-all duration-200 transform hover:scale-110 ${
                enemy.type === 'hostile' ? 'bg-red-500' : 
                enemy.type === 'neutral' ? 'bg-yellow-500' : 
                enemy.type === 'boss' ? 'bg-purple-600' : 'bg-green-500'
              } ${inLightRadius ? 'opacity-100' : 'opacity-60'} ${
                enemy.isDark ? 'ring-4 ring-purple-400 animate-pulse' : ''
              }`}
              style={{
                left: enemy.x - 16,
                top: enemy.y - 16,
                width: enemy.type === 'boss' ? 40 : 32,
                height: enemy.type === 'boss' ? 40 : 32,
                borderRadius: '50%',
                border: '3px solid rgba(255,255,255,0.8)',
                filter: enemy.isDark && gameState.darkEyesActive ? 'drop-shadow(0 0 12px #8b5cf6)' : 'none'
              }}
              onClick={() => onEnemyClick(enemy.id)}
            >
              {/* Health bar */}
              <div className="absolute -top-3 left-0 w-full h-1.5 bg-gray-800 rounded-full border border-white/30">
                <div
                  className="h-full bg-red-500 rounded-full transition-all duration-300"
                  style={{ width: `${(enemy.health / enemy.maxHealth) * 100}%` }}
                />
              </div>
              
              {/* Enemy type indicator */}
              <div className="w-full h-full flex items-center justify-center text-white text-xs font-bold">
                {enemy.type === 'boss' ? '👑' : 
                 enemy.type === 'hostile' ? '⚔️' : 
                 enemy.type === 'neutral' ? '👁️' : '🦌'}
              </div>
            </div>
          );
        })}

        {/* Player */}
        <div
          className="absolute transition-all duration-100 z-20"
          style={{
            left: player.x - 20,
            top: player.y - 20,
            width: 40,
            height: 40
          }}
        >
          {/* Player Body */}
          <div
            className="w-full h-full bg-blue-500 rounded-full border-4 border-white relative"
            style={{
              boxShadow: '0 0 25px rgba(59, 130, 246, 0.8), inset 0 0 10px rgba(255,255,255,0.3)'
            }}
          >
            {/* Player direction indicator */}
            <div
              className="absolute w-3 h-3 bg-white rounded-full"
              style={{
                left: '50%',
                top: '15%',
                transform: 'translateX(-50%)',
                boxShadow: '0 0 5px rgba(255,255,255,0.8)'
              }}
            />
            
            {/* Movement trail effect */}
            {player.isMoving && (
              <div
                className="absolute inset-0 rounded-full bg-blue-400 animate-ping"
                style={{ animationDuration: '0.5s' }}
              />
            )}
          </div>
        </div>

        {/* Player Light Radius */}
        <div
          className="absolute rounded-full pointer-events-none z-10"
          style={{
            left: player.x - player.lightRadius,
            top: player.y - player.lightRadius,
            width: player.lightRadius * 2,
            height: player.lightRadius * 2,
            background: `radial-gradient(circle, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0.08) 40%, rgba(255,255,255,0.03) 70%, transparent 100%)`,
            border: '2px solid rgba(255,255,255,0.2)'
          }}
        />

        {/* Static Lights */}
        {gameState.staticLights?.map(light => (
          <div
            key={light.id}
            className="absolute rounded-full pointer-events-none"
            style={{
              left: light.x - light.radius,
              top: light.y - light.radius,
              width: light.radius * 2,
              height: light.radius * 2,
              background: `radial-gradient(circle, ${light.color}30 0%, ${light.color}15 50%, transparent 100%)`,
              border: `1px solid ${light.color}50`
            }}
          />
        ))}
      </div>

      {/* Dark Eyes Effect */}
      {gameState.darkEyesActive && (
        <div className="absolute inset-0 pointer-events-none z-30">
          <div className="absolute inset-0 bg-purple-900 opacity-25 animate-pulse" />
          <div className="absolute inset-0 border-8 border-purple-500 animate-pulse" />
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-purple-300 text-2xl font-bold animate-pulse">
            DARK EYES ACTIVE
          </div>
        </div>
      )}

      {/* Weather Effects */}
      {gameState.weather === 'fog' && (
        <div className="absolute inset-0 bg-gray-400 opacity-40 pointer-events-none animate-pulse" />
      )}
      {gameState.weather === 'storm' && (
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0 bg-gray-800 opacity-50 animate-pulse" />
          <div className="absolute inset-0 bg-blue-900 opacity-20 animate-ping" />
        </div>
      )}
      {gameState.weather === 'sandstorm' && (
        <div className="absolute inset-0 bg-yellow-700 opacity-35 pointer-events-none animate-pulse" />
      )}

      {/* Realm Indicator */}
      <div className="absolute top-4 left-4 bg-black/80 backdrop-blur-sm rounded-lg p-2 text-white text-sm z-40">
        <div className="font-semibold">{gameState.currentRealm}</div>
        <div className="text-xs text-gray-300">{biome.name}</div>
      </div>
    </div>
  );
};