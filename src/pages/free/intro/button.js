import useTween from 'lesca-use-tween';
import { memo, useEffect } from 'react';
import RegularButton from '../../../components/button';
import { TRANSITION } from '../../../settings/constant';
import './index.less';
import { RespondBreakPoint } from '../../../settings/config';

const Button = memo(({ transition, children, onClick, index }) => {
	const [style, setStyle] = useTween({ opacity: 0, y: 50 });
	useEffect(() => {
		if (transition === TRANSITION.fadeIn) {
			setStyle({ opacity: 1, y: 0 }, { duration: 500, delay: 800 + index * 100 });
		} else if (transition === TRANSITION.fadeOut) {
			setStyle({ opacity: 0, y: 50 }, { duration: 500, delay: 100 - 100 * index });
		}
	}, [transition]);
	return (
		<div style={style} className='w-full'>
			<RegularButton
				maxWidth='100%'
				width={window.innerWidth >= RespondBreakPoint.md ? '130px' : '190px'}
				onClick={() => onClick?.()}
			>
				{children}
			</RegularButton>
		</div>
	);
});
export default Button;
