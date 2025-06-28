import React from 'react';
import { Play, ShoppingBag, User, Settings, Skull } from 'lucide-react';
import type { Screen } from '../App';

interface MainMenuProps {
  onNavigate: (screen: Screen) => void;
}

export default function MainMenu({ onNavigate }: MainMenuProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center relative overflow-hidden">
      {/* Animated background particles */}
      <div className="absolute inset-0">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-purple-400 rounded-full opacity-20 animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 2}s`
            }}
          />
        ))}
      </div>

      <div className="relative z-10 text-center max-w-4xl mx-auto px-8">
        {/* Game Title */}
        <div className="mb-16">
          <h1 className="text-6xl md:text-8xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-purple-600 bg-clip-text text-transparent mb-4">
            DitirBash
          </h1>
          <p className="text-2xl md:text-3xl text-purple-300 font-light tracking-wide">
            Survival Experience
          </p>
          <div className="flex items-center justify-center mt-4 text-red-400">
            <Skull className="w-6 h-6 mr-2" />
            <span className="text-lg">Dark Fantasy • Soul Essence • Survival</span>
            <Skull className="w-6 h-6 ml-2" />
          </div>
        </div>

        {/* Main Menu Buttons */}
        <div className="space-y-4 max-w-md mx-auto">
          <MenuButton
            icon={<Play className="w-6 h-6" />}
            label="Start Game"
            onClick={() => onNavigate('game')}
            primary
          />
          
          <MenuButton
            icon={<ShoppingBag className="w-6 h-6" />}
            label="Shard Store"
            onClick={() => onNavigate('store')}
          />
          
          <MenuButton
            icon={<User className="w-6 h-6" />}
            label="Player Profile"
            onClick={() => onNavigate('profile')}
          />
          
          <MenuButton
            icon={<Settings className="w-6 h-6" />}
            label="Settings"
            onClick={() => onNavigate('settings')}
          />
        </div>

        {/* Version Info */}
        <div className="absolute bottom-8 left-8 text-purple-400 text-sm">
          <p>Version 1.0.0 Alpha</p>
          <p>Web Build • Unity WebGL</p>
        </div>

        {/* Easter Egg */}
        <div className="absolute bottom-8 right-8 text-purple-400 text-xs opacity-60">
          <p>"The DarkEther whispers..."</p>
        </div>
      </div>
    </div>
  );
}

interface MenuButtonProps {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
  primary?: boolean;
}

function MenuButton({ icon, label, onClick, primary }: MenuButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`
        w-full flex items-center justify-center gap-3 px-8 py-4 rounded-lg
        font-semibold text-lg transition-all duration-300 group
        ${primary 
          ? 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-lg shadow-purple-500/25' 
          : 'bg-slate-800/80 hover:bg-slate-700/80 border border-purple-500/30 hover:border-purple-400/50 text-purple-100'
        }
        hover:scale-105 hover:shadow-xl
      `}
    >
      <span className="group-hover:scale-110 transition-transform duration-300">
        {icon}
      </span>
      {label}
    </button>
  );
}