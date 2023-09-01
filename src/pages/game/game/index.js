import UserAgent from 'lesca-user-agent';
import { memo, useCallback, useContext, useEffect, useRef, useState } from 'react';
import { GameContext, GamePage, GameSteps, SoundsTrackName } from '../config';
import Countdown from './countdown';
import GL from './gl';
import './index.less';
import Joystick from './joystick';
import Over from './over';
import Score from './score';

let GLOBAL_WEBGL;

const WebGL = memo(() => {
	const ref = useRef();
	const gl = useRef();

	const [state, setState] = useContext(GameContext);
	const { countdown, over, page, soundsLoaded, sounds } = state;
	const [device, setDevice] = useState(UserAgent.get() === 'mobile');

	const onModulesLoaded = useCallback(() => {
		setState((S) => ({ ...S, steps: GameSteps.modelLoaded }));
		if (page === GamePage.game) gl.current.start(ref.current);
	}, []);

	const onMushroomTrigger = useCallback(() => {
		setState((S) => ({ ...S, score: S.score + 1 }));
		sounds.tracks[SoundsTrackName.mushroom].sound.play();
	}, []);

	const onBambooTrigger = useCallback(() => {
		sounds.tracks[SoundsTrackName.bamboo].sound.play();
	}, []);

	const onGameOver = useCallback(() => {
		setState((S) => ({ ...S, over: true }));
		sounds.tracks[SoundsTrackName.move].sound.stop();
		sounds.tracks[SoundsTrackName.falling].sound.play();
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
		const resize = () => setDevice(UserAgent.get() === 'mobile');
		window.addEventListener('resize', resize);

		if (!GLOBAL_WEBGL) {
			GLOBAL_WEBGL = new GL({
				onMushroomTrigger,
				onBambooTrigger,
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

		return () => {
			gl.current.webgl?.enterframe.stop();
			window.removeEventListener('resize', resize);
		};
	}, []);

	useEffect(() => {
		if (soundsLoaded) {
			sounds.tracks[SoundsTrackName.bgm].sound.play();
			gl.current.setCharacterMoveSoundTrack(sounds.tracks[SoundsTrackName.move].sound);
		}
	}, [soundsLoaded]);

	return (
		<div className='WebGL'>
			<div ref={ref} className='h-full w-full' />
			{state.steps === GameSteps.didFadeIn && <Score />}
			{device && state.steps === GameSteps.didFadeIn && (
				<Joystick onJoyStickMove={onJoyStickMove} onJoyStickStop={onJoyStickStop} />
			)}
			{countdown !== false && <Countdown />}
			{over && <Over />}
			{soundsLoaded && <div className='absolute top-0 left-0'>icon</div>}
		</div>
	);
});
export default WebGL;
