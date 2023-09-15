import Gtag from 'lesca-gtag';
import OnloadProvider from 'lesca-react-onload';
import useTween from 'lesca-use-tween';
import { memo, useContext, useEffect, useState } from 'react';
import Article from '../../../components/article';
import RegularButton from '../../../components/button';
import { GtagState } from '../../../settings/config';
import { TRANSITION } from '../../../settings/constant';
import { GameContext, GamePage } from '../config';
import './end.less';

const Headline = ({ transition }) => {
	const [style, setStyle] = useTween({ opacity: 0, y: 50 });
	useEffect(() => {
		if (transition === TRANSITION.fadeIn) {
			setStyle({ opacity: 1, y: 0 }, 500);
		} else if (transition === TRANSITION.fadeOut) {
			setStyle({ opacity: 0, y: 0 }, 500);
		}
	}, [transition]);
	return (
		<div style={style} className='headline'>
			<div>接下來...</div>
			<div>搶收菇菇的重任就交給你啦！</div>
		</div>
	);
};

const Character = ({ transition }) => {
	const [style, setStyle] = useTween({ opacity: 0, scale: 1.2 });
	useEffect(() => {
		if (transition === TRANSITION.fadeIn) {
			setStyle({ opacity: 1, scale: 1 }, { duration: 500, delay: 100 });
		} else if (transition === TRANSITION.fadeOut) {
			setStyle({ opacity: 0 }, 500);
		}
	}, [transition]);
	return <div style={style} className='character' />;
};

const Button = ({ transition, setTransition }) => {
	const [, setState] = useContext(GameContext);
	const [style, setStyle] = useTween({ opacity: 0, y: 50 });
	useEffect(() => {
		if (transition === TRANSITION.fadeIn) {
			setStyle({ opacity: 1, y: 0 }, { duration: 500, delay: 200 });
		} else if (transition === TRANSITION.fadeOut) {
			setStyle(
				{ opacity: 0, y: 50 },
				{
					duration: 500,
					delay: 50,
					onEnd: () => {
						setState((S) => {
							S.sounds?.loadSound?.(() => {
								setState((SS) => ({ ...SS, soundsLoaded: true }));
							});
							return { ...S, page: GamePage.game };
						});
					},
				},
			);
		}
	}, [transition]);
	return (
		<div style={style} className='w-full px-20'>
			<RegularButton
				maxWidth='100%'
				width='157px'
				onClick={() => {
					Gtag.event(GtagState.game.遊戲解說頁.page, GtagState.game.遊戲解說頁.event.開始採菇);
					setTransition(TRANSITION.fadeOut);
				}}
			>
				開始採菇
			</RegularButton>
		</div>
	);
};

const IntroEnd = memo(() => {
	const [transition, setTransition] = useState(TRANSITION.unset);

	return (
		<OnloadProvider onload={() => setTransition(TRANSITION.fadeIn)}>
			<div className='IntroEnd'>
				<Headline transition={transition} />
				<Character transition={transition} />
				<div className='w-full'>
					<Article>
						<Button transition={transition} setTransition={setTransition} />
					</Article>
				</div>
			</div>
		</OnloadProvider>
	);
});
export default IntroEnd;
