import Gtag from 'lesca-gtag';
import OnloadProvider from 'lesca-react-onload';
import { memo, useContext, useEffect, useMemo, useState } from 'react';
import { RespondContainer } from '../../../components/container';
import useScale from '../../../hooks/useScale';
import { TRANSITION } from '../../../settings/constant';
import { GameContext } from '../config';
import { Info, IntroState } from './config';
import IntroEnd from './end';
import './index.less';
import Steps from './steps';
import { GtagState } from '../../../settings/config';

const Intro = memo(() => {
	const [, setGameState] = useContext(GameContext);
	const [state, setState] = useState(IntroState);
	const { step } = state;
	const data = useMemo(() => Info[step], [step]);
	const [transition, setTransition] = useState(TRANSITION.unset);
	const [scale] = useScale();

	useEffect(() => {
		Gtag.pv(GtagState.game.遊戲解說頁.page);
	}, []);

	return (
		<OnloadProvider onload={() => setTransition(TRANSITION.fadeIn)}>
			<div
				className='Intro'
				style={{ transform: `scale(${scale})`, transformOrigin: 'center top' }}
			>
				<RespondContainer>
					{(step < 3 && (
						<Steps
							step={step}
							transition={transition}
							data={data}
							setState={setState}
							setTransition={setTransition}
							setGameState={setGameState}
						/>
					)) || <IntroEnd />}
				</RespondContainer>
			</div>
		</OnloadProvider>
	);
});
export default Intro;
