import { memo, useCallback, useRef } from 'react';

const TransitionKeyFrame = memo(() => {
	const index = useRef(0);
	const out = useRef('');
	const r = 15;

	const render = useCallback(() => {
		const x = Math.cos((Math.PI / 180) * index.current) * r;
		const y = Math.sin((Math.PI / 180) * index.current * 2) * (r * 0.5);

		out.current += `${Math.round((index.current / 360) * 100)}%{transform: translateX(${
			x.toFixed(2) - r
		}px) translateY(${y.toFixed(2)}px)}\n`;

		index.current += 3.6;
		if (index.current <= 360) requestAnimationFrame(render);
		else {
			navigator.clipboard?.writeText?.(out).then(
				() => alert('網址已經複製到剪貼簿'),
				() => alert('剪貼簿功能不支援，請直接到網址列複製'),
			);
		}
	}, []);
	return (
		<button
			onClick={() => {
				render();
			}}
			type='button'
		>
			copy
		</button>
	);
});
export default TransitionKeyFrame;

export const EmptyString = (value) => value !== '';
