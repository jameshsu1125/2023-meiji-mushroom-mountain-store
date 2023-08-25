import { createContext } from 'react';

export const GameSteps = { unset: 0, loaded: 1, modelLoaded: 2, didFadeIn: 3 };
export const GamePage = {
	home: '/home',
	intro: '/intro',
	game: '/game',
	form: '/form',
	submitted: '/submitted',
};
export const GameState = { steps: GameSteps.unset, page: GamePage.home };
export const GameContext = createContext(GameState);
