import { memo, useEffect } from 'react';
import './index.less';

const RegularButton = memo(({ children, width = 'auto' }) => {
	useEffect(() => {}, []);
	return (
		<button className='RegularButton' type='button'>
			<div>
				<div style={{ width }}>{children}</div>
			</div>
			<div>
				<div className='ico' />
			</div>
		</button>
	);
});
export default RegularButton;
