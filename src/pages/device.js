import { createRoot } from 'react-dom/client';
import '../settings/global.less';
import { useEffect, useState } from 'react';

const App = () => {
	const [size, setSize] = useState({ width: window.innerWidth, height: window.innerHeight });

	useEffect(() => {
		const resize = () => {
			setSize({ width: window.innerWidth, height: window.innerHeight });
		};
		resize();
		window.addEventListener('resize', resize);
		return () => window.removeEventListener('resize', resize);
	}, []);

	return (
		<div className='App'>
			<div className='w-full h-full flex justify-center items-center text-7xl'>{`${size.width}x${size.height}`}</div>
		</div>
	);
};

createRoot(document.getElementById('app')).render(<App />);
