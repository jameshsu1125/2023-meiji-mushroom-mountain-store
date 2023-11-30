/* eslint-disable react/jsx-one-expression-per-line */
import Click from 'lesca-click';
import OnloadProvider from 'lesca-react-onload';
import useTween from 'lesca-use-tween';
import { memo, useContext, useEffect, useMemo, useState } from 'react';
import { AwardWinners, Context } from '../../settings/config';
import './index.less';
import { ACTION, TRANSITION } from '../../settings/constant';

const Background = ({ transition }) => {
	const [style, setStyle] = useTween({ opacity: 0 });
	useEffect(() => {
		if (transition === TRANSITION.fadeIn) {
			setStyle({ opacity: 1 }, 500);
		}
	}, [transition]);
	return <div style={style} id='modalClose' className='bg' />;
};

const Dialog = ({ winner, transition }) => {
	const [style, setStyle] = useTween({ opacity: 0, y: 100 });
	useEffect(() => {
		if (transition === TRANSITION.fadeIn) {
			setStyle({ opacity: 1, y: 0 }, { delay: 500, duration: 1000 });
		}
	}, [transition]);
	return (
		<div style={style} className='dialog'>
			<div className='w-full px-8'>
				<div className='relative w-full h-full flex flex-col justify-start items-center space-y-4'>
					<div className='w-full flex p-5 flex-col items-end justify-start'>
						<div className='w-9/12 text-center lg:w-full flex flex-col justify-start items-center space-y-4'>
							<h1>開獎公告</h1>
							<h2>
								<span>所有豪華回饋禮已抽出</span>
								<span className='hidden lg:block'>，</span>
								<span>感謝大家熱情參與！</span>
							</h2>
						</div>
					</div>
					<div className='md-character' />
					<div className='scroll'>
						{Object.entries(winner).map((item) => {
							const [award, user] = item;
							const blockquote = user.map((each) => (
								<p key={award + JSON.stringify(each)}>{`${each.user} ${each.tel}`}</p>
							));
							return (
								<div key={award}>
									<h3>{award}</h3>
									{blockquote}
								</div>
							);
						})}
					</div>
				</div>
				<div className='absolute top-0 right-0 p-5'>
					<div id='modalClose' className='close' />
				</div>
			</div>
			<div className='footer'>
				<div>中獎者也別忘了確認</div>
				<div>
					<span>中獎通知</span>及<span>兌獎方式</span>
					噢!
				</div>
			</div>
		</div>
	);
};

const Modal = memo(() => {
	const [, setContext] = useContext(Context);

	const [transition, setTransition] = useState(TRANSITION.unset);

	useEffect(() => {
		document.body.style.overflow = 'hidden';
		Click.add('#modalClose', () => {
			setContext({ type: ACTION.modal, state: { enabled: false } });
		});
		Click.addPreventExcept('.scroll');
		return () => {
			document.body.style.overflow = 'auto';
		};
	}, []);

	const winner = useMemo(() => {
		const currentWinner = AwardWinners.reduce((prev, next) => {
			const clonePrev = { ...prev };
			const [name, user, tel] = next;
			const awardName = prev[name];
			if (awardName === undefined) {
				clonePrev[name] = [{ user, tel }];
			} else {
				clonePrev[name].push({ user, tel });
			}
			return clonePrev;
		}, {});
		return currentWinner;
	}, []);

	return (
		<OnloadProvider onload={() => setTransition(TRANSITION.fadeIn)}>
			<div className='Modal'>
				<Background transition={transition} />
				<Dialog winner={winner} transition={transition} />
			</div>
		</OnloadProvider>
	);
});
export default Modal;
