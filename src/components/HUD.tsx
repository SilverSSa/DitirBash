import React from 'react';
import { Heart, Brain, Zap, Sun, Moon, Eye } from 'lucide-react';
import { useGame } from '../context/GameContext';

export default function HUD() {
  const { state } = useGame();

  const getSanityColor = (sanity: number) => {
    if (sanity > 75) return 'bg-green-500';
    if (sanity > 50) return 'bg-yellow-500';
    if (sanity > 25) return 'bg-orange-500';
    return 'bg-red-500';
  };

  const getLightIcon = () => {
    switch (state.lightStatus) {
      case 'bright': return <Sun className="w-4 h-4 text-yellow-400" />;
      case 'dim': return <Eye className="w-4 h-4 text-orange-400" />;
      case 'dark': return <Moon className="w-4 h-4 text-red-400" />;
    }
  };

  return (
    <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-10">
      <div className="bg-slate-900/90 backdrop-blur-sm border border-slate-700 rounded-lg p-4 min-w-96">
        <div className="grid grid-cols-3 gap-6">
          {/* Health */}
          <div className="flex items-center gap-2">
            <Heart className="w-5 h-5 text-red-400" />
            <div className="flex-1">
              <div className="flex justify-between text-xs text-slate-300 mb-1">
                <span>Health</span>
                <span>{state.playerStats.health}/{state.playerStats.maxHealth}</span>
              </div>
              <div className="w-full bg-slate-700 rounded-full h-2">
                <div 
                  className="bg-red-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${(state.playerStats.health / state.playerStats.maxHealth) * 100}%` }}
                />
              </div>
            </div>
          </div>

          {/* Sanity */}
          <div className="flex items-center gap-2">
            <Brain className="w-5 h-5 text-purple-400" />
            <div className="flex-1">
              <div className="flex justify-between text-xs text-slate-300 mb-1">
                <span>Sanity</span>
                <span>{state.playerStats.sanity}/{state.playerStats.maxSanity}</span>
              </div>
              <div className="w-full bg-slate-700 rounded-full h-2">
                <div 
                  className={`h-2 rounded-full transition-all duration-300 ${getSanityColor(state.playerStats.sanity)}`}
                  style={{ width: `${(state.playerStats.sanity / state.playerStats.maxSanity) * 100}%` }}
                />
              </div>
            </div>
          </div>

          {/* Souls */}
          <div className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-blue-400" />
            <div className="flex-1">
              <div className="text-xs text-slate-300 mb-1">Souls</div>
              <div className="text-lg font-bold text-blue-400">{state.playerStats.souls}</div>
            </div>
          </div>
        </div>

        {/* Secondary Info */}
        <div className="flex justify-between items-center mt-4 pt-4 border-t border-slate-700">
          <div className="flex items-center gap-4 text-sm text-slate-300">
            <div className="flex items-center gap-1">
              {getLightIcon()}
              <span className="capitalize">{state.lightStatus}</span>
            </div>
            
            <div className="flex items-center gap-1">
              <span className="text-purple-400">💎</span>
              <span>{state.playerStats.shards} Shards</span>
            </div>

            <div className="flex items-center gap-1">
              <span className="text-yellow-400">⭐</span>
              <span>Level {state.playerStats.level}</span>
            </div>
          </div>

          {state.equippedWeapon && (
            <div className="text-sm text-slate-300">
              <span className="text-purple-400">🗡️</span> {state.equippedWeapon}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}