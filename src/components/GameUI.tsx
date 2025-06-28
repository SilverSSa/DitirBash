import React, { useState } from 'react';
import { Player, GameState, InventoryItem } from '../types/game';
import { Heart, Brain, Zap, Eye, Clock, MapPin, Lightbulb, Shield, Sword, Package } from 'lucide-react';
import { BIOMES, ITEMS } from '../data/gameData';

interface GameUIProps {
  player: Player;
  gameState: GameState;
  onUseItem: (itemId: string) => void;
  onActivateDarkEyes: () => void;
  onChangeBiome: (biomeId: string) => void;
  onChangeRealm: (realm: string) => void;
  onEquipWeapon: (weaponId: string) => void;
  onCraftItem: (recipeId: string) => void;
  onPlaceLight: () => void;
}

export const GameUI: React.FC<GameUIProps> = ({
  player,
  gameState,
  onUseItem,
  onActivateDarkEyes,
  onChangeBiome,
  onChangeRealm,
  onEquipWeapon,
  onCraftItem,
  onPlaceLight
}) => {
  const [showInventory, setShowInventory] = useState(false);
  const [showCrafting, setShowCrafting] = useState(false);
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);

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

  const getSanityEffectText = () => {
    const percent = player.sanity / player.maxSanity;
    if (percent < 0.25) return 'CRITICAL - Hallucinations';
    if (percent < 0.5) return 'LOW - Audio distortions';
    if (percent < 0.75) return 'MODERATE - Slight blur';
    return 'STABLE';
  };

  // Ensure inventory has exactly 16 slots
  const inventorySlots = Array.from({ length: 16 }, (_, index) => {
    return player.inventory[index] || null;
  });

  return (
    <div className="absolute inset-0 pointer-events-none">
      {/* Top HUD */}
      <div className="absolute top-4 left-4 right-4 flex justify-between items-start pointer-events-auto z-40">
        {/* Player Stats */}
        <div className="bg-black/90 backdrop-blur-sm rounded-lg p-4 space-y-3 border border-gray-600">
          {/* Health */}
          <div className="flex items-center space-x-3">
            <Heart className="w-6 h-6 text-red-500" />
            <div className="w-40 h-4 bg-gray-700 rounded-full overflow-hidden border border-gray-500">
              <div
                className="h-full bg-red-500 transition-all duration-300"
                style={{ width: `${(player.health / player.maxHealth) * 100}%` }}
              />
            </div>
            <span className="text-white text-sm font-mono min-w-[60px]">
              {Math.floor(player.health)}/{player.maxHealth}
            </span>
          </div>

          {/* Sanity */}
          <div className="flex items-center space-x-3">
            <Brain className="w-6 h-6 text-purple-500" />
            <div className="w-40 h-4 bg-gray-700 rounded-full overflow-hidden border border-gray-500">
              <div
                className={`h-full transition-all duration-300 ${getSanityColor()}`}
                style={{ width: `${(player.sanity / player.maxSanity) * 100}%` }}
              />
            </div>
            <span className="text-white text-sm font-mono min-w-[60px]">
              {Math.floor(player.sanity)}/{player.maxSanity}
            </span>
          </div>

          {/* Sanity Status */}
          <div className="text-xs text-gray-300">
            Status: <span className={`font-semibold ${player.sanity < 50 ? 'text-red-400' : 'text-green-400'}`}>
              {getSanityEffectText()}
            </span>
          </div>

          {/* Souls & Shards */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Zap className="w-5 h-5 text-blue-500" />
              <span className="text-blue-400 font-mono">{player.souls}</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-purple-500 rounded-full"></div>
              <span className="text-purple-400 font-mono">{player.shards}</span>
            </div>
          </div>

          {/* Level & XP */}
          <div className="text-sm">
            <div className="flex justify-between text-white">
              <span>Level {player.level}</span>
              <span>{player.xp}/100 XP</span>
            </div>
            <div className="w-full h-2 bg-gray-700 rounded-full overflow-hidden mt-1">
              <div
                className="h-full bg-yellow-500 transition-all duration-300"
                style={{ width: `${(player.xp % 100)}%` }}
              />
            </div>
          </div>
        </div>

        {/* Game Info */}
        <div className="bg-black/90 backdrop-blur-sm rounded-lg p-4 space-y-2 border border-gray-600">
          <div className="flex items-center space-x-2">
            <Clock className="w-4 h-4 text-yellow-500" />
            <span className="text-white text-sm">{formatTime(gameState.timeOfDay)}</span>
          </div>
          <div className="flex items-center space-x-2">
            <MapPin className="w-4 h-4 text-green-500" />
            <span className="text-white text-sm">{BIOMES[gameState.currentBiome].name}</span>
          </div>
          <div className="text-xs text-gray-300">
            Realm: <span className="text-purple-400">{gameState.currentRealm}</span>
          </div>
          <div className="text-xs text-gray-300">
            Weather: <span className="text-blue-400">{gameState.weather}</span>
          </div>
        </div>
      </div>

      {/* Quick Action Bar */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/90 backdrop-blur-sm rounded-lg p-3 pointer-events-auto border border-gray-600">
        <div className="flex items-center space-x-4">
          {/* Equipped Weapon */}
          <div className="flex items-center space-x-2">
            <Sword className="w-5 h-5 text-orange-500" />
            <span className="text-white text-sm">
              {player.equippedWeapon ? player.equippedWeapon.name : 'None'}
            </span>
          </div>

          {/* Quick Actions */}
          <button
            onClick={() => setShowInventory(!showInventory)}
            className="flex items-center space-x-1 px-3 py-1 bg-gray-700 hover:bg-gray-600 rounded transition-colors"
          >
            <Package className="w-4 h-4 text-white" />
            <span className="text-white text-sm">Inventory</span>
          </button>

          <button
            onClick={() => setShowCrafting(!showCrafting)}
            className="flex items-center space-x-1 px-3 py-1 bg-gray-700 hover:bg-gray-600 rounded transition-colors"
          >
            <Shield className="w-4 h-4 text-white" />
            <span className="text-white text-sm">Craft</span>
          </button>

          <button
            onClick={onPlaceLight}
            className="flex items-center space-x-1 px-3 py-1 bg-gray-700 hover:bg-gray-600 rounded transition-colors"
          >
            <Lightbulb className="w-4 h-4 text-yellow-500" />
            <span className="text-white text-sm">Light</span>
          </button>
        </div>
      </div>

      {/* Inventory Panel */}
      {showInventory && (
        <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2 bg-black/95 backdrop-blur-sm rounded-lg p-6 pointer-events-auto border border-gray-600 w-96">
          <h3 className="text-white font-semibold mb-4 text-center">Inventory (16 slots)</h3>
          <div className="grid grid-cols-4 gap-3">
            {inventorySlots.map((item, index) => (
              <div
                key={index}
                className={`w-16 h-16 bg-gray-800 hover:bg-gray-700 rounded border-2 ${
                  item ? 'border-gray-500' : 'border-gray-700'
                } flex flex-col items-center justify-center text-xs text-white transition-colors cursor-pointer relative group`}
                onClick={() => item && setSelectedItem(item)}
              >
                {item ? (
                  <>
                    <span className="text-lg mb-1">{item.icon}</span>
                    <span className="text-xs font-bold">{item.quantity}</span>
                    
                    {/* Tooltip */}
                    <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-black/90 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50 w-48">
                      <div className="font-semibold">{item.name}</div>
                      <div className="text-gray-300 mt-1">{item.description}</div>
                      <div className="text-blue-400 mt-1">Type: {item.type}</div>
                      {item.type === 'consumable' && (
                        <div className="text-green-400 mt-1">Click to use</div>
                      )}
                    </div>
                  </>
                ) : (
                  <span className="text-gray-600">Empty</span>
                )}
              </div>
            ))}
          </div>
          
          {/* Item Actions */}
          {selectedItem && (
            <div className="mt-4 p-3 bg-gray-800 rounded border border-gray-600">
              <h4 className="text-white font-semibold">{selectedItem.name}</h4>
              <p className="text-gray-300 text-sm mt-1">{selectedItem.description}</p>
              <div className="flex space-x-2 mt-3">
                {selectedItem.type === 'consumable' && (
                  <button
                    onClick={() => {
                      onUseItem(selectedItem.id);
                      setSelectedItem(null);
                    }}
                    className="px-3 py-1 bg-green-600 hover:bg-green-700 text-white rounded text-sm transition-colors"
                  >
                    Use Item
                  </button>
                )}
                {selectedItem.type === 'weapon' && (
                  <button
                    onClick={() => {
                      onEquipWeapon(selectedItem.id);
                      setSelectedItem(null);
                    }}
                    className="px-3 py-1 bg-orange-600 hover:bg-orange-700 text-white rounded text-sm transition-colors"
                  >
                    Equip
                  </button>
                )}
                <button
                  onClick={() => setSelectedItem(null)}
                  className="px-3 py-1 bg-gray-600 hover:bg-gray-700 text-white rounded text-sm transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Actions Panel */}
      <div className="absolute bottom-4 right-4 space-y-3 pointer-events-auto">
        {/* Dark Eyes */}
        <button
          onClick={onActivateDarkEyes}
          disabled={gameState.darkEyesCooldown > 0}
          className={`flex items-center space-x-2 px-4 py-3 rounded-lg font-semibold transition-all ${
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

        {/* Realm Selector */}
        <div className="bg-black/90 backdrop-blur-sm rounded-lg p-3 border border-gray-600">
          <h4 className="text-white text-sm font-semibold mb-2">Realm Travel</h4>
          <div className="space-y-1">
            {['Normal World', 'Upside-Down', 'DarkEther Realm'].map(realm => (
              <button
                key={realm}
                onClick={() => onChangeRealm(realm)}
                className={`block w-full text-left px-3 py-1 rounded text-sm transition-colors ${
                  gameState.currentRealm === realm
                    ? 'bg-purple-600 text-white'
                    : 'text-gray-300 hover:bg-gray-700'
                }`}
              >
                {realm}
              </button>
            ))}
          </div>
        </div>

        {/* Biome Selector */}
        <div className="bg-black/90 backdrop-blur-sm rounded-lg p-3 border border-gray-600">
          <h4 className="text-white text-sm font-semibold mb-2">Biome Travel</h4>
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
      <div className="absolute top-4 right-4 bg-black/90 backdrop-blur-sm rounded-lg p-3 text-white text-sm pointer-events-auto border border-gray-600">
        <h4 className="font-semibold mb-2">Controls</h4>
        <div className="space-y-1 text-xs">
          <div><kbd className="bg-gray-700 px-1 rounded">WASD</kbd> Move</div>
          <div><kbd className="bg-gray-700 px-1 rounded">E</kbd> Interact</div>
          <div><kbd className="bg-gray-700 px-1 rounded">R</kbd> Unequip weapon</div>
          <div><kbd className="bg-gray-700 px-1 rounded">Tab</kbd> Inventory</div>
          <div><kbd className="bg-gray-700 px-1 rounded">F</kbd> Dark Eyes</div>
        </div>
      </div>

      {/* Sanity Effects Overlay */}
      {player.sanity < 50 && (
        <div className="absolute inset-0 pointer-events-none z-30">
          <div
            className="absolute inset-0 bg-red-900 animate-pulse"
            style={{ opacity: (50 - player.sanity) / 100 * 0.4 }}
          />
          {player.sanity < 25 && (
            <div className="absolute inset-0 animate-pulse">
              <div className="absolute top-1/4 left-1/4 w-8 h-8 bg-red-500 rounded-full opacity-60"></div>
              <div className="absolute top-3/4 right-1/4 w-6 h-6 bg-purple-500 rounded-full opacity-40"></div>
              <div className="absolute bottom-1/4 left-1/2 w-10 h-10 bg-yellow-500 rounded-full opacity-30"></div>
            </div>
          )}
        </div>
      )}

      {/* Low Health Warning */}
      {player.health < 25 && (
        <div className="absolute inset-0 pointer-events-none z-30">
          <div className="absolute inset-0 border-8 border-red-500 animate-pulse" />
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-red-500 text-2xl font-bold animate-pulse">
            LOW HEALTH
          </div>
        </div>
      )}

      {/* Boss Warning */}
      {enemies.some(e => e.type === 'boss') && (
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-purple-500 text-3xl font-bold animate-bounce pointer-events-none z-30">
          ⚠️ BOSS NEARBY ⚠️
        </div>
      )}
    </div>
  );
};