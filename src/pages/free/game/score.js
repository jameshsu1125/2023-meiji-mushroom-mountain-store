import OnloadProvider from 'lesca-react-onload';
import useTween, { Bezier } from 'lesca-use-tween';
import { memo, useContext, useEffect, useState } from 'react';
import { RespondContainer } from '../../../components/container';
import { TRANSITION } from '../../../settings/constant';
import { GameContext } from '../config';
import './score.less';

const Board = ({ transition, children }) => {
	const [style, setStyle] = useTween({ opacity: 1, y: -100 });
	useEffect(() => {
		if (transition === TRANSITION.fadeIn) {
			setStyle({ opacity: 1, y: 0 }, { duration: 500, easing: Bezier.outBack });
		}
	}, [transition]);
	return (
		<div style={style} className='board'>
			<div className='ico' />
			<div>
				<div>{children}</div>
			</div>
			<div>朵</div>
		</div>
	);
};

const Score = memo(() => {
	const [state] = useContext(GameContext);
	const { score } = state;
	const [transition, setTransition] = useState(TRANSITION.unset);
	const [scale, setScale] = useState(1);

	useEffect(() => {
		const resize = () => {
			const radio = window.innerHeight / 808;
			setScale(radio > 1 ? 1 : radio);
		};
		resize();
		window.addEventListener('resize', resize);
		return () => window.removeEventListener('resize', resize);
	}, []);

	return (
		<OnloadProvider onload={() => setTransition(TRANSITION.fadeIn)}>
			<div className='Score' style={{ transform: `scale(${scale})` }}>
				<RespondContainer maxWidth='500px' fitHeight={false}>
					<div className='pl-20 flex justify-center flex-row items-center'>
						<Board transition={transition}>{score}</Board>
					</div>
				</RespondContainer>
			</div>
		</OnloadProvider>
	);
});
export default Score;
