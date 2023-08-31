import { memo, useEffect, useRef } from 'react';
import './index.less';

let timeout;

const Scrollable = memo(({ children, instruct = false }) => {
	const ref = useRef();
	useEffect(() => {
		if (instruct) {
			timeout = setTimeout(() => {
				ref.current?.scrollTo(0, 800);
				setTimeout(() => {
					ref.current?.scrollTo(0, 0);
				}, 800);
			}, 2000);

			const scroll = () => {
				clearTimeout(timeout);
				ref.current.removeEventListener('scroll', scroll);
			};

			ref.current.addEventListener('scroll', scroll);
		}
		return () => clearTimeout(timeout);
	}, [instruct]);
	return (
		<div ref={ref} className='Scrollable'>
			<div className='w-full h-full flex flex-col justify-start items-center pt-12 lg:pt-5'>
				{children}
			</div>
		</div>
	);
});
export default Scrollable;
