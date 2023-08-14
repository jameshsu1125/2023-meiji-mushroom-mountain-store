import { memo, useEffect } from 'react';
import './index.less';

const Remark = memo(() => {
	useEffect(() => {}, []);
	return (
		<div className='Remark'>
			為確保您的中獎資格，請記得填寫正確資料，若資料填寫不正確以致贈禮無法順利寄達，恕不補寄
		</div>
	);
});
export default Remark;
