import React, { createContext, useContext, useReducer, useEffect } from 'react';

interface PlayerStats {
  health: number;
  maxHealth: number;
  sanity: number;
  maxSanity: number;
  souls: number;
  shards: number;
  darkEtherXP: number;
  level: number;
}

interface GameState {
  playerStats: PlayerStats;
  inventory: any[];
  equippedWeapon: string | null;
  currentBiome: string;
  gameMode: 'roguelike' | 'survival' | null;
  isInDarkRealm: boolean;
  lightStatus: 'bright' | 'dim' | 'dark';
}

interface GameContextType {
  state: GameState;
  dispatch: React.Dispatch<any>;
  saveGame: () => void;
  loadGame: () => void;
}

const initialState: GameState = {
  playerStats: {
    health: 100,
    maxHealth: 100,
    sanity: 100,
    maxSanity: 100,
    souls: 0,
    shards: 1250,
    darkEtherXP: 850,
    level: 3
  },
  inventory: [],
  equippedWeapon: null,
  currentBiome: 'Ash Dunes',
  gameMode: null,
  isInDarkRealm: false,
  lightStatus: 'bright'
};

const GameContext = createContext<GameContextType | undefined>(undefined);

function gameReducer(state: GameState, action: any): GameState {
  switch (action.type) {
    case 'SET_GAME_MODE':
      return { ...state, gameMode: action.payload };
    case 'UPDATE_HEALTH':
      return {
        ...state,
        playerStats: {
          ...state.playerStats,
          health: Math.max(0, Math.min(state.playerStats.maxHealth, action.payload))
        }
      };
    case 'UPDATE_SANITY':
      return {
        ...state,
        playerStats: {
          ...state.playerStats,
          sanity: Math.max(0, Math.min(state.playerStats.maxSanity, action.payload))
        }
      };
    case 'ADD_SOULS':
      return {
        ...state,
        playerStats: {
          ...state.playerStats,
          souls: state.playerStats.souls + action.payload
        }
      };
    case 'SPEND_SHARDS':
      return {
        ...state,
        playerStats: {
          ...state.playerStats,
          shards: Math.max(0, state.playerStats.shards - action.payload)
        }
      };
    case 'EQUIP_WEAPON':
      return { ...state, equippedWeapon: action.payload };
    case 'TOGGLE_DARK_REALM':
      return { ...state, isInDarkRealm: !state.isInDarkRealm };
    case 'SET_LIGHT_STATUS':
      return { ...state, lightStatus: action.payload };
    case 'LOAD_STATE':
      return { ...state, ...action.payload };
    default:
      return state;
  }
}

export function GameProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(gameReducer, initialState);

  const saveGame = () => {
    localStorage.setItem('ditirbash-save', JSON.stringify(state));
  };

  const loadGame = () => {
    const saved = localStorage.getItem('ditirbash-save');
    if (saved) {
      dispatch({ type: 'LOAD_STATE', payload: JSON.parse(saved) });
    }
  };

  useEffect(() => {
    loadGame();
  }, []);

  return (
    <GameContext.Provider value={{ state, dispatch, saveGame, loadGame }}>
      {children}
    </GameContext.Provider>
  );
}

export function useGame() {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
}