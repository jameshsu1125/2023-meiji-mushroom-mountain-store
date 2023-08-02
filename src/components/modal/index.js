import useTween from 'lesca-use-tween';
import { memo, useContext, useEffect } from 'react';
import { Context } from '../../settings/config';
import { ACTION } from '../../settings/constant';
import './index.less';

const Modal = memo(() => {
	const [context, setContext] = useContext(Context);
	const { body, time } = context[ACTION.modal];
	const [style, setStyle] = useTween({ opacity: 0, y: 10 });

	useEffect(() => {
		setStyle(
			{ opacity: 1, y: 0 },
			{
				duration: 800,
				onEnd: () => {
					setTimeout(() => {
						setContext({ type: ACTION.modal, state: { enabled: false } });
					}, time);
				},
			},
		);
	}, [body]);

	return (
		<div className='Modal'>
			<span style={style}>{body}</span>
		</div>
	);
});
export default Modal;
