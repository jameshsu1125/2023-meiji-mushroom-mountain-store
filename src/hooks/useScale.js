import { useEffect, useState } from 'react';

const DEFAULT_MIN_HEIGHT = 1050;

const useScale = () => {
	const [state, setState] = useState(
		window.innerHeight >= DEFAULT_MIN_HEIGHT ? 1 : window.innerHeight / DEFAULT_MIN_HEIGHT,
	);

	useEffect(() => {
		const resize = () => {
			setState(
				window.innerHeight >= DEFAULT_MIN_HEIGHT ? 1 : window.innerHeight / DEFAULT_MIN_HEIGHT,
			);
		};
		window.addEventListener('resize', resize);
		return () => window.removeEventListener('resize', resize);
	}, []);

	return [state];
};
export default useScale;
