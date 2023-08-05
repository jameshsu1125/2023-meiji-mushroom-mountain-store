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
		{
			page: PAGE.landing,
			name: '活動首頁',
		},
		{
			page: PAGE.game,
			name: '菇菇山營業中',
		},
		{
			page: '#',
			name: '登錄發票',
		},
		{
			page: '#',
			name: '贈品介紹',
		},
		{
			page: '#',
			name: '產品介紹',
		},
		{
			page: '#',
			name: '活動辦法',
		},
	],
};
