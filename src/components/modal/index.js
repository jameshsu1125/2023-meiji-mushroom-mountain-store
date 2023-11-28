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
		document.body.style.overflow = 'hidden';
		return () => {
			document.body.style.overflow = 'auto';
		};
	}, []);

	useEffect(() => {
		setStyle({ opacity: 1, y: 0 }, { duration: 800 });
	}, [body]);

	return (
		<div className='Modal'>
			<div className='bg' />
			<div className='dialog'>
				<div className='relative w-full h-full flex flex-col justify-start items-center space-y-4'>
					<div className='w-full flex p-5 flex-col items-end lg:items-center justify-start'>
						<div className='w-7/12 text-center lg:w-full flex flex-col justify-start items-center space-y-4'>
							<h1>開獎公告</h1>
							<h2>所有豪華回饋禮已抽出，感謝大家熱情參與！</h2>
						</div>
					</div>
					<div className='scroll'>asd</div>
				</div>
			</div>
			<span style={style}>{body}</span>
		</div>
	);
});
export default Modal;
