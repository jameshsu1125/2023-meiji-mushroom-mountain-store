import Click from 'lesca-click';
import OnloadProvider from 'lesca-react-onload';
import QueryString from 'lesca-url-parameters';
import useTween, { Bezier } from 'lesca-use-tween';
import { memo, useContext, useEffect, useState } from 'react';
import RegularButton from '../../../components/button';
import Container from '../../../components/container';
import { RespondBreakPoint } from '../../../settings/config';
import { TRANSITION } from '../../../settings/constant';
import { InvoiceContext, InvoicePage } from '../config';
import './index.less';

const Text = ({ transition }) => {
	const [style, setStyle] = useTween({ opacity: 0, y: 30 });
	useEffect(() => {
		setStyle({ opacity: 1, y: 0 }, { duration: 500, delay: 100 });
	}, [transition]);
	return (
		<div className='txt' style={style}>
			您的資料已送出
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
	const [, setState] = useContext(InvoiceContext);
	const [transition, setTransition] = useState(TRANSITION.unset);
	const [maxWidth, setMaxWidth] = useState({ maxWidth: '1024px' });
	useEffect(() => {
		Click.addPreventExcept('.InvoiceSubmitted');
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
			<div className='InvoiceSubmitted'>
				<Container {...{ ...maxWidth }}>
					<div className='w-full space-y-36 py-28'>
						<div className='flex w-full flex-col items-center justify-center space-y-10'>
							<Image transition={transition} />
							<Text transition={transition} />
						</div>
						<div className='w-full space-y-5'>
							<RegularButton
								width='200px'
								maxWidth='100%'
								onClick={() => {
									window.location.href = QueryString.root();
								}}
							>
								回到主頁
							</RegularButton>
							<RegularButton
								width='200px'
								maxWidth='100%'
								onClick={() => {
									setState((S) => ({ ...S, page: InvoicePage.home }));
								}}
							>
								繼續登錄發票
							</RegularButton>
						</div>
					</div>
				</Container>
			</div>
		</OnloadProvider>
	);
});
export default InvoiceSubmitted;
