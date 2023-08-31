import { memo, useCallback, useContext, useEffect, useRef } from 'react';
import { GameContext, GamePage, GameSteps } from '../config';
import GL from './gl';
import './index.less';

let GLOBAL_WEBGL;

const WebGL = memo(() => {
	const ref = useRef();
	const gl = useRef();

	const [state, setState] = useContext(GameContext);
	const { page } = state;

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

	return (
		<div className='WebGL'>
			<div ref={ref} className='h-full w-full' />
		</div>
	);
});
export default WebGL;
