import React from 'react';
import { X, Package } from 'lucide-react';

interface InventoryProps {
  onClose: () => void;
}

export default function Inventory({ onClose }: InventoryProps) {
  const inventoryItems = [
    { id: 1, name: 'Soul Essence', quantity: 12, type: 'material', rarity: 'common' },
    { id: 2, name: 'Dark Crystal', quantity: 3, type: 'material', rarity: 'rare' },
    { id: 3, name: 'Ancient Ether', quantity: 7, type: 'crafting', rarity: 'uncommon' },
    { id: 4, name: 'Sanity Potion', quantity: 2, type: 'consumable', rarity: 'common' },
    { id: 5, name: 'Light Orb', quantity: 5, type: 'tool', rarity: 'common' },
    { id: 6, name: 'Shadow Shard', quantity: 1, type: 'weapon', rarity: 'legendary' },
  ];

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'common': return 'border-gray-400 bg-gray-900/50';
      case 'uncommon': return 'border-green-400 bg-green-900/50';
      case 'rare': return 'border-blue-400 bg-blue-900/50';
      case 'epic': return 'border-purple-400 bg-purple-900/50';
      case 'legendary': return 'border-yellow-400 bg-yellow-900/50';
      default: return 'border-gray-400 bg-gray-900/50';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'material': return '🪨';
      case 'crafting': return '⚗️';
      case 'consumable': return '🧪';
      case 'tool': return '🔧';
      case 'weapon': return '⚔️';
      default: return '📦';
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-end justify-center z-50 pb-8">
      <div className="bg-slate-900 border border-slate-700 rounded-xl p-6 max-w-4xl w-full mx-4 max-h-[60vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Package className="w-6 h-6 text-purple-400" />
            <h2 className="text-2xl font-bold text-white">Inventory</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-800 rounded-lg transition-colors"
          >
            <X className="w-6 h-6 text-slate-400" />
          </button>
        </div>

        {/* Inventory Grid */}
        <div className="grid grid-cols-8 gap-3">
          {inventoryItems.map((item) => (
            <div
              key={item.id}
              className={`aspect-square border-2 rounded-lg p-3 cursor-pointer hover:scale-105 transition-all duration-200 ${getRarityColor(item.rarity)}`}
              title={`${item.name} (${item.quantity})`}
            >
              <div className="flex flex-col items-center justify-center h-full text-center">
                <div className="text-2xl mb-1">{getTypeIcon(item.type)}</div>
                <div className="text-xs text-white font-medium leading-tight">{item.name}</div>
                <div className="text-xs text-slate-300 mt-1">{item.quantity}</div>
              </div>
            </div>
          ))}

          {/* Empty Slots */}
          {[...Array(16 - inventoryItems.length)].map((_, i) => (
            <div
              key={`empty-${i}`}
              className="aspect-square border-2 border-dashed border-slate-600 rounded-lg bg-slate-800/30"
            />
          ))}
        </div>

        {/* Footer */}
        <div className="mt-6 pt-4 border-t border-slate-700">
          <div className="flex justify-between items-center text-sm text-slate-400">
            <span>Inventory: {inventoryItems.length}/16 slots used</span>
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1">
                <div className="w-3 h-3 border-2 border-gray-400 rounded"></div>
                Common
              </span>
              <span className="flex items-center gap-1">
                <div className="w-3 h-3 border-2 border-green-400 rounded"></div>
                Uncommon
              </span>
              <span className="flex items-center gap-1">
                <div className="w-3 h-3 border-2 border-blue-400 rounded"></div>
                Rare
              </span>
              <span className="flex items-center gap-1">
                <div className="w-3 h-3 border-2 border-yellow-400 rounded"></div>
                Legendary
              </span>
            </div>
          </div>
        </div>

        <div className="mt-4 text-center text-slate-400 text-sm">
          Press <span className="text-white font-mono">I</span> to close inventory
        </div>
      </div>
    </div>
  );
}