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

export const AwardWinners = [
	['LG StanbyME 閨蜜機', '詹O君', '0919-XXX-002'],
	['老爺酒店平日聯合住宿券*3', '吳O慧', '0955-XXX-043'],
	['iPad Air 5 64G (Wifi)', '呂O銘', '0927-XXX-777'],
	['FUJIFILM instax mini Evo相機', '曾O愷', '0939-XXX-961'],
	['FUJIFILM instax mini Evo相機', '潘O典', '0930-XXX-050'],
	['FUJIFILM instax mini Evo相機', '洪O喬', '0910-XXX-211'],
	['Vitantonio多功能計時鬆餅機', '鄭O云', '0989-XXX-718'],
	['Vitantonio多功能計時鬆餅機', '姚O仁', '0922-XXX-936'],
	['Vitantonio多功能計時鬆餅機', '賴O君', '0921-XXX-7551'],
	['象印分離式鐵板燒烤組', '蔡O妮', '0918-XXX-048'],
	['象印分離式鐵板燒烤組', '羅O玲', '0925-XXX-657'],
	['象印分離式鐵板燒烤組', '顏O真', '0929-XXX-220'],
	['香菇先生精美周邊眼罩&隨身鏡', '袁O凱', '0936-XXX-611'],
	['香菇先生精美周邊眼罩&隨身鏡', '周O凱', '0963-XXX-171'],
	['香菇先生精美周邊眼罩&隨身鏡', '許O安', '0933-XXX-760'],
	['香菇先生精美周邊眼罩&隨身鏡', '朱O萱', '0928-XXX-725'],
	['香菇先生精美周邊眼罩&隨身鏡', '周O月', '0963-XXX-191'],
	['香菇先生精美周邊眼罩&隨身鏡', '李O鳯', '0936-XXX-970'],
	['香菇先生精美周邊眼罩&隨身鏡', '張O穎', '0956-XXX-799'],
	['香菇先生精美周邊眼罩&隨身鏡', '宣O 江', '0901-XXX-456'],
	['香菇先生精美周邊眼罩&隨身鏡', '賴O岑', '0958-XXX-580'],
	['香菇先生精美周邊眼罩&隨身鏡', '鄭O樺', '0923-XXX-015'],
	['香菇先生精美周邊眼罩&隨身鏡', '鍾O珏', '0916-XXX-272'],
	['香菇先生精美周邊眼罩&隨身鏡', '池O萱', '0909-XXX-106'],
	['香菇先生精美周邊眼罩&隨身鏡', '蔡O柔', '0915-XXX-562'],
	['香菇先生精美周邊眼罩&隨身鏡', '徐O億', '0972-XXX-269'],
	['香菇先生精美周邊眼罩&隨身鏡', '陳O盈', '0953-XXX-667'],
	['香菇先生精美周邊眼罩&隨身鏡', '張O凱', '0908-XXX-303'],
	['香菇先生精美周邊眼罩&隨身鏡', '黃O川', '0920-XXX-312'],
	['香菇先生精美周邊眼罩&隨身鏡', '林O生', '0918-XXX-210'],
	['香菇先生精美周邊眼罩&隨身鏡', '蔡O妏', '0929-XXX-317'],
	['香菇先生精美周邊眼罩&隨身鏡', '吳O良', '0905-XXX-874'],
	['香菇先生精美周邊眼罩&隨身鏡', '朱O立', '0976-XXX-334'],
	['香菇先生精美周邊眼罩&隨身鏡', '許O緯', '0981-XXX-979'],
	['香菇先生精美周邊眼罩&隨身鏡', '蔡O評', '0958-XXX-487'],
	['香菇先生精美周邊眼罩&隨身鏡', '林O儒', '0922-XXX-915'],
	['香菇先生精美周邊眼罩&隨身鏡', '謝O婷', '0919-XXX-732'],
	['香菇先生精美周邊眼罩&隨身鏡', '林O如', '0958-XXX-026'],
	['香菇先生精美周邊眼罩&隨身鏡', '張O娥', '0915-XXX-169'],
	['香菇先生精美周邊眼罩&隨身鏡', '陳O綾', '0928-XXX-605'],
	['香菇先生精美周邊眼罩&隨身鏡', '周O瑩', '0989-XXX-163'],
	['香菇先生精美周邊眼罩&隨身鏡', '徐O嫻', '0983-XXX-121'],
	['香菇先生精美周邊眼罩&隨身鏡', '張O御', '0925-XXX-210'],
	['香菇先生精美周邊眼罩&隨身鏡', '廖O俊', '0919-XXX-681'],
	['香菇先生精美周邊眼罩&隨身鏡', '韋O君', '0920-XXX-569'],
	['香菇先生精美周邊眼罩&隨身鏡', '王O妤', '0966-XXX-920'],
	['香菇先生精美周邊眼罩&隨身鏡', '蔡O華', '0982-XXX-171'],
	['香菇先生精美周邊眼罩&隨身鏡', '宋O軒', '0988-XXX-638'],
	['香菇先生精美周邊眼罩&隨身鏡', '許O貽', '0989-XXX-869'],
	['香菇先生精美周邊眼罩&隨身鏡', '黃O茵', '0979-XXX-653'],
	['香菇先生精美周邊眼罩&隨身鏡', '王O萍', '0956-XXX-269'],
	['香菇先生精美周邊眼罩&隨身鏡', '張O嘉', '0952-XXX-795'],
	['香菇先生精美周邊眼罩&隨身鏡', '李O遠', '0911-XXX-784'],
	['香菇先生精美周邊眼罩&隨身鏡', '李O頡', '0921-XXX-308'],
	['香菇先生精美周邊眼罩&隨身鏡', '陳O妤', '0967-XXX-566'],
	['香菇先生精美周邊眼罩&隨身鏡', '林O倫', '0952-XXX-778'],
	['香菇先生精美周邊眼罩&隨身鏡', '謝O容', '0928-XXX-001'],
	['香菇先生精美周邊眼罩&隨身鏡', '李O陽', '0978-XXX-626'],
	['香菇先生精美周邊眼罩&隨身鏡', '陳O鈴', '0922-XXX-999'],
	['香菇先生精美周邊眼罩&隨身鏡', '湯O靜', '0905-XXX-568'],
	['香菇先生精美周邊眼罩&隨身鏡', '李O玲', '0975-XXX-179'],
	['香菇先生精美周邊眼罩&隨身鏡', '林O峰', '0932-XXX-262'],
	['LINE POINTS 100點', '林O斐', '0939-XXX-979'],
	['LINE POINTS 100點', '施O慧', '0976-XXX-218'],
	['LINE POINTS 100點', '林O玲', '0980-XXX-888'],
	['LINE POINTS 100點', '陳O伶', '0963-XXX-138'],
	['LINE POINTS 100點', '陳O唐', '0916-XXX-159'],
	['LINE POINTS 100點', '沈O珍', '0971-XXX-827'],
	['LINE POINTS 100點', '吳O霖', '0977-XXX-141'],
	['LINE POINTS 100點', '邱O涵', '0903-XXX-852'],
	['LINE POINTS 100點', '秦O慧', '0936-XXX-831'],
	['LINE POINTS 100點', '張O雯', '0903-XXX-987'],
	['LINE POINTS 100點', '林O臻', '0970-XXX-588'],
	['LINE POINTS 100點', '鐘O伶', '0932-XXX-185'],
	['LINE POINTS 100點', '吳洪O芳', '0908-XXX-278'],
	['LINE POINTS 100點', '蔡O晏', '0974-XXX-156'],
	['LINE POINTS 100點', '梁O輔', '0908-XXX-737'],
	['LINE POINTS 100點', '張O亘', '0968-XXX-806'],
	['LINE POINTS 100點', '潘O賢', '0922-XXX-457'],
	['LINE POINTS 100點', '洪O鳳', '0975-XXX-575'],
	['LINE POINTS 100點', '陳O茿', '0978-XXX-356'],
	['LINE POINTS 100點', '黃O珈', '0933-XXX-011'],
	['LINE POINTS 100點', '謝O麗', '0952-XXX-164'],
	['LINE POINTS 100點', '蕭O惠', '0919-XXX-455'],
	['LINE POINTS 100點', '林O君', '0933-XXX-933'],
	['LINE POINTS 100點', '林O甄', '0966-XXX-571'],
	['LINE POINTS 100點', '柯O彤', '0917-XXX-453'],
	['LINE POINTS 100點', '林O惠', '0922-XXX-686'],
	['LINE POINTS 100點', '廖O棠', '0972-XXX-560'],
	['LINE POINTS 100點', '林O雄', '0912-XXX-964'],
	['LINE POINTS 100點', '謝', '0978-XXX-131'],
	['LINE POINTS 100點', '李O欣', '0978-XXX-517'],
	['LINE POINTS 100點', '吳O玲', '0906-XXX-228'],
	['LINE POINTS 100點', '蘇O名', '0938-XXX-735'],
	['LINE POINTS 100點', '吳O禎', '0905-XXX-096'],
	['LINE POINTS 100點', '郭O奇', '0934-XXX-196'],
	['LINE POINTS 100點', '李O諺', '0972-XXX-686'],
	['LINE POINTS 100點', '黃O亮', '0922-XXX-756'],
	['LINE POINTS 100點', '紀O梅', '0906-XXX-439'],
	['LINE POINTS 100點', '陳O怡', '0935-XXX-400'],
	['LINE POINTS 100點', '黃O絢', '0983-XXX-819'],
	['LINE POINTS 100點', '陳O伶', '0906-XXX-312'],
];

export const WINNER_DATE = new Date(2023, 11, 4, 8, 0, 0);
