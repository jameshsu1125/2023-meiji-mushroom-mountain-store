import { memo, useEffect } from 'react';
import './index.less';

const Terms = memo(() => {
	useEffect(() => {}, []);
	return (
		<div className='Terms'>
			<div>
				<input type='checkbox' />
			</div>
			<div className='txt'>
				已詳閱活動辦法及個人資料使用說明，參加本活動即表示同意公告之辦法及說明
			</div>
		</div>
	);
});
export default Terms;
