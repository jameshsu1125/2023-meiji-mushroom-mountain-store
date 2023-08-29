import useTween, { Bezier } from 'lesca-use-tween';
import { memo, useEffect, useMemo, useState } from 'react';
import { RespondBreakPoint } from '../../../settings/config';
import { TRANSITION } from '../../../settings/constant';
import './index.less';

const Subline = memo(({ children, step, transition }) => {
	const [style, setStyle] = useTween({ opacity: 0, x: window.innerWidth });
	useEffect(() => {
		if (transition === TRANSITION.fadeIn) {
			setStyle({ opacity: 1, x: 0 }, { duration: 500, delay: 200 });
		} else if (transition === TRANSITION.fadeOut) {
			setStyle(
				{ opacity: 0, x: -window.innerWidth },
				{
					duration: 500,
					easing: Bezier.inQuart,
					delay: 200,
					onEnd: () => {
						setStyle({ x: window.innerWidth }, 10);
					},
				},
			);
		}
	}, [transition]);

	const [device, setDevice] = useState(window.innerWidth >= RespondBreakPoint.md);
	useEffect(() => {
		const resize = () => setDevice(window.innerWidth >= RespondBreakPoint.md);
		window.addEventListener('resize', resize);
		return () => window.removeEventListener('resize', resize);
	}, []);

	const extraContent = useMemo(() => {
		if (step === 0) {
			return <div className='mr-3'>{device ? '點擊鍵盤' : '滑動虛擬搖桿'}</div>;
		}
		return '';
	}, [device, step]);

	return (
		<div style={style} className='subline'>
			{extraContent}
			{children}
		</div>
	);
});
export default Subline;
