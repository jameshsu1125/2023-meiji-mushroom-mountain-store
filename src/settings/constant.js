export const ACTION = {
	page: '頁面',
	loadingProcess: '讀取產生中',
	modal: 'modal',
};

export const PAGE = {
	landing: '/landing',
	game: '/game',
};

export const LOADING_PROCESS_TYPE = [
	'balls',
	'bars',
	'bubbles',
	'cubes',
	'cylon',
	'spin',
	'spinningBubbles',
	'spokes',
];

export const MODAL = {
	enabled: false,
	body: '',
	time: 0,
};

export const LOADING_PROCESS_STATE = {
	enabled: false,
	type: LOADING_PROCESS_TYPE[LOADING_PROCESS_TYPE.length - 1] || 'spokes',
	body: '',
};

export const TRANSITION = {
	unset: 0,
	fadeIn: 1,
	fadeOut: 2,
	fadeInEnd: 3,
	fadeOutEnd: 4,
	loop: 5,
};