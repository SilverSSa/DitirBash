import React, { useState } from 'react';
import { MainMenu } from './components/MainMenu';
import { GameWorld } from './components/GameWorld';
import { GameUI } from './components/GameUI';
import { useGameState } from './hooks/useGameState';

type GameScreen = 'menu' | 'game' | 'settings' | 'store' | 'profile';

function App() {
  const [currentScreen, setCurrentScreen] = useState<GameScreen>('menu');
  const gameState = useGameState();

  const handleStartGame = (mode: 'roguelike' | 'survival') => {
    setCurrentScreen('game');
  };

  const handleBackToMenu = () => {
    setCurrentScreen('menu');
  };

  const renderScreen = () => {
    switch (currentScreen) {
      case 'menu':
        return (
          <MainMenu
            onStartGame={handleStartGame}
            onShowSettings={() => setCurrentScreen('settings')}
            onShowStore={() => setCurrentScreen('store')}
            onShowProfile={() => setCurrentScreen('profile')}
          />
        );

      case 'game':
        return (
          <div className="relative w-screen h-screen bg-black overflow-hidden">
            {/* Game World */}
            <GameWorld
              player={gameState.player}
              enemies={gameState.enemies}
              resources={gameState.resources}
              gameState={gameState.gameState}
              worldSize={gameState.worldSize}
              onResourceClick={gameState.collectResource}
            />

            {/* Game UI Overlay */}
            <GameUI
              player={gameState.player}
              gameState={gameState.gameState}
              onUseItem={gameState.useItem}
              onActivateDarkEyes={gameState.activateDarkEyes}
              onChangeBiome={gameState.changeBiome}
            />

            {/* Pause/Menu Button */}
            <button
              onClick={handleBackToMenu}
              className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-black/80 hover:bg-black/90 text-white px-4 py-2 rounded-lg transition-colors z-50"
            >
              Back to Menu
            </button>
          </div>
        );

      case 'settings':
        return (
          <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-800 text-white flex items-center justify-center">
            <div className="bg-black/50 backdrop-blur-sm rounded-xl p-8 max-w-md w-full mx-4">
              <h2 className="text-2xl font-bold mb-6">Settings</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Master Volume</label>
                  <input type="range" min="0" max="100" className="w-full" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Graphics Quality</label>
                  <select className="w-full bg-gray-700 rounded px-3 py-2">
                    <option>Low</option>
                    <option>Medium</option>
                    <option>High</option>
                  </select>
                </div>
                <button
                  onClick={handleBackToMenu}
                  className="w-full bg-purple-600 hover:bg-purple-700 py-2 rounded-lg transition-colors"
                >
                  Back to Menu
                </button>
              </div>
            </div>
          </div>
        );

      case 'store':
        return (
          <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-800 text-white flex items-center justify-center">
            <div className="bg-black/50 backdrop-blur-sm rounded-xl p-8 max-w-2xl w-full mx-4">
              <h2 className="text-2xl font-bold mb-6">Shard Store</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="bg-gray-800/50 rounded-lg p-4">
                  <h3 className="font-semibold mb-2">Soul Trail Skin</h3>
                  <p className="text-gray-400 text-sm mb-3">Cosmetic trail effect</p>
                  <div className="flex justify-between items-center">
                    <span className="text-blue-400">1000 Shards</span>
                    <button className="bg-blue-600 hover:bg-blue-700 px-4 py-1 rounded text-sm transition-colors">
                      Buy
                    </button>
                  </div>
                </div>
                <div className="bg-gray-800/50 rounded-lg p-4">
                  <h3 className="font-semibold mb-2">Extra Light Orb</h3>
                  <p className="text-gray-400 text-sm mb-3">Consumable light source</p>
                  <div className="flex justify-between items-center">
                    <span className="text-blue-400">300 Shards</span>
                    <button className="bg-blue-600 hover:bg-blue-700 px-4 py-1 rounded text-sm transition-colors">
                      Buy
                    </button>
                  </div>
                </div>
              </div>
              <button
                onClick={handleBackToMenu}
                className="w-full bg-purple-600 hover:bg-purple-700 py-2 rounded-lg transition-colors"
              >
                Back to Menu
              </button>
            </div>
          </div>
        );

      case 'profile':
        return (
          <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-800 text-white flex items-center justify-center">
            <div className="bg-black/50 backdrop-blur-sm rounded-xl p-8 max-w-md w-full mx-4">
              <h2 className="text-2xl font-bold mb-6">Player Profile</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Player Name</label>
                  <input
                    type="text"
                    defaultValue="Survivor"
                    className="w-full bg-gray-700 rounded px-3 py-2"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Level</label>
                    <div className="bg-gray-700 rounded px-3 py-2">1</div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Shards</label>
                    <div className="bg-gray-700 rounded px-3 py-2">0</div>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Total Playtime</label>
                  <div className="bg-gray-700 rounded px-3 py-2">0h 0m</div>
                </div>
                <button
                  onClick={handleBackToMenu}
                  className="w-full bg-purple-600 hover:bg-purple-700 py-2 rounded-lg transition-colors"
                >
                  Back to Menu
                </button>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return <div className="w-full h-full">{renderScreen()}</div>;
}

export default App;