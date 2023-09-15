import { createContext } from 'react';
import { ACTION, LOADING_PROCESS_STATE, MODAL, PAGE } from './constant';

export const Context = createContext();

export const initialState = {
	[ACTION.page]: PAGE.landing,
	[ACTION.loadingProcess]: LOADING_PROCESS_STATE,
	[ACTION.modal]: MODAL,
};

export const reducer = (state, action) => {
	if (action.state instanceof Object) {
		let stateStorage = {};
		Object.entries(action.state)
			.map((actionState) => {
				const value = Object.values(ACTION).filter((actionValue) => actionValue === actionState[0]);
				if (value.length > 0) return actionState;
				if (action.type) return [action.type, Object.fromEntries([actionState])];
				return undefined;
			})
			.filter((actionState) => actionState !== undefined)
			.forEach((actionState) => {
				const [key, value] = actionState;
				const prevValue = stateStorage[key];
				if (prevValue) stateStorage = { [key]: { ...prevValue, ...value } };
				else stateStorage = { [key]: { ...state[key], ...value } };
			});
		return { ...state, ...stateStorage };
	}
	if (action.type) return { ...state, [action.type]: action.state };
	return state;
};

export const MenuState = {
	data: [
		{ page: './#', name: '活動首頁' },
		{ page: './game.html', name: '菇菇山營業中' },
		{ page: './invoice.html', name: '登錄發票' },
		{ page: './#incentive', name: '贈品介紹' },
		{ page: './#product', name: '產品介紹' },
		{ page: './#description', name: '活動辦法' },
	],
};

export const RespondBreakPoint = {
	md: 1024,
};

export const DEFAULT_RESPOND = {
	Result: true,
	Data: { UserId: '' },
	MessageList: [],
};

export const GtagState = {
	landing: {
		pv: '首頁',
		event: {
			玩遊戲: '玩遊戲',
			登錄發票: '登錄發票',
		},
	},
	menu: {
		page: '選單',
		event: {
			[MenuState.data[0].name]: [MenuState.data[0].name],
			[MenuState.data[1].name]: [MenuState.data[1].name],
			[MenuState.data[2].name]: [MenuState.data[2].name],
			[MenuState.data[3].name]: [MenuState.data[3].name],
			[MenuState.data[4].name]: [MenuState.data[4].name],
			[MenuState.data[5].name]: [MenuState.data[5].name],
			logo: 'logo',
		},
	},
	game: {
		遊戲頁: {
			page: '遊戲頁',
			event: {
				菇菇怎麼採: '菇菇怎麼採',
				開始採菇: '開始採菇',
			},
		},
		遊戲解說頁: {
			page: '遊戲解說頁',
			event: {
				下一步: '下一步',
				開始採菇: '開始採菇',
			},
		},
		遊戲結束頁: {
			page: '遊戲結束頁',
		},
		遊戲結果頁: {
			page: '遊戲結果頁',
			event: {
				填單抽回饋禮: '填單抽回饋禮',
				再玩一次: '再玩一次',
			},
		},
		填單抽回饋禮頁: {
			page: '填單抽回饋禮頁',
			event: {
				確認送出: '確認送出',
			},
		},
		您的資料已送出頁: {
			page: '您的資料已送出頁',
			event: {
				回到主頁: '回到主頁',
				繼續採菇: '繼續採菇',
			},
		},
	},
	invoice: {
		登錄發票頁: {
			page: '登錄發票頁',
			event: {
				確認送出: '確認送出',
			},
		},
		登錄發票已送出頁: {
			page: '登錄發票已送出頁',
			event: {
				回到主頁: '回到主頁',
				繼續登錄發票: '繼續登錄發票',
			},
		},
	},
};
