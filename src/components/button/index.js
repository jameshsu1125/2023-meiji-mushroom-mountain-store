/* eslint-disable react/button-has-type */
import { memo } from 'react';
import './index.less';

const RegularButton = memo(
	({ children, width = 'auto', maxWidth = '400px', onClick, type = 'button' }) => (
		<button className='RegularButton' type={type} style={{ maxWidth }} onClick={() => onClick?.()}>
			<div>
				<div style={{ width }}>{children}</div>
			</div>
			<div>
				<div className='ico' />
			</div>
		</button>
	),
);
export default RegularButton;
