import React from 'react';
import { Dice6, Home, Clock, Infinity } from 'lucide-react';

interface GameModeSelectorProps {
  onSelect: (mode: 'roguelike' | 'survival') => void;
}

export default function GameModeSelector({ onSelect }: GameModeSelectorProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center px-8">
      <div className="max-w-4xl mx-auto text-center">
        <h1 className="text-5xl font-bold text-white mb-4">Choose Your Path</h1>
        <p className="text-purple-300 text-xl mb-12">
          Each mode offers a unique survival experience in the DarkEther realm
        </p>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Roguelike Mode */}
          <div className="bg-slate-800/50 border border-purple-500/30 rounded-xl p-8 hover:border-purple-400/50 transition-all duration-300 hover:scale-105">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Dice6 className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-3xl font-bold text-white mb-2">Roguelike Mode</h2>
              <p className="text-purple-300">High risk, high reward</p>
            </div>

            <div className="space-y-4 mb-8">
              <div className="flex items-center gap-3 text-left">
                <Clock className="w-5 h-5 text-orange-400" />
                <span className="text-white">30-60 minute sessions</span>
              </div>
              <div className="flex items-center gap-3 text-left">
                <span className="text-red-400">💀</span>
                <span className="text-white">Full wipe on death</span>
              </div>
              <div className="flex items-center gap-3 text-left">
                <span className="text-purple-400">🔮</span>
                <span className="text-white">Procedural world generation</span>
              </div>
              <div className="flex items-center gap-3 text-left">
                <span className="text-green-400">✨</span>
                <span className="text-white">Persistent XP and Shards</span>
              </div>
            </div>

            <button
              onClick={() => onSelect('roguelike')}
              className="w-full py-3 bg-gradient-to-r from-red-600 to-purple-600 hover:from-red-700 hover:to-purple-700 text-white font-semibold rounded-lg transition-all duration-300 hover:shadow-lg shadow-purple-500/25"
            >
              Enter the Chaos
            </button>
          </div>

          {/* Survival Mode */}
          <div className="bg-slate-800/50 border border-green-500/30 rounded-xl p-8 hover:border-green-400/50 transition-all duration-300 hover:scale-105">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Home className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-3xl font-bold text-white mb-2">Survival Mode</h2>
              <p className="text-green-300">Build, craft, persist</p>
            </div>

            <div className="space-y-4 mb-8">
              <div className="flex items-center gap-3 text-left">
                <Infinity className="w-5 h-5 text-blue-400" />
                <span className="text-white">Persistent world saves</span>
              </div>
              <div className="flex items-center gap-3 text-left">
                <span className="text-yellow-400">🏗️</span>
                <span className="text-white">Base building & crafting</span>
              </div>
              <div className="flex items-center gap-3 text-left">
                <span className="text-orange-400">⚰️</span>
                <span className="text-white">Death drops gear only</span>
              </div>
              <div className="flex items-center gap-3 text-left">
                <span className="text-purple-400">💎</span>
                <span className="text-white">Shard farming focus</span>
              </div>
            </div>

            <button
              onClick={() => onSelect('survival')}
              className="w-full py-3 bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white font-semibold rounded-lg transition-all duration-300 hover:shadow-lg shadow-green-500/25"
            >
              Build Your Legacy
            </button>
          </div>
        </div>

        <div className="mt-12 text-center">
          <p className="text-purple-400 text-sm mb-2">
            💡 Tip: You can switch modes anytime from the main menu
          </p>
          <p className="text-slate-400 text-xs">
            Both modes share the same Shard progression and DarkEther XP
          </p>
        </div>
      </div>
    </div>
  );
}