import { createContext } from 'react';

export const LandingSteps = { unset: 0 };
export const LandingState = { steps: LandingSteps.unset };
export const LandingContext = createContext(LandingState);

export const LandingSections = [
	{ src: '/home', name: '活動首頁' },
	{ src: '/incentive', name: '贈品介紹' },
	{ src: '/product', name: '產品介紹' },
	{ src: '/retail', name: '購買通路' },
	{ src: '/description', name: '活動辦法' },
];

export const IncentiveList = {
	bill: [
		{ name: ['LG StanbyME 閨蜜機'], amount: 1, price: 24900 },
		{ name: ['老爺酒店 ', '平日聯合住宿券*3'], amount: 1, price: 9600 },
		{ name: ['iPad Air 5', '64G (Wifi)'], amount: 1, price: 19900 },
	],
	both: [
		{ name: ['FUJIFILM instax', 'mini Evo相機'], amount: 3, price: 8990 },
		{ name: ['Vitantonio ', '多功能計時鬆餅機'], amount: 3, price: 6400 },
		{ name: ['象印 ', '分離式鐵板燒烤組'], amount: 3, price: 6290 },
		{ name: ['香菇先生精美周邊 ', '眼罩＆隨身鏡'], amount: 50, price: null },
		{ name: ['LINE POINTS', '100點'], amount: 40, price: null },
	],
};

export const ProductList = [
	{
		flavor: '巧克力',
		color: false,
		description: [
			'涮嘴口感熱銷多年！',
			'醇濃可可與香脆餅乾',
			'甜而不膩的滋味加上可愛菇菇造型',
			'輕易擄獲大朋友小朋友的心！',
		],
	},
	{
		flavor: '草莓',
		color: true,
		description: [
			'難以抗拒的甜蜜滋味！',
			'粉嫩草莓搭配香脆餅乾',
			'酸甜可口、香氣濃郁',
			'少女心的你必嚐！',
		],
	},
];
