import { createContext } from 'react';

export const GameSteps = { unset: 0 };
export const GameState = { steps: GameSteps.unset };
export const GameContext = createContext(GameState);
