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

	return (
		<OnloadProvider onload={() => setTransition(TRANSITION.fadeIn)}>
			<div className='Score'>
				<RespondContainer fitHeight={false}>
					<div className='px-20 flex justify-center'>
						<Board transition={transition}>{score}</Board>
					</div>
				</RespondContainer>
			</div>
		</OnloadProvider>
	);
});
export default Score;
