import { ValiDateInvoice, ValidateEmail, ValidatePhone } from 'lesca-validate';
import { isNumber } from 'lesca-validate/lib/misc';
import { EmptyString } from './misc';

export const ACTION = {
	page: '頁面',
	loadingProcess: '讀取產生中',
	modal: 'modal',
};

export const PAGE = {
	landing: '/landing',
	game: '/game',
	invoice: '/invoice',
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

export const CONTROL_MODE = {
	unset: 0,
	keyboard: 1,
	joystick: 2,
};

export const USER_GENDER = {
	先生: 100,
	小姐: 100,
};

export const USER_AGE = {
	'18歲以下': 100,
	'18-24歲': 200,
	'25-29歲': 300,
	'30-39歲': 400,
	'40-44歲': 500,
	'45歲以上': 600,
};

export const USER_INFO_NAME = {
	姓名: 'Name',
	稱呼: 'Gender',
	年齡區間: 'AgeType',
	手機: 'Phone',
	信箱: 'Email',
	同意辦法: 'agree',
};

export const INVOICE_INFO_NAME = {
	...USER_INFO_NAME,
	發票號碼: 'InvoiceNumber',
	隨機碼: 'InvoiceRandomCode',
};

export const VALIDATE_INFO = {
	[INVOICE_INFO_NAME.姓名]: EmptyString,
	[INVOICE_INFO_NAME.稱呼]: EmptyString,
	[INVOICE_INFO_NAME.年齡區間]: (value) => {
		if (value === '請選擇') return false;
		return true;
	},
	[INVOICE_INFO_NAME.手機]: ValidatePhone,
	[INVOICE_INFO_NAME.信箱]: ValidateEmail,
	[INVOICE_INFO_NAME.發票號碼]: ValiDateInvoice,
	[INVOICE_INFO_NAME.隨機碼]: (value) => {
		const currentValue = String(value);
		const { length } = currentValue;
		if (length < 4) return false;
		return isNumber(currentValue);
	},
	agree: (value) => value === '1',
};
