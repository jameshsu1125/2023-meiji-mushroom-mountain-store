import { memo, useEffect } from 'react';
import './index.less';

const Container = memo(({ children, height = 'auto' }) => {
	useEffect(() => {}, []);

	return (
		<div className='Container' style={{ height }}>
			<div>{children}</div>
		</div>
	);
});
export default Container;
