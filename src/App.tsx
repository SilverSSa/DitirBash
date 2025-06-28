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
              onEnemyClick={gameState.attackEnemy}
            />

            {/* Game UI Overlay */}
            <GameUI
              player={gameState.player}
              gameState={gameState.gameState}
              onUseItem={gameState.useItem}
              onActivateDarkEyes={gameState.activateDarkEyes}
              onChangeBiome={gameState.changeBiome}
              onChangeRealm={gameState.changeRealm}
              onEquipWeapon={gameState.equipWeapon}
              onCraftItem={() => {}} // TODO: Implement crafting
              onPlaceLight={gameState.placeLight}
            />

            {/* Pause/Menu Button */}
            <button
              onClick={handleBackToMenu}
              className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-black/90 hover:bg-black text-white px-6 py-3 rounded-lg transition-colors z-50 border border-gray-600"
            >
              Back to Menu
            </button>
          </div>
        );

      case 'settings':
        return (
          <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-800 text-white flex items-center justify-center">
            <div className="bg-black/60 backdrop-blur-sm rounded-xl p-8 max-w-md w-full mx-4 border border-gray-600">
              <h2 className="text-3xl font-bold mb-6 text-center">Settings</h2>
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium mb-3">Master Volume</label>
                  <input type="range" min="0" max="100" defaultValue="50" className="w-full accent-purple-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-3">Graphics Quality</label>
                  <select className="w-full bg-gray-700 rounded-lg px-4 py-2 border border-gray-600">
                    <option>Low</option>
                    <option>Medium</option>
                    <option>High</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-3">UI Scale</label>
                  <select className="w-full bg-gray-700 rounded-lg px-4 py-2 border border-gray-600">
                    <option>Small</option>
                    <option>Medium</option>
                    <option>Large</option>
                  </select>
                </div>
                <button
                  onClick={handleBackToMenu}
                  className="w-full bg-purple-600 hover:bg-purple-700 py-3 rounded-lg transition-colors font-semibold"
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
            <div className="bg-black/60 backdrop-blur-sm rounded-xl p-8 max-w-4xl w-full mx-4 border border-gray-600">
              <h2 className="text-3xl font-bold mb-6 text-center">Shard Store</h2>
              <p className="text-center text-gray-300 mb-8">Cosmetic items only - No pay-to-win!</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                <div className="bg-gray-800/60 rounded-lg p-6 border border-gray-600">
                  <h3 className="font-semibold mb-2 text-lg">Soul Trail Skin</h3>
                  <p className="text-gray-400 text-sm mb-4">Cosmetic trail effect that follows your character</p>
                  <div className="flex justify-between items-center">
                    <span className="text-blue-400 font-bold">1000 Shards</span>
                    <button className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded text-sm transition-colors">
                      Buy
                    </button>
                  </div>
                </div>
                
                <div className="bg-gray-800/60 rounded-lg p-6 border border-gray-600">
                  <h3 className="font-semibold mb-2 text-lg">Extra Light Orb</h3>
                  <p className="text-gray-400 text-sm mb-4">Consumable light source for dark areas</p>
                  <div className="flex justify-between items-center">
                    <span className="text-blue-400 font-bold">300 Shards</span>
                    <button className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded text-sm transition-colors">
                      Buy
                    </button>
                  </div>
                </div>
                
                <div className="bg-gray-800/60 rounded-lg p-6 border border-gray-600">
                  <h3 className="font-semibold mb-2 text-lg">Map Modifier</h3>
                  <p className="text-gray-400 text-sm mb-4">Unlock special world generation options</p>
                  <div className="flex justify-between items-center">
                    <span className="text-blue-400 font-bold">800 Shards</span>
                    <button className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded text-sm transition-colors">
                      Buy
                    </button>
                  </div>
                </div>
                
                <div className="bg-gray-800/60 rounded-lg p-6 border border-gray-600">
                  <h3 className="font-semibold mb-2 text-lg">Replay Token</h3>
                  <p className="text-gray-400 text-sm mb-4">Retry a failed run with same world seed</p>
                  <div className="flex justify-between items-center">
                    <span className="text-blue-400 font-bold">1000 Shards</span>
                    <button className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded text-sm transition-colors">
                      Buy
                    </button>
                  </div>
                </div>
                
                <div className="bg-gray-800/60 rounded-lg p-6 border border-gray-600">
                  <h3 className="font-semibold mb-2 text-lg">Character Skin Pack</h3>
                  <p className="text-gray-400 text-sm mb-4">Alternative character appearances</p>
                  <div className="flex justify-between items-center">
                    <span className="text-blue-400 font-bold">1500 Shards</span>
                    <button className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded text-sm transition-colors">
                      Buy
                    </button>
                  </div>
                </div>
                
                <div className="bg-gray-800/60 rounded-lg p-6 border border-gray-600">
                  <h3 className="font-semibold mb-2 text-lg">Weapon Skins</h3>
                  <p className="text-gray-400 text-sm mb-4">Cosmetic weapon appearance changes</p>
                  <div className="flex justify-between items-center">
                    <span className="text-blue-400 font-bold">750 Shards</span>
                    <button className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded text-sm transition-colors">
                      Buy
                    </button>
                  </div>
                </div>
              </div>
              
              <button
                onClick={handleBackToMenu}
                className="w-full bg-purple-600 hover:bg-purple-700 py-3 rounded-lg transition-colors font-semibold"
              >
                Back to Menu
              </button>
            </div>
          </div>
        );

      case 'profile':
        return (
          <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-800 text-white flex items-center justify-center">
            <div className="bg-black/60 backdrop-blur-sm rounded-xl p-8 max-w-lg w-full mx-4 border border-gray-600">
              <h2 className="text-3xl font-bold mb-6 text-center">Player Profile</h2>
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium mb-2">Player Name</label>
                  <input
                    type="text"
                    defaultValue="Survivor"
                    className="w-full bg-gray-700 rounded-lg px-4 py-2 border border-gray-600"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Level</label>
                    <div className="bg-gray-700 rounded-lg px-4 py-2 border border-gray-600">
                      {gameState.player.level}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Shards</label>
                    <div className="bg-gray-700 rounded-lg px-4 py-2 border border-gray-600">
                      {gameState.player.shards}
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Total XP</label>
                    <div className="bg-gray-700 rounded-lg px-4 py-2 border border-gray-600">
                      {gameState.player.xp}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Dark Ether XP</label>
                    <div className="bg-gray-700 rounded-lg px-4 py-2 border border-gray-600">
                      {gameState.player.darkEtherXP}
                    </div>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Bosses Defeated</label>
                  <div className="bg-gray-700 rounded-lg px-4 py-2 border border-gray-600">
                    {gameState.gameState.bossesDefeated.length} / 6
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Total Playtime</label>
                  <div className="bg-gray-700 rounded-lg px-4 py-2 border border-gray-600">
                    {Math.floor(gameState.gameState.gameTime / 60000)}m {Math.floor((gameState.gameState.gameTime % 60000) / 1000)}s
                  </div>
                </div>
                
                <button
                  onClick={handleBackToMenu}
                  className="w-full bg-purple-600 hover:bg-purple-700 py-3 rounded-lg transition-colors font-semibold"
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