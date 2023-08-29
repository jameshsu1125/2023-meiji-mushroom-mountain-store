import { memo, useEffect, useState } from 'react';
import { RespondBreakPoint } from '../../settings/config';
import './index.less';

const Container = memo(({ children, height = 'auto', maxWidth = '1280px' }) => (
	<div className='Container' style={{ height }}>
		<div style={{ maxWidth }}>{children}</div>
	</div>
));
export default Container;

const RespondContainer = memo(
	({ children, maxWidth = '500px', height = 'auto', fitHeight = true }) => {
		const [width, setMaxWidth] = useState({ maxWidth: '1024px' });

		useEffect(() => {
			const resize = () => {
				const { innerWidth } = window;
				if (innerWidth > RespondBreakPoint.md) setMaxWidth({ maxWidth });
				else setMaxWidth({ maxWidth: '1024px' });
			};
			resize();
			window.addEventListener('resize', resize);
			return () => window.removeEventListener('resize', resize);
		}, []);

		return (
			<div className={`RespondContainer${fitHeight ? ' minHeight' : ''}`}>
				<Container maxWidth={width.maxWidth} height={height}>
					{children}
				</Container>
			</div>
		);
	},
);

export { RespondContainer };
