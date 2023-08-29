import useTween from 'lesca-use-tween';
import { memo, useContext, useEffect, useMemo } from 'react';
import { GameContext } from '../config';
import './countdown.less';

const Countdown = memo(() => {
	const [state, setState] = useContext(GameContext);
	const { countdown } = state;

	const [style, setStyle] = useTween({ opacity: 0, scale: 1.2 });

	useEffect(() => {
		if (countdown !== false) {
			setStyle(
				{ opacity: 0, scale: 1.2 },
				{
					duration: 1,
					onEnd: () => {
						setStyle(
							{ opacity: 1, scale: 1 },
							{
								duration: 500,
								onEnd: () => {
									if (countdown <= 0) {
										setTimeout(() => setState((S) => ({ ...S, countdown: false })), 500);
									}
								},
							},
						);
					},
				},
			);
		}
	}, [countdown]);

	const currentCount = useMemo(() => {
		if (countdown <= 0) return 'GO!';
		return countdown;
	}, [countdown]);

	return (
		<div className='Countdown'>
			<div style={style}>{currentCount}</div>
		</div>
	);
});
export default Countdown;
