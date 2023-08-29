import UserAgent from 'lesca-user-agent';
import { memo, useCallback, useContext, useEffect, useRef, useState } from 'react';
import { GameContext, GamePage, GameSteps } from '../config';
import CountDown from './countDown';
import GL from './gl';
import Joystick from './joystick';
import Score from './score';

let GLOBAL_WEBGL;

const WebGL = memo(() => {
	const ref = useRef();
	const gl = useRef();

	const [state, setState] = useContext(GameContext);
	const { score, countdown, over, page } = state;
	const [device, setDevice] = useState(UserAgent.get() === 'mobile');

	useEffect(() => {
		if (score) console.log(score);
		if (over) console.log(over);
	}, [score, over]);

	const onModulesLoaded = useCallback(() => {
		setState((S) => ({ ...S, steps: GameSteps.modelLoaded }));
		if (page === GamePage.game) gl.current.start(ref.current);
	}, []);

	const onMushroomTrigger = useCallback(() => {
		setState((S) => ({ ...S, score: S.score + 1 }));
	}, []);

	const onGameOver = useCallback(() => {
		setState((S) => ({ ...S, over: true }));
	}, []);

	const onCameraZoomOuted = useCallback(() => {
		gl.current.begin();
		setState((S) => ({ ...S, steps: GameSteps.didFadeIn }));
	}, []);

	const onGameCountDown = useCallback((time) => {
		setState((S) => ({ ...S, countdown: time }));
	}, []);

	const onJoyStickMove = useCallback((property) => {
		gl.current?.controller?.moveJoystick(property);
	}, []);

	const onJoyStickStop = useCallback(() => {
		gl.current?.controller?.stopJoystick();
	}, []);

	useEffect(() => {
		if (!GLOBAL_WEBGL) {
			GLOBAL_WEBGL = new GL({
				onMushroomTrigger,
				onModulesLoaded,
				onGameOver,
				onCameraZoomOuted,
				onGameCountDown,
			});
			gl.current = GLOBAL_WEBGL;
		} else {
			gl.current = GLOBAL_WEBGL;
			gl.current.start(ref.current);
		}
		return () => gl.current.webgl?.enterframe.stop();
	}, []);

	useEffect(() => {
		const resize = () => setDevice(UserAgent.get() === 'mobile');
		window.addEventListener('resize', resize);
		return () => window.removeEventListener('resize', resize);
	}, []);

	return (
		<div className='h-full w-full -mt-[134px] lg:-mt-[80px]'>
			<div ref={ref} className='h-full w-full' />
			{state.steps === GameSteps.didFadeIn && <Score />}
			{device && state.steps === GameSteps.didFadeIn && (
				<Joystick onJoyStickMove={onJoyStickMove} onJoyStickStop={onJoyStickStop} />
			)}
			{countdown !== false && <CountDown />}
		</div>
	);
});
export default WebGL;
