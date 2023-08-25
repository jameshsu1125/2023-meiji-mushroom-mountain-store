import UserAgent from 'lesca-user-agent';
import { memo, useCallback, useContext, useEffect, useRef, useState } from 'react';
import { Context } from '../../../settings/config';
import { ACTION } from '../../../settings/constant';
import { GameContext, GameSteps } from '../config';
import GL from './gl';
import Joystick from './joystick';

let GLOBAL_WEBGL;

const WebGL = memo(() => {
	const [, setContext] = useContext(Context);
	const [state, setState] = useContext(GameContext);

	const ref = useRef();
	const gl = useRef();

	const [count, setCount] = useState(0);
	const [device, setDevice] = useState(UserAgent.get() === 'mobile');

	useEffect(() => {
		if (count) {
			setContext({ type: ACTION.modal, state: { enabled: true, body: `吃到 ${count} 蘑菇了` } });
		}
	}, [count]);

	const onModulesLoaded = useCallback(() => {
		setState((S) => ({ ...S, steps: GameSteps.modelLoaded }));
	}, []);

	const onMushroomTrigger = useCallback(() => {
		setCount((S) => S + 1);
	}, []);

	const onGameOver = useCallback(() => {
		console.log('game over');
	}, []);

	const onCameraZoomOuted = useCallback(() => {
		gl.current.begin();
		setState((S) => ({ ...S, steps: GameSteps.didFadeIn }));
	}, []);

	// TODO => CountDown
	// const onGameCountDown = useCallback((message) => {
	// 	setContext({ type: ACTION.modal, state: { enabled: true, body: `倒數${message}秒開始` } });
	// }, []);

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
				// TODO => CountDown
				// onGameCountDown,
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
		<div className='h-full w-full'>
			<div ref={ref} className='h-full w-full' />
			{device && state.steps === GameSteps.didFadeIn && (
				<Joystick onJoyStickMove={onJoyStickMove} onJoyStickStop={onJoyStickStop} />
			)}
		</div>
	);
});
export default WebGL;
