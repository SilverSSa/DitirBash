import React, { useState } from 'react';
import { ArrowLeft, ShoppingBag, Sparkles, Zap } from 'lucide-react';
import type { Screen } from '../App';
import { useGame } from '../context/GameContext';

interface ShardStoreProps {
  onNavigate: (screen: Screen) => void;
}

export default function ShardStore({ onNavigate }: ShardStoreProps) {
  const { state, dispatch } = useGame();
  const [selectedCategory, setSelectedCategory] = useState<'cosmetics' | 'consumables' | 'boosters'>('cosmetics');

  const storeItems = {
    cosmetics: [
      { id: 1, name: 'Soul Trail Skin', price: 1000, description: 'Ethereal purple particle trail', icon: '✨', owned: false },
      { id: 2, name: 'Dark Aura', price: 1500, description: 'Menacing shadow effect around player', icon: '🌑', owned: true },
      { id: 3, name: 'Crystal Weapon Glow', price: 800, description: 'Makes weapons shimmer with crystal energy', icon: '💎', owned: false },
      { id: 4, name: 'Phantom Wings', price: 2000, description: 'Ghostly wing cosmetic for movement', icon: '👻', owned: false },
    ],
    consumables: [
      { id: 5, name: 'Extra Light Orb', price: 300, description: 'Single-use light source', icon: '💡', quantity: 5 },
      { id: 6, name: 'Sanity Restore', price: 150, description: 'Instantly restore 50 sanity points', icon: '🧠', quantity: 3 },
      { id: 7, name: 'Soul Boost', price: 200, description: '+50% soul gain for next run', icon: '⚡', quantity: 2 },
      { id: 8, name: 'DarkEyes Refresh', price: 500, description: 'Reset DarkEyes cooldown', icon: '👁️', quantity: 1 },
    ],
    boosters: [
      { id: 9, name: 'Map Modifier', price: 800, description: 'Adds rare resource nodes to world', icon: '🗺️', duration: '24h' },
      { id: 10, name: 'XP Multiplier', price: 600, description: '2x DarkEther XP for next 3 runs', icon: '📈', duration: '3 runs' },
      { id: 11, name: 'Luck Charm', price: 400, description: '+25% rare item drop chance', icon: '🍀', duration: '12h' },
      { id: 12, name: 'Replay Token', price: 1000, description: 'Retry failed run without losing progress', icon: '🔄', quantity: 1 },
    ]
  };

  const handlePurchase = (item: any) => {
    if (state.playerStats.shards >= item.price) {
      dispatch({ type: 'SPEND_SHARDS', payload: item.price });
      // In a real game, this would update the player's inventory/cosmetics
      console.log(`Purchased ${item.name} for ${item.price} shards`);
    }
  };

  const canAfford = (price: number) => state.playerStats.shards >= price;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <button
          onClick={() => onNavigate('menu')}
          className="flex items-center gap-2 px-4 py-2 bg-slate-800/80 hover:bg-slate-700/80 rounded-lg transition-colors text-white"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Menu
        </button>

        <div className="text-center">
          <h1 className="text-4xl font-bold text-white mb-2">Shard Store</h1>
          <p className="text-purple-300">Enhance your survival experience</p>
        </div>

        <div className="flex items-center gap-2 bg-slate-800/80 rounded-lg px-4 py-2">
          <Sparkles className="w-5 h-5 text-purple-400" />
          <span className="text-white font-semibold">{state.playerStats.shards} Shards</span>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="flex justify-center mb-8">
        <div className="flex bg-slate-800/50 rounded-lg p-1">
          {(['cosmetics', 'consumables', 'boosters'] as const).map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-6 py-3 rounded-lg font-semibold transition-all duration-300 ${
                selectedCategory === category
                  ? 'bg-purple-600 text-white shadow-lg'
                  : 'text-purple-300 hover:text-white hover:bg-slate-700/50'
              }`}
            >
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Store Items */}
      <div className="max-w-6xl mx-auto">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {storeItems[selectedCategory].map((item) => (
            <div key={item.id} className="bg-slate-800/50 border border-slate-700 rounded-xl p-6 hover:border-purple-500/50 transition-all duration-300">
              <div className="text-center mb-4">
                <div className="text-4xl mb-2">{item.icon}</div>
                <h3 className="text-xl font-bold text-white mb-2">{item.name}</h3>
                <p className="text-slate-300 text-sm">{item.description}</p>
              </div>

              {/* Item Details */}
              <div className="space-y-2 mb-4">
                {selectedCategory === 'cosmetics' && 'owned' in item && (
                  <div className="text-center">
                    {item.owned ? (
                      <span className="text-green-400 text-sm">✓ Owned</span>
                    ) : (
                      <span className="text-slate-400 text-sm">Not owned</span>
                    )}
                  </div>
                )}

                {selectedCategory === 'consumables' && 'quantity' in item && (
                  <div className="text-center">
                    <span className="text-blue-400 text-sm">Owned: {item.quantity}</span>
                  </div>
                )}

                {selectedCategory === 'boosters' && 'duration' in item && (
                  <div className="text-center">
                    <span className="text-yellow-400 text-sm">Duration: {item.duration}</span>
                  </div>
                )}
              </div>

              {/* Purchase Button */}
              <div className="text-center">
                <div className="flex items-center justify-center gap-2 mb-3">
                  <Sparkles className="w-4 h-4 text-purple-400" />
                  <span className="text-lg font-bold text-white">{item.price}</span>
                </div>

                <button
                  onClick={() => handlePurchase(item)}
                  disabled={!canAfford(item.price) || (selectedCategory === 'cosmetics' && 'owned' in item && item.owned)}
                  className={`w-full py-2 px-4 rounded-lg font-semibold transition-all duration-300 ${
                    !canAfford(item.price)
                      ? 'bg-slate-700 text-slate-500 cursor-not-allowed'
                      : selectedCategory === 'cosmetics' && 'owned' in item && item.owned
                        ? 'bg-green-600 text-white cursor-not-allowed'
                        : 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white hover:shadow-lg'
                  }`}
                >
                  {selectedCategory === 'cosmetics' && 'owned' in item && item.owned
                    ? 'Owned'
                    : !canAfford(item.price)
                      ? 'Insufficient Shards'
                      : 'Purchase'
                  }
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer Info */}
      <div className="max-w-4xl mx-auto mt-12 text-center">
        <div className="bg-slate-800/30 border border-slate-700 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-white mb-2">Shard System</h3>
          <p className="text-slate-300 text-sm leading-relaxed">
            Shards are earned through gameplay and are the only currency in DitirBash. 
            All purchases are cosmetic or temporary boosts - no pay-to-win mechanics.
            Shards persist across all game modes and can be earned by defeating bosses, 
            completing challenges, and exploring the DarkEther realm.
          </p>
        </div>
      </div>
    </div>
  );
}