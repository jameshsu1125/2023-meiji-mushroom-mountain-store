import OnloadProvider from 'lesca-react-onload';
import useTween, { Bezier, TweenProvider } from 'lesca-use-tween';
import { memo, useContext, useEffect, useState } from 'react';
import RegularButton from '../../../components/button';
import { RespondContainer } from '../../../components/container';
import useScale from '../../../hooks/useScale';
import { Context, RespondBreakPoint } from '../../../settings/config';
import { ACTION } from '../../../settings/constant';
import { GameContext, GamePage, GameSteps } from '../config';
import WebGL from '../game';
import './index.less';

const Picture = ({ steps, setState }) => {
	const [style, setStyle] = useTween({ opacity: 0, y: 50 });
	const [didFaded, setDidFaded] = useState(false);

	useEffect(() => {
		if (steps === GameSteps.modelLoaded) {
			setStyle({ opacity: 1, y: 0 }, { duration: 500, delay: 800, onEnd: () => setDidFaded(true) });
		}
	}, [steps]);

	return (
		<div style={style} className='pic'>
			<div>
				<TweenProvider
					initStyle={{ opacity: 0, y: 50 }}
					tweenStyle={didFaded && { opacity: 1, y: 0 }}
					options={{ delay: 0, duration: 500 }}
				>
					<div className='w-full'>
						<RegularButton
							maxWidth='100%'
							width={window.innerWidth >= RespondBreakPoint.md ? '160px' : '200px'}
							onClick={() => {
								setState((S) => ({ ...S, page: GamePage.intro }));
							}}
						>
							菇菇怎麼採
						</RegularButton>
					</div>
				</TweenProvider>
				<TweenProvider
					initStyle={{ opacity: 0, y: 50 }}
					tweenStyle={didFaded && { opacity: 1, y: 0 }}
					options={{ delay: 200, duration: 500 }}
				>
					<div className='w-full'>
						<RegularButton
							maxWidth='100%'
							width={window.innerWidth >= RespondBreakPoint.md ? '160px' : '200px'}
							onClick={() => {
								setState((S) => {
									S.sounds?.loadSound?.(() => {
										setState((SS) => ({ ...SS, soundsLoaded: true }));
									});
									return { ...S, page: GamePage.game };
								});
							}}
						>
							開始採菇
						</RegularButton>
					</div>
				</TweenProvider>
			</div>
		</div>
	);
};

const Subline = ({ steps }) => {
	const [style, setStyle] = useTween({ opacity: 0, y: 50 });
	useEffect(() => {
		if (steps === GameSteps.modelLoaded) {
			setStyle({ opacity: 1, y: 0 }, { duration: 500, delay: 600 });
		}
	}, [steps]);
	return (
		<div className='subLine' style={style}>
			菇菇山開園大豐收～快忙翻啦（暈）
			<br />
			熱血的你，一起來幫菇太郎採收菇菇吧！
			<br />
			<div>
				還有機會帶走
				<span>豪華回饋禮</span>
				噢～
			</div>
		</div>
	);
};

const Headline = ({ steps }) => {
	const [style, setStyle] = useTween({ opacity: 0, y: 50 });
	useEffect(() => {
		if (steps === GameSteps.modelLoaded) {
			setStyle({ opacity: 1, y: 0 }, { duration: 500, delay: 400 });
		}
	}, [steps]);
	return (
		<div style={style} className='headline'>
			採菇達人請留步！
		</div>
	);
};

const Title = ({ steps }) => {
	const [style, setStyle] = useTween({ opacity: 0, scale: 1.5 });
	useEffect(() => {
		if (steps === GameSteps.modelLoaded) {
			setStyle({ opacity: 1, scale: 1 }, { duration: 500, easing: Bezier.outBack });
		}
	}, [steps]);
	return <div className='title' style={style} />;
};

const GameHome = memo(() => {
	const [state, setState] = useContext(GameContext);
	const [, setContext] = useContext(Context);
	const [scale] = useScale();

	useEffect(() => {
		if (state.steps === GameSteps.modelLoaded) {
			setContext({ type: ACTION.loadingProcess, state: { enabled: false } });
		}
	}, [state.steps]);

	useEffect(() => {
		setContext({ type: ACTION.loadingProcess, state: { enabled: true } });
	}, []);

	return (
		<OnloadProvider
			onload={() => {
				setState((S) => ({ ...S, steps: GameSteps.loaded }));
			}}
		>
			<div className='GameHome'>
				<RespondContainer>
					<div
						className='w-full'
						style={{ transform: `scale(${scale})`, transformOrigin: 'center top' }}
					>
						<div className='w-full flex justify-center mt-5'>
							<Title steps={state.steps} />
						</div>
						<div className='w-full flex flex-col justify-start items-center my-2'>
							<Headline steps={state.steps} />
							<Subline steps={state.steps} />
							<Picture steps={state.steps} setState={setState} />
						</div>
					</div>
				</RespondContainer>
				{state.steps === GameSteps.loaded && <WebGL />}
			</div>
		</OnloadProvider>
	);
});
export default GameHome;
