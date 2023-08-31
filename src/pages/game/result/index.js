import OnloadProvider from 'lesca-react-onload';
import useTween, { Bezier } from 'lesca-use-tween';
import { memo, useContext, useEffect, useState } from 'react';
import RegularButton from '../../../components/button';
import { RespondContainer } from '../../../components/container';
import Scrollable from '../../../components/scrollable';
import { TRANSITION } from '../../../settings/constant';
import { GameContext, GamePage } from '../config';
import './index.less';

const Score = ({ score, transition }) => {
	const [currentScore, setScore] = useTween({ score: 0 });
	useEffect(() => {
		if (transition === TRANSITION.fadeIn) setScore({ score }, { duration: 1000, delay: 500 });
	}, [transition, score]);
	return <div className='score'>{Math.floor(currentScore.score) || 0}</div>;
};

const Text = ({ transition }) => {
	const [style, setStyle] = useTween({ opacity: 0, x: 300 });
	useEffect(() => {
		setStyle({ opacity: 1, x: 0 }, { duration: 500 });
	}, [transition]);
	return (
		<div style={style} className='text'>
			你總共採了
		</div>
	);
};

const Character = ({ transition }) => {
	const [style, setStyle] = useTween({ opacity: 0, scale: 0, rotate: -125 });
	useEffect(() => {
		setStyle({ opacity: 1, scale: 1, rotate: 0 }, { duration: 500, easing: Bezier.outBack });
	}, [transition]);
	return <div style={style} className='character' />;
};

const Button = ({ transition, children, delay = 0 }) => {
	const [style, setStyle] = useTween({ opacity: 0, y: 50 });
	useEffect(() => {
		if (transition === TRANSITION.fadeIn) {
			setStyle({ opacity: 1, y: 0 }, { duration: 700, delay: delay + 1300 });
		}
	}, [transition]);
	return (
		<div style={style} className='w-full'>
			{children}
		</div>
	);
};

const Result = memo(() => {
	const [state, setState] = useContext(GameContext);
	const { score } = state;
	const [transition, setTransition] = useState(TRANSITION.unset);
	return (
		<OnloadProvider onload={() => setTransition(TRANSITION.fadeIn)}>
			<div className='Result'>
				<Scrollable>
					<RespondContainer>
						<div className='w-full flex flex-col justify-center items-center pt-8'>
							<Character transition={transition} />
							<Text transition={transition} />
							<Score transition={transition} score={score} />
							<div className='w-full flex flex-col items-center justify-center px-28 mt-12 pb-10 lg:px-10 space-y-4'>
								<Button transition={transition}>
									<RegularButton
										maxWidth='100%'
										width='160px'
										onClick={() => setState((S) => ({ ...S, page: GamePage.form }))}
									>
										填單抽回饋禮
									</RegularButton>
								</Button>
								<Button transition={transition}>
									<RegularButton
										maxWidth='100%'
										width='160px'
										onClick={() => window.location.reload()}
									>
										再玩一次
									</RegularButton>
								</Button>
							</div>
						</div>
					</RespondContainer>
				</Scrollable>
			</div>
		</OnloadProvider>
	);
});
export default Result;
