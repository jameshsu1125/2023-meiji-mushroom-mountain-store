import useTween from 'lesca-use-tween';
import { memo, useContext, useEffect } from 'react';
import './over.less';
import { gameRule } from './config';
import { GameContext, GamePage } from '../config';

const Over = memo(() => {
	const [, setState] = useContext(GameContext);
	const [style, setStyle] = useTween({ opacity: 0, scale: 2 });

	useEffect(() => {
		setStyle(
			{ opacity: 1, scale: 1 },
			{
				duration: 500,
				delay: 500,
				onEnd: () => {
					setTimeout(() => {
						setState((S) => ({ ...S, page: GamePage.result }));
					}, gameRule.gameOverStayDuration);
				},
			},
		);
	}, []);
	return (
		<div className='Over'>
			<div style={style}>
				<div>GAME</div>
				<div>OVER</div>
			</div>
		</div>
	);
});
export default Over;
