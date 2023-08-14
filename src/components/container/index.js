import { memo } from 'react';
import './index.less';

const Container = memo(({ children, height = 'auto', maxWidth = '1280px' }) => (
	<div className='Container' style={{ height }}>
		<div style={{ maxWidth }}>{children}</div>
	</div>
));
export default Container;
