import React, { useState, useEffect } from 'react';
import MainMenu from './components/MainMenu';
import GameInterface from './components/GameInterface';
import ShardStore from './components/ShardStore';
import PlayerProfile from './components/PlayerProfile';
import Settings from './components/Settings';
import { GameProvider } from './context/GameContext';

export type Screen = 'menu' | 'game' | 'store' | 'profile' | 'settings';

function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('menu');

  const renderScreen = () => {
    switch (currentScreen) {
      case 'menu':
        return <MainMenu onNavigate={setCurrentScreen} />;
      case 'game':
        return <GameInterface onNavigate={setCurrentScreen} />;
      case 'store':
        return <ShardStore onNavigate={setCurrentScreen} />;
      case 'profile':
        return <PlayerProfile onNavigate={setCurrentScreen} />;
      case 'settings':
        return <Settings onNavigate={setCurrentScreen} />;
      default:
        return <MainMenu onNavigate={setCurrentScreen} />;
    }
  };

  return (
    <GameProvider>
      <div className="min-h-screen bg-slate-900 text-white overflow-hidden">
        {renderScreen()}
      </div>
    </GameProvider>
  );
}

export default App;