import OnloadProvider from 'lesca-react-onload';
import QueryString from 'lesca-url-parameters';
import useTween, { Bezier } from 'lesca-use-tween';
import { memo, useEffect, useState } from 'react';
import RegularButton from '../../../components/button';
import Container from '../../../components/container';
import { RespondBreakPoint } from '../../../settings/config';
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

const InvoiceSubmitted = memo(() => {
	// const [, setState] = useContext(GameContext);
	const [transition, setTransition] = useState(TRANSITION.unset);
	const [maxWidth, setMaxWidth] = useState({ maxWidth: '1024px' });
	useEffect(() => {
		const resize = () => {
			const { innerWidth } = window;

			if (innerWidth > RespondBreakPoint.md) {
				setMaxWidth({ maxWidth: '500px' });
			} else setMaxWidth({ maxWidth: '1024px' });
		};
		resize();
		window.addEventListener('resize', resize);
		return () => window.removeEventListener('resize', resize);
	}, []);

	return (
		<OnloadProvider onload={() => setTransition(TRANSITION.fadeIn)}>
			<div className='InvoiceHome'>
				<Container {...{ ...maxWidth }}>
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
									window.location.href = QueryString.root();
								}}
							>
								回到主頁
							</RegularButton>
							<RegularButton
								width='170px'
								maxWidth='100%'
								onClick={() => {
									// setState((S) => ({ ...S, page: GamePage.home }));
									window.location.reload();
								}}
							>
								繼續採菇
							</RegularButton>
						</div>
					</div>
				</Container>
			</div>
		</OnloadProvider>
	);
});
export default InvoiceSubmitted;
