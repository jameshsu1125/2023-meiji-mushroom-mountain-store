import { createContext } from 'react';
import Sounds from './sound';

export const GameSteps = { unset: 0, loaded: 1, modelLoaded: 2, didFadeIn: 3 };
export const GamePage = {
	home: '/home',
	intro: '/intro',
	game: '/game',
	result: '/result',
	form: '/form',
	submitted: '/submitted',
};

export const SoundsTrackName = {
	bgm: 0,
	bamboo: 1,
	mushroom: 2,
	move: 3,
	falling: 4,
};

export const GameState = {
	steps: GameSteps.unset,
	page: GamePage.home,
	sounds: new Sounds(SoundsTrackName),
	soundsLoaded: false,
	score: 0,
	countdown: false,
	over: false,
	replay: false,
};

export const GameContext = createContext(GameState);
