import React from 'react';
import { Skull, Play, Users, Settings, ShoppingCart, User } from 'lucide-react';

interface MainMenuProps {
  onStartGame: (mode: 'roguelike' | 'survival') => void;
  onShowSettings: () => void;
  onShowStore: () => void;
  onShowProfile: () => void;
}

export const MainMenu: React.FC<MainMenuProps> = ({
  onStartGame,
  onShowSettings,
  onShowStore,
  onShowProfile
}) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-800 text-white flex items-center justify-center">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_80%,rgba(120,119,198,0.3),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(255,119,198,0.2),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_40%_40%,rgba(120,200,255,0.1),transparent_50%)]" />
      </div>

      <div className="relative z-10 text-center max-w-2xl mx-auto px-4">
        {/* Logo */}
        <div className="mb-12">
          <div className="flex items-center justify-center space-x-4 mb-6">
            <Skull className="w-16 h-16 text-purple-400" />
            <h1 className="text-6xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
              DitirBash
            </h1>
          </div>
          <h2 className="text-2xl font-light text-gray-300 mb-4">Survival Experience</h2>
          <p className="text-gray-400 max-w-lg mx-auto">
            A dark fantasy survival RPG where sanity is currency, souls are power, and death is just the beginning.
          </p>
        </div>

        {/* Game Mode Selection */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <button
            onClick={() => onStartGame('survival')}
            className="group bg-gradient-to-br from-green-900/50 to-blue-900/50 backdrop-blur-sm border border-green-500/20 rounded-xl p-6 hover:border-green-400/40 transition-all duration-300 transform hover:scale-105"
          >
            <Play className="w-8 h-8 text-green-400 mx-auto mb-4 group-hover:scale-110 transition-transform" />
            <h3 className="text-xl font-semibold mb-2">Survival Mode</h3>
            <p className="text-gray-300 text-sm">
              Persistent world with base building, crafting, and long-term progression.
            </p>
          </button>

          <button
            onClick={() => onStartGame('roguelike')}
            className="group bg-gradient-to-br from-red-900/50 to-purple-900/50 backdrop-blur-sm border border-red-500/20 rounded-xl p-6 hover:border-red-400/40 transition-all duration-300 transform hover:scale-105"
          >
            <Skull className="w-8 h-8 text-red-400 mx-auto mb-4 group-hover:scale-110 transition-transform" />
            <h3 className="text-xl font-semibold mb-2">Roguelike Mode</h3>
            <p className="text-gray-300 text-sm">
              Procedural worlds with permadeath. High risk, high reward gameplay.
            </p>
          </button>
        </div>

        {/* Menu Options */}
        <div className="flex flex-wrap justify-center gap-4">
          <button
            onClick={onShowProfile}
            className="flex items-center space-x-2 bg-purple-600/20 hover:bg-purple-600/30 border border-purple-500/30 rounded-lg px-6 py-3 transition-all duration-300"
          >
            <User className="w-5 h-5" />
            <span>Profile</span>
          </button>

          <button
            onClick={onShowStore}
            className="flex items-center space-x-2 bg-blue-600/20 hover:bg-blue-600/30 border border-blue-500/30 rounded-lg px-6 py-3 transition-all duration-300"
          >
            <ShoppingCart className="w-5 h-5" />
            <span>Shard Store</span>
          </button>

          <button
            onClick={onShowSettings}
            className="flex items-center space-x-2 bg-gray-600/20 hover:bg-gray-600/30 border border-gray-500/30 rounded-lg px-6 py-3 transition-all duration-300"
          >
            <Settings className="w-5 h-5" />
            <span>Settings</span>
          </button>
        </div>

        {/* Version Info */}
        <div className="mt-12 text-gray-500 text-sm">
          <p>DitirBash: Survival Experience v1.0.0</p>
          <p>Web Demo - Full Release Coming Soon</p>
        </div>
      </div>
    </div>
  );
};