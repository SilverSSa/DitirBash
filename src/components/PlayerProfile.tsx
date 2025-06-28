import React from 'react';
import { ArrowLeft, Trophy, Target, Clock, Star } from 'lucide-react';
import type { Screen } from '../App';
import { useGame } from '../context/GameContext';

interface PlayerProfileProps {
  onNavigate: (screen: Screen) => void;
}

export default function PlayerProfile({ onNavigate }: PlayerProfileProps) {
  const { state } = useGame();

  const achievements = [
    { id: 1, name: 'First Blood', description: 'Defeat your first enemy', icon: '⚔️', unlocked: true },
    { id: 2, name: 'Soul Gatherer', description: 'Collect 100 soul essence', icon: '💫', unlocked: true },
    { id: 3, name: 'Dark Walker', description: 'Use DarkEyes 10 times', icon: '👁️', unlocked: true },
    { id: 4, name: 'Sanity Master', description: 'Survive with 0 sanity for 5 minutes', icon: '🧠', unlocked: false },
    { id: 5, name: 'Boss Slayer', description: 'Defeat 5 different bosses', icon: '🏆', unlocked: false },
    { id: 6, name: 'Realm Walker', description: 'Visit all biomes in a single run', icon: '🌍', unlocked: false },
  ];

  const stats = [
    { label: 'Total Playtime', value: '47h 23m', icon: <Clock className="w-5 h-5" /> },
    { label: 'Runs Completed', value: '23', icon: <Target className="w-5 h-5" /> },
    { label: 'Bosses Defeated', value: '12', icon: <Trophy className="w-5 h-5" /> },
    { label: 'Times Died', value: '89', icon: '💀' },
    { label: 'Shards Earned', value: '3,450', icon: '💎' },
    { label: 'Highest Sanity Loss', value: '100%', icon: '🧠' },
  ];

  const darkTreeProgress = [
    { name: 'Shadow Dash', level: 3, maxLevel: 5, description: 'Quick teleportation ability' },
    { name: 'Sanity Resist', level: 2, maxLevel: 5, description: 'Reduced sanity loss rate' },
    { name: 'Aura Detection', level: 1, maxLevel: 3, description: 'Sense nearby threats' },
    { name: 'Soul Efficiency', level: 0, maxLevel: 5, description: 'Increased soul gain' },
  ];

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

        <h1 className="text-4xl font-bold text-white">Player Profile</h1>
        <div className="w-24" /> {/* Spacer */}
      </div>

      <div className="max-w-6xl mx-auto grid lg:grid-cols-3 gap-8">
        {/* Player Info */}
        <div className="lg:col-span-1 space-y-6">
          {/* Basic Stats */}
          <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
            <div className="text-center mb-6">
              <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">
                👤
              </div>
              <h2 className="text-2xl font-bold text-white mb-1">Survivor</h2>
              <p className="text-purple-300">Level {state.playerStats.level} Dark Walker</p>
            </div>

            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm text-slate-300 mb-1">
                  <span>DarkEther XP</span>
                  <span>{state.playerStats.darkEtherXP}/1000</span>
                </div>
                <div className="w-full bg-slate-700 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full"
                    style={{ width: `${(state.playerStats.darkEtherXP % 1000) / 10}%` }}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-700">
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-400">{state.playerStats.shards}</div>
                  <div className="text-sm text-slate-300">Shards</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-400">{state.playerStats.souls}</div>
                  <div className="text-sm text-slate-300">Souls</div>
                </div>
              </div>
            </div>
          </div>

          {/* Dark Tree Progress */}
          <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
            <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <Star className="w-5 h-5 text-purple-400" />
              Dark Tree Progress
            </h3>

            <div className="space-y-4">
              {darkTreeProgress.map((skill) => (
                <div key={skill.name} className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-white font-medium">{skill.name}</span>
                    <span className="text-slate-300">{skill.level}/{skill.maxLevel}</span>
                  </div>
                  <div className="w-full bg-slate-700 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full"
                      style={{ width: `${(skill.level / skill.maxLevel) * 100}%` }}
                    />
                  </div>
                  <p className="text-xs text-slate-400">{skill.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Stats and Achievements */}
        <div className="lg:col-span-2 space-y-6">
          {/* Statistics */}
          <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
            <h3 className="text-xl font-bold text-white mb-6">Statistics</h3>
            
            <div className="grid md:grid-cols-2 gap-4">
              {stats.map((stat) => (
                <div key={stat.label} className="flex items-center gap-3 p-4 bg-slate-700/50 rounded-lg">
                  <div className="text-purple-400">
                    {typeof stat.icon === 'string' ? (
                      <span className="text-xl">{stat.icon}</span>
                    ) : (
                      stat.icon
                    )}
                  </div>
                  <div>
                    <div className="text-lg font-bold text-white">{stat.value}</div>
                    <div className="text-sm text-slate-300">{stat.label}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Achievements */}
          <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
            <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
              <Trophy className="w-5 h-5 text-yellow-400" />
              Achievements
            </h3>

            <div className="grid md:grid-cols-2 gap-4">
              {achievements.map((achievement) => (
                <div 
                  key={achievement.id} 
                  className={`p-4 rounded-lg border-2 transition-all duration-300 ${
                    achievement.unlocked 
                      ? 'bg-green-900/20 border-green-500/50' 
                      : 'bg-slate-700/30 border-slate-600'
                  }`}
                >
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-2xl">{achievement.icon}</span>
                    <div>
                      <h4 className={`font-bold ${achievement.unlocked ? 'text-green-400' : 'text-slate-400'}`}>
                        {achievement.name}
                      </h4>
                      {achievement.unlocked && (
                        <span className="text-xs text-green-300">✓ Unlocked</span>
                      )}
                    </div>
                  </div>
                  <p className="text-sm text-slate-300">{achievement.description}</p>
                </div>
              ))}
            </div>

            <div className="mt-6 text-center">
              <p className="text-slate-400 text-sm">
                {achievements.filter(a => a.unlocked).length} of {achievements.length} achievements unlocked
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}