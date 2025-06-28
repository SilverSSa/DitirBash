import React, { useState, useEffect } from 'react';
import { ArrowLeft, Eye, Sword, Shield, Zap, Home } from 'lucide-react';
import type { Screen } from '../App';
import { useGame } from '../context/GameContext';
import GameModeSelector from './GameModeSelector';
import HUD from './HUD';
import Inventory from './Inventory';
import WeaponRadial from './WeaponRadial';
import GameWorld from './GameWorld';

interface GameInterfaceProps {
  onNavigate: (screen: Screen) => void;
}

export default function GameInterface({ onNavigate }: GameInterfaceProps) {
  const { state, dispatch } = useGame();
  const [showInventory, setShowInventory] = useState(false);
  const [showWeaponRadial, setShowWeaponRadial] = useState(false);
  const [showGameModeSelector, setShowGameModeSelector] = useState(!state.gameMode);

  const biomes = [
    { name: 'Ash Dunes', color: 'from-orange-900 to-red-900', threats: ['Heat', 'Sandstorms'] },
    { name: 'Verdant Hollow', color: 'from-green-900 to-emerald-900', threats: ['Soul Decay'] },
    { name: 'Crystal Rift', color: 'from-purple-900 to-indigo-900', threats: ['DarkEther Mutation'] },
    { name: 'Frozen Grief', color: 'from-blue-900 to-cyan-900', threats: ['Cold Fog', 'Sanity Loss'] },
    { name: 'Plaguelands', color: 'from-yellow-900 to-lime-900', threats: ['Toxic Healing Block'] },
  ];

  const currentBiomeData = biomes.find(b => b.name === state.currentBiome) || biomes[0];

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === 'i' || e.key === 'I') {
        setShowInventory(!showInventory);
      }
      if (e.key === 'e' || e.key === 'E') {
        setShowWeaponRadial(!showWeaponRadial);
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [showInventory, showWeaponRadial]);

  const handleGameModeSelect = (mode: 'roguelike' | 'survival') => {
    dispatch({ type: 'SET_GAME_MODE', payload: mode });
    setShowGameModeSelector(false);
  };

  if (showGameModeSelector) {
    return <GameModeSelector onSelect={handleGameModeSelect} />;
  }

  return (
    <div className={`min-h-screen bg-gradient-to-br ${currentBiomeData.color} relative overflow-hidden`}>
      {/* Background Effects */}
      <div className="absolute inset-0 opacity-20">
        {[...Array(25)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 2}s`,
              animationDuration: `${1 + Math.random()}s`
            }}
          />
        ))}
      </div>

      {/* Game World Container - Significantly Larger */}
      <div className="absolute inset-0 flex items-center justify-center">
        <GameWorld worldSize={{ width: 1800, height: 1200 }} />
      </div>

      {/* HUD */}
      <HUD />

      {/* Navigation */}
      <button
        onClick={() => onNavigate('menu')}
        className="absolute top-4 left-4 flex items-center gap-2 px-4 py-2 bg-slate-900/80 hover:bg-slate-800/80 rounded-lg transition-colors text-white z-50"
      >
        <ArrowLeft className="w-5 h-5" />
        Main Menu
      </button>

      {/* DarkEyes Toggle */}
      <button
        onClick={() => dispatch({ type: 'TOGGLE_DARK_REALM' })}
        className={`absolute top-4 right-4 flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-300 z-50 ${
          state.isInDarkRealm 
            ? 'bg-purple-700/80 text-purple-100 shadow-lg shadow-purple-500/25' 
            : 'bg-slate-900/80 hover:bg-slate-800/80 text-white'
        }`}
      >
        <Eye className="w-5 h-5" />
        {state.isInDarkRealm ? 'DarkEyes Active' : 'Activate DarkEyes'}
      </button>

      {/* Quick Action Buttons */}
      <div className="absolute bottom-4 right-4 flex gap-2 z-50">
        <button
          onClick={() => setShowInventory(true)}
          className="p-3 bg-slate-900/80 hover:bg-slate-800/80 rounded-lg transition-colors text-white"
          title="Inventory (I)"
        >
          <Home className="w-5 h-5" />
        </button>
        <button
          onClick={() => setShowWeaponRadial(true)}
          className="p-3 bg-purple-800/80 hover:bg-purple-700/80 rounded-lg transition-colors text-white"
          title="Weapon Wheel (E)"
        >
          <Sword className="w-5 h-5" />
        </button>
      </div>

      {/* Overlays */}
      {showInventory && (
        <Inventory onClose={() => setShowInventory(false)} />
      )}

      {showWeaponRadial && (
        <WeaponRadial onClose={() => setShowWeaponRadial(false)} />
      )}

      {/* Dark Realm Overlay */}
      {state.isInDarkRealm && (
        <div className="absolute inset-0 bg-purple-900/30 pointer-events-none z-40">
          <div className="absolute inset-0 animate-pulse bg-gradient-to-r from-transparent via-purple-500/10 to-transparent" />
        </div>
      )}
    </div>
  );
}