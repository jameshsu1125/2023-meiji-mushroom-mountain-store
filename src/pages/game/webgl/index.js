import { memo, useEffect, useRef } from 'react';
import GL from './gl';

const WebGL = memo(() => {
	const ref = useRef();

	useEffect(() => {
		new GL(ref.current);
	}, []);

	return <div ref={ref} className='h-full w-full' />;
});
export default WebGL;
