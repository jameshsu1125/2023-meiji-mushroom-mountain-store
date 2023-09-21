import useTween, { Bezier } from 'lesca-use-tween';
import { memo, useEffect } from 'react';
import { TRANSITION } from '../../../settings/constant';

const Headline = memo(({ children, step, transition }) => {
	const [style, setStyle] = useTween({ opacity: 0, x: window.innerWidth });

	useEffect(() => {
		if (transition === TRANSITION.fadeIn) setStyle({ opacity: 1, x: 0 }, 500);
		else if (transition === TRANSITION.fadeOut) {
			setStyle(
				{ opacity: 0, x: -window.innerWidth },
				{
					duration: 500,
					easing: Bezier.inQuart,
					onEnd: () => {
						setStyle({ x: window.innerWidth }, 1);
					},
				},
			);
		}
	}, [transition]);

	return (
		<div style={style} className={`title icon${step}`}>
			{children}
		</div>
	);
});
export default Headline;
