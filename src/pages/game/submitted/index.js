import Click from 'lesca-click';
import Gtag from 'lesca-gtag';
import OnloadProvider from 'lesca-react-onload';
import QueryString from 'lesca-url-parameters';
import useTween, { Bezier } from 'lesca-use-tween';
import { memo, useEffect, useState } from 'react';
import RegularButton from '../../../components/button';
import { RespondContainer } from '../../../components/container';
import Scrollable from '../../../components/scrollable';
import { GtagState } from '../../../settings/config';
import { TRANSITION } from '../../../settings/constant';
import './index.less';

const Text = ({ transition }) => {
	const [style, setStyle] = useTween({ opacity: 0, y: 30 });
	useEffect(() => {
		setStyle({ opacity: 1, y: 0 }, { duration: 500, delay: 100 });
	}, [transition]);
	return (
		<div className='txt' style={style}>
			您的資料已送出
			<br />
			<div className='mt-2 font-MiMedium text-primary'>感謝您幫忙採菇</div>
		</div>
	);
};

const Image = ({ transition }) => {
	const [style, setStyle] = useTween({ opacity: 0, scale: 1.2 });
	useEffect(() => {
		setStyle({ opacity: 1, scale: 1 }, { duration: 500, easing: Bezier.outBack });
	}, [transition]);
	return <div className='image' style={style} />;
};

const GameSubmitted = memo(() => {
	// const [, setState] = useContext(GameContext);
	const [transition, setTransition] = useState(TRANSITION.unset);

	useEffect(() => {
		Click.addPreventExcept('.GameSubmitted');
		Gtag.pv(GtagState.game.您的資料已送出頁.page);
	}, []);

	return (
		<OnloadProvider onload={() => setTransition(TRANSITION.fadeIn)}>
			<Scrollable>
				<div className='GameSubmitted'>
					<RespondContainer>
						<div className='w-full space-y-36 py-28'>
							<div className='flex w-full flex-col items-center justify-center space-y-10'>
								<Image transition={transition} />
								<Text transition={transition} />
							</div>
							<div className='w-full space-y-5'>
								<RegularButton
									width='170px'
									maxWidth='100%'
									onClick={() => {
										setTimeout(() => {
											window.location.href = QueryString.root();
										}, 300);
										Gtag.event(
											GtagState.game.您的資料已送出頁.page,
											GtagState.game.您的資料已送出頁.event.回到主頁,
										);
									}}
								>
									回到主頁
								</RegularButton>
								<RegularButton
									width='170px'
									maxWidth='100%'
									onClick={() => {
										// setState((S) => ({ ...S, page: GamePage.home }));
										setTimeout(() => {
											window.location.reload();
										}, 300);
										Gtag.event(
											GtagState.game.您的資料已送出頁.page,
											GtagState.game.您的資料已送出頁.event.繼續採菇,
										);
									}}
								>
									繼續採菇
								</RegularButton>
							</div>
						</div>
					</RespondContainer>
				</div>
			</Scrollable>
		</OnloadProvider>
	);
});
export default GameSubmitted;
