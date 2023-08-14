import { createContext } from 'react';

export const GameSteps = { unset: 0 };
export const GamePage = { home: '/home', form: '/form', submitted: '/submitted' };
export const GameState = { steps: GameSteps.unset, page: GamePage.home };
export const GameContext = createContext(GameState);
