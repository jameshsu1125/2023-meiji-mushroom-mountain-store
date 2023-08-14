import { memo, useEffect } from 'react';
import './index.less';

const RegularButton = memo(({ children, width = 'auto', maxWidth = '400px', onClick }) => {
	useEffect(() => {}, []);
	return (
		<button
			className='RegularButton'
			type='button'
			style={{ maxWidth }}
			onClick={() => onClick?.()}
		>
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
