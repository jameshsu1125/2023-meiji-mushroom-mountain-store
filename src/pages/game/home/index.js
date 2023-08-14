import { memo, useCallback, useContext, useEffect, useRef, useState } from 'react';
import GL from './gl';
import { Context } from '../../../settings/config';
import { ACTION } from '../../../settings/constant';
import Joystick from './joystick';
import { GameContext, GamePage } from '../config';

let GLOBAL_WEBGL;

const WebGL = memo(() => {
	const [, setContext] = useContext(Context);
	const [, setState] = useContext(GameContext);
	const ref = useRef();
	const gl = useRef();
	const [count, setCount] = useState(0);

	useEffect(() => {
		if (count) {
			setContext({ type: ACTION.modal, state: { enabled: true, body: `吃到 ${count} 蘑菇了` } });
		}
	}, [count]);

	const onModulesLoaded = useCallback(() => {
		setContext({ type: ACTION.loadingProcess, state: { enabled: false } });
	}, []);

	const onMushroomTrigger = useCallback(() => {
		setCount((S) => S + 1);
	}, []);

	const onGameOver = useCallback(() => {
		setContext({ type: ACTION.modal, state: { enabled: true, body: '出界了', time: 2000 } });
		setTimeout(() => {
			setState((S) => ({ ...S, page: GamePage.form }));
		}, 2000);
	}, []);

	const onGameCountDown = useCallback((message) => {
		setContext({ type: ACTION.modal, state: { enabled: true, body: `倒數${message}秒開始` } });
	}, []);

	const onJoyStickMove = useCallback((property) => {
		gl.current.controller.moveJoystick(property);
	}, []);

	const onJoyStickStop = useCallback(() => {
		gl.current.controller.stopJoystick();
	}, []);

	useEffect(() => {
		setContext({ type: ACTION.loadingProcess, state: { enabled: true } });
		if (!GLOBAL_WEBGL) {
			GLOBAL_WEBGL = new GL({
				dom: ref.current,
				onMushroomTrigger,
				onModulesLoaded,
				onGameCountDown,
				onGameOver,
			});
			gl.current = GLOBAL_WEBGL;
		} else {
			gl.current = GLOBAL_WEBGL;
			gl.current.reset(ref.current);
		}
		return () => gl.current.webgl?.enterframe.stop();
	}, []);

	return (
		<div className='h-full w-full'>
			<div ref={ref} className='h-full w-full' />
			<Joystick onJoyStickMove={onJoyStickMove} onJoyStickStop={onJoyStickStop} />
		</div>
	);
});
export default WebGL;
