import React, { useState } from 'react';
import { X } from 'lucide-react';
import { useGame } from '../context/GameContext';

interface WeaponRadialProps {
  onClose: () => void;
}

export default function WeaponRadial({ onClose }: WeaponRadialProps) {
  const { state, dispatch } = useGame();
  const [selectedWeapon, setSelectedWeapon] = useState<string | null>(null);

  const weapons = [
    { name: 'Soul Sword', icon: '⚔️', element: 'Dark', description: 'Channels soul energy into blade form' },
    { name: 'Dark Claw', icon: '🗡️', element: 'Shadow', description: 'Extends dark tendrils for close combat' },
    { name: 'Spirit Bow', icon: '🏹', element: 'Air', description: 'Fires ethereal arrows that pierce multiple targets' },
    { name: 'Blizzard Staff', icon: '🔮', element: 'Ice', description: 'Summons freezing winds and ice shards' },
    { name: 'Flame Gauntlet', icon: '🔥', element: 'Fire', description: 'Launches controlled bursts of soul fire' },
    { name: 'Stone Hammer', icon: '🔨', element: 'Earth', description: 'Massive crushing force with earth tremors' }
  ];

  const handleWeaponSelect = (weaponName: string) => {
    dispatch({ type: 'EQUIP_WEAPON', payload: weaponName });
    onClose();
  };

  const getElementColor = (element: string) => {
    switch (element) {
      case 'Dark': return 'from-purple-600 to-purple-800';
      case 'Shadow': return 'from-gray-600 to-gray-800';
      case 'Air': return 'from-cyan-400 to-cyan-600';
      case 'Ice': return 'from-blue-400 to-blue-600';
      case 'Fire': return 'from-red-500 to-red-700';
      case 'Earth': return 'from-amber-600 to-amber-800';
      default: return 'from-slate-600 to-slate-800';
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-end justify-center z-50 pb-32">
      <div className="relative">
        {/* Center Hub */}
        <div className="w-24 h-24 bg-slate-900 border-4 border-purple-500 rounded-full flex items-center justify-center">
          <span className="text-2xl">⚡</span>
        </div>

        {/* Weapon Circles */}
        {weapons.map((weapon, index) => {
          const angle = (index * 60) - 90; // 6 weapons, 60 degrees apart, starting at top
          const radian = (angle * Math.PI) / 180;
          const radius = 120;
          const x = Math.cos(radian) * radius;
          const y = Math.sin(radian) * radius;

          return (
            <button
              key={weapon.name}
              onClick={() => handleWeaponSelect(weapon.name)}
              onMouseEnter={() => setSelectedWeapon(weapon.name)}
              onMouseLeave={() => setSelectedWeapon(null)}
              className={`absolute w-20 h-20 rounded-full border-3 transition-all duration-300 hover:scale-110 flex items-center justify-center text-2xl
                ${state.equippedWeapon === weapon.name 
                  ? `bg-gradient-to-br ${getElementColor(weapon.element)} border-white shadow-lg` 
                  : 'bg-slate-800 border-slate-600 hover:border-purple-400'
                }`}
              style={{
                left: `calc(50% + ${x}px - 40px)`,
                top: `calc(50% + ${y}px - 40px)`,
              }}
            >
              {weapon.icon}
            </button>
          );
        })}

        {/* Weapon Info */}
        {selectedWeapon && (
          <div className="absolute -top-24 left-1/2 transform -translate-x-1/2 bg-slate-900 border border-slate-700 rounded-lg p-4 min-w-72">
            {(() => {
              const weapon = weapons.find(w => w.name === selectedWeapon);
              return weapon ? (
                <div className="text-center">
                  <h3 className="text-xl font-bold text-white mb-2">{weapon.name}</h3>
                  <div className={`inline-block px-3 py-1 rounded-full text-sm bg-gradient-to-r ${getElementColor(weapon.element)} text-white mb-2`}>
                    {weapon.element} Element
                  </div>
                  <p className="text-slate-300 text-sm">{weapon.description}</p>
                </div>
              ) : null;
            })()}
          </div>
        )}

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute -top-12 right-0 p-2 bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors"
        >
          <X className="w-6 h-6 text-slate-400" />
        </button>

        {/* Instructions */}
        <div className="absolute -bottom-16 left-1/2 transform -translate-x-1/2 text-center text-slate-400 text-sm">
          <p>Click to equip weapon • Press <span className="text-white font-mono">E</span> to close</p>
          <p className="text-xs mt-1">Press <span className="text-white font-mono">R</span> to revert (starts cooldown)</p>
        </div>
      </div>
    </div>
  );
}