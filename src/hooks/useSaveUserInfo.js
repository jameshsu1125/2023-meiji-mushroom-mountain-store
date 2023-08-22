import Fetcher from 'lesca-fetcher';
import { useContext, useState } from 'react';
import { Context, DEFAULT_RESPOND } from '../settings/config';
import { ACTION, USER_INFO_NAME, VALIDATE_INFO } from '../settings/constant';

// prettier-ignore
const UN_CURRENT_FORMAT_MESSAGE = (forms) => `以下資料格式不正確或是未填寫\n${forms}\n請確認後再試一次。`;

const useSaveUserInfo = () => {
	const [, setContext] = useContext(Context);
	const [state, setState] = useState();
	const fetch = async (data) => {
		const checked = Object.entries(data).map((item) => {
			const check = VALIDATE_INFO[item[0]];
			if (!check(item[1])) {
				const errorLabel = Object.entries(USER_INFO_NAME).filter((info) => info[1] === item[0]);
				return { [errorLabel[0][0]]: false };
			}
			const errorLabel = Object.entries(USER_INFO_NAME).filter((info) => info[1] === item[0]);
			return { [errorLabel[0][0]]: true };
		});
		const unPassedItem = checked
			.filter((item) => !Object.values(item)[0])
			.map((item) => Object.keys(item)[0]);
		if (unPassedItem.length !== 0) {
			alert(UN_CURRENT_FORMAT_MESSAGE(unPassedItem.join(', ')));
			return;
		}
		setContext({ type: ACTION.loadingProcess, state: { enabled: true } });

		const currentData = { ...data };
		delete currentData[USER_INFO_NAME.同意辦法];
		currentData[USER_INFO_NAME.稱呼] = Number(currentData[USER_INFO_NAME.稱呼]);
		currentData[USER_INFO_NAME.年齡區間] = Number(currentData[USER_INFO_NAME.年齡區間]);

		if (process.env.MODE === 'local') setTimeout(() => setState(DEFAULT_RESPOND), 2000);
		else {
			const respond = await Fetcher.post('/SaveUserInfo', currentData);
			setState(respond);
		}
		setContext({ type: ACTION.loadingProcess, state: { enabled: false } });
	};
	return [state, fetch];
};
export default useSaveUserInfo;
