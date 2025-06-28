import React from 'react';
import { Player, GameState } from '../types/game';
import { Heart, Brain, Zap, Eye, Clock, MapPin } from 'lucide-react';
import { BIOMES } from '../data/gameData';

interface GameUIProps {
  player: Player;
  gameState: GameState;
  onUseItem: (itemId: string) => void;
  onActivateDarkEyes: () => void;
  onChangeBiome: (biomeId: string) => void;
}

export const GameUI: React.FC<GameUIProps> = ({
  player,
  gameState,
  onUseItem,
  onActivateDarkEyes,
  onChangeBiome
}) => {
  const formatTime = (time: number) => {
    const hours = Math.floor((time * 24) % 24);
    const minutes = Math.floor(((time * 24) % 1) * 60);
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
  };

  const getSanityColor = () => {
    const percent = player.sanity / player.maxSanity;
    if (percent > 0.75) return 'bg-green-500';
    if (percent > 0.5) return 'bg-yellow-500';
    if (percent > 0.25) return 'bg-orange-500';
    return 'bg-red-500';
  };

  return (
    <div className="absolute inset-0 pointer-events-none">
      {/* Top HUD */}
      <div className="absolute top-4 left-4 right-4 flex justify-between items-start pointer-events-auto">
        {/* Player Stats */}
        <div className="bg-black/80 backdrop-blur-sm rounded-lg p-4 space-y-2">
          {/* Health */}
          <div className="flex items-center space-x-2">
            <Heart className="w-5 h-5 text-red-500" />
            <div className="w-32 h-3 bg-gray-700 rounded-full overflow-hidden">
              <div
                className="h-full bg-red-500 transition-all duration-300"
                style={{ width: `${(player.health / player.maxHealth) * 100}%` }}
              />
            </div>
            <span className="text-white text-sm font-mono">
              {Math.floor(player.health)}/{player.maxHealth}
            </span>
          </div>

          {/* Sanity */}
          <div className="flex items-center space-x-2">
            <Brain className="w-5 h-5 text-purple-500" />
            <div className="w-32 h-3 bg-gray-700 rounded-full overflow-hidden">
              <div
                className={`h-full transition-all duration-300 ${getSanityColor()}`}
                style={{ width: `${(player.sanity / player.maxSanity) * 100}%` }}
              />
            </div>
            <span className="text-white text-sm font-mono">
              {Math.floor(player.sanity)}/{player.maxSanity}
            </span>
          </div>

          {/* Souls */}
          <div className="flex items-center space-x-2">
            <Zap className="w-5 h-5 text-blue-500" />
            <span className="text-blue-400 font-mono">{player.souls}</span>
          </div>
        </div>

        {/* Game Info */}
        <div className="bg-black/80 backdrop-blur-sm rounded-lg p-4 space-y-2">
          <div className="flex items-center space-x-2">
            <Clock className="w-4 h-4 text-yellow-500" />
            <span className="text-white text-sm">{formatTime(gameState.timeOfDay)}</span>
          </div>
          <div className="flex items-center space-x-2">
            <MapPin className="w-4 h-4 text-green-500" />
            <span className="text-white text-sm">{BIOMES[gameState.currentBiome].name}</span>
          </div>
        </div>
      </div>

      {/* Inventory */}
      <div className="absolute bottom-4 left-4 bg-black/80 backdrop-blur-sm rounded-lg p-4 pointer-events-auto">
        <h3 className="text-white font-semibold mb-2">Inventory</h3>
        <div className="grid grid-cols-4 gap-2">
          {player.inventory.map((item, index) => (
            <button
              key={`${item.id}-${index}`}
              onClick={() => item.type === 'consumable' && onUseItem(item.id)}
              className="w-12 h-12 bg-gray-700 hover:bg-gray-600 rounded border border-gray-600 flex flex-col items-center justify-center text-xs text-white transition-colors"
              title={`${item.name} (${item.quantity})`}
            >
              <span className="text-lg">{item.icon}</span>
              <span className="text-xs">{item.quantity}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Actions */}
      <div className="absolute bottom-4 right-4 space-y-2 pointer-events-auto">
        {/* Dark Eyes */}
        <button
          onClick={onActivateDarkEyes}
          disabled={gameState.darkEyesCooldown > 0}
          className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-semibold transition-all ${
            gameState.darkEyesCooldown > 0
              ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
              : gameState.darkEyesActive
              ? 'bg-purple-600 text-white animate-pulse'
              : 'bg-purple-700 hover:bg-purple-600 text-white'
          }`}
        >
          <Eye className="w-5 h-5" />
          <span>
            {gameState.darkEyesActive
              ? 'Dark Eyes Active'
              : gameState.darkEyesCooldown > 0
              ? `Cooldown: ${Math.ceil(gameState.darkEyesCooldown / 1000)}s`
              : 'Activate Dark Eyes'}
          </span>
        </button>

        {/* Biome Selector */}
        <div className="bg-black/80 backdrop-blur-sm rounded-lg p-3">
          <h4 className="text-white text-sm font-semibold mb-2">Travel</h4>
          <div className="space-y-1">
            {Object.values(BIOMES).map(biome => (
              <button
                key={biome.id}
                onClick={() => onChangeBiome(biome.id)}
                className={`block w-full text-left px-3 py-1 rounded text-sm transition-colors ${
                  gameState.currentBiome === biome.id
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-300 hover:bg-gray-700'
                }`}
              >
                {biome.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Controls Help */}
      <div className="absolute top-4 right-4 bg-black/80 backdrop-blur-sm rounded-lg p-3 text-white text-sm pointer-events-auto">
        <h4 className="font-semibold mb-2">Controls</h4>
        <div className="space-y-1 text-xs">
          <div>WASD / Arrow Keys: Move</div>
          <div>Click resources to collect</div>
          <div>Click potions to use</div>
          <div>Dark Eyes: See hidden enemies</div>
        </div>
      </div>

      {/* Sanity Effects Overlay */}
      {player.sanity < 50 && (
        <div className="absolute inset-0 pointer-events-none">
          <div
            className="absolute inset-0 bg-red-900 animate-pulse"
            style={{ opacity: (50 - player.sanity) / 100 * 0.3 }}
          />
        </div>
      )}

      {/* Low Health Warning */}
      {player.health < 25 && (
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0 border-4 border-red-500 animate-pulse" />
        </div>
      )}
    </div>
  );
};