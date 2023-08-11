import { memo, useEffect } from 'react';
import './index.less';

const Dialog = memo(
	({ children, marginTop = '0px', marginBottom = '0px', maxWidth = '1024px' }) => {
		useEffect(() => {}, []);
		return (
			<div className='relative flex w-full justify-center'>
				<div className='Dialog' style={{ marginTop, marginBottom, maxWidth }}>
					{children}
				</div>
			</div>
		);
	},
);
export default Dialog;
