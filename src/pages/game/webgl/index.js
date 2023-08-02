import { memo, useCallback, useContext, useEffect, useRef, useState } from 'react';
import GL from './gl';
import { Context } from '../../../settings/config';
import { ACTION } from '../../../settings/constant';

const WebGL = memo(() => {
	const [, setContext] = useContext(Context);
	const ref = useRef();
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

	const onGameTimeUp = useCallback(() => {
		setContext({ type: ACTION.modal, state: { enabled: true, body: '時間到了', time: 10000 } });
	}, []);

	const onGameOver = useCallback(() => {
		setContext({ type: ACTION.modal, state: { enabled: true, body: '出界了', time: 10000 } });
	}, []);

	useEffect(() => {
		setContext({ type: ACTION.loadingProcess, state: { enabled: true } });
		const gl = new GL({
			dom: ref.current,
			onMushroomTrigger,
			onModulesLoaded,
			onGameTimeUp,
			onGameOver,
		});
		return () => gl.webgl.enterframe.stop();
	}, []);

	return <div ref={ref} className='h-full w-full' />;
});
export default WebGL;
