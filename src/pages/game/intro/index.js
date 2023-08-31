import Click from 'lesca-click';
import OnloadProvider from 'lesca-react-onload';
import { memo, useContext, useEffect, useMemo, useState } from 'react';
import { RespondContainer } from '../../../components/container';
import Scrollable from '../../../components/scrollable';
import { TRANSITION } from '../../../settings/constant';
import { GameContext } from '../config';
import { Info, IntroState } from './config';
import IntroEnd from './end';
import './index.less';
import Steps from './steps';

const Intro = memo(() => {
	const [, setGameState] = useContext(GameContext);
	const [state, setState] = useState(IntroState);
	const { step } = state;
	const data = useMemo(() => Info[step], [step]);
	const [transition, setTransition] = useState(TRANSITION.unset);
	useEffect(() => {
		Click.addPreventExcept('.Intro');
	}, []);
	return (
		<OnloadProvider onload={() => setTransition(TRANSITION.fadeIn)}>
			<div className='Intro'>
				<Scrollable>
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
				</Scrollable>
			</div>
		</OnloadProvider>
	);
});
export default Intro;
