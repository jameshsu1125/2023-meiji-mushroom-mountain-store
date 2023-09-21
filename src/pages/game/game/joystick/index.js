import { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Vec2Angle, Vec2Distance } from '../misc';
import './index.less';

const Joystick = memo(({ onJoyStickMove, onJoyStickStop }) => {
	const [vec2, setVec2] = useState({ x: window.innerWidth * 0.5, y: window.innerHeight * 0.8 });
	const [stickPosition, setStickPosition] = useState({ x: 0, y: 0 });
	const ref = useRef({ enabled: false, sx: 0, sy: 0, mx: 0, my: 0 });
	const { left, top } = useMemo(() => ({ left: vec2.x, top: vec2.y }), [vec2]);

	const DefaultVec2 = useCallback(
		() => ({ x: window.innerWidth * 0.5, y: window.innerHeight * 0.8 }),
		[],
	);

	useEffect(() => {
		const resize = () => setVec2(DefaultVec2());
		window.addEventListener('resize', resize);
		return () => window.removeEventListener('resize', resize);
	}, []);

	const onDown = useCallback((event) => {
		const x = event.clientX || event.touches?.[0]?.clientX;
		const y = event.clientY || event.touches?.[0]?.clientY;
		if (!x || !y) return;
		setVec2({ x, y });
		ref.current = { enabled: true, sx: x, sy: y, mx: x, my: y };
	}, []);

	const onUp = useCallback(() => {
		ref.current = { ...ref.current, enabled: false };
		setStickPosition({ x: 0, y: 0 });
		onJoyStickStop();
		setVec2(DefaultVec2());
	}, []);

	const onMove = useCallback((event) => {
		if (!ref.current.enabled) return;

		const x = event.clientX || event.touches?.[0]?.clientX;
		const y = event.clientY || event.touches?.[0]?.clientY;
		if (!x || !y) return;

		ref.current = { ...ref.current, mx: x, my: y };
		const { sx, sy, mx, my } = ref.current;

		const p1 = { x: sx, y: sy };
		const p2 = { x: mx, y: my };

		const angle = Vec2Angle(p1, p2);
		const distance = Vec2Distance(p1, p2);
		const currentDistance = distance > 97 ? 97 : distance;

		const stickX = Math.cos(angle) * currentDistance;
		const stickY = Math.sin(angle) * currentDistance;

		setStickPosition({ x: stickX, y: stickY });
		onJoyStickMove({ angle, distance: currentDistance });
	}, []);

	return (
		<div
			className='Joystick'
			onMouseDown={onDown}
			onTouchStart={onDown}
			onMouseUp={onUp}
			onTouchEnd={onUp}
			onMouseMove={onMove}
			onTouchMove={onMove}
			role='none'
		>
			<div className='panel' style={{ left, top }}>
				<div
					className='stick'
					style={{
						transform: `translateX(${-stickPosition.y}px) translateY(${-stickPosition.x}px)`,
					}}
				/>
			</div>
		</div>
	);
});
export default Joystick;
