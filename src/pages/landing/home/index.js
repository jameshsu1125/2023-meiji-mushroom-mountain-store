/* eslint-disable react/jsx-one-expression-per-line */
import { memo, useEffect, useState } from 'react';
import Article from '../../../components/article';
import Dialog from '../../../components/dialog';
import './index.less';
import Container from '../../../components/container';
import RegularButton from '../../../components/button';
import { MenuState, RespondBreakPoint } from '../../../settings/config';

const Prospect = ({ children }) => <div className='prospect'>{children}</div>;
const Clouds = () => (
	<>
		<div className='cloud-1' />
		<div className='cloud-2' />
		<div className='cloud-3' />
	</>
);

const Date = () => (
	<div className='my-3 flex w-full flex-row items-end justify-center text-center font-MiBold'>
		<div className='text-2xl lg:text-lg'>2023</div>
		<div className='ml-1 text-6xl lg:text-5xl'>9.20</div>
		<div className='text-2xl lg:text-lg'>（三）</div>
		<div className='hr w-24' />
		<div className='ml-1 text-6xl lg:text-5xl'>11.19</div>
		<div className='text-2xl lg:text-lg'>（日）</div>
	</div>
);

const Home = memo(() => {
	const [margin, setMargin] = useState({ marginTop: '360px', marginBottom: '150px' });
	const [width, setWidth] = useState(window.innerWidth);

	useEffect(() => {
		const resize = () => {
			const { innerWidth } = window;
			setWidth(innerWidth);
			if (innerWidth > RespondBreakPoint.md) {
				setMargin({ marginTop: '360px', marginBottom: '150px' });
			} else setMargin({ marginTop: '360px', marginBottom: '250px' });
		};
		resize();
		window.addEventListener('resize', resize);
		return () => window.removeEventListener('resize', resize);
	}, []);

	return (
		<div className='Home'>
			<Container>
				<Article position='relative'>
					<Dialog {...margin}>
						<div className='pattern' />
						<div className='flex flex-col items-center py-7 text-center lg:py-7'>
							<Date />
							<div className='my-1 font-MiRegular text-3xl leading-10 lg:text-2xl lg:leading-8'>
								<span className='font-MiBold'>玩遊戲</span>
								或單次
								<span className='font-MiBold'>買明治香菇造型餅乾</span>
								{width <= RespondBreakPoint.md && <br />}
								<span className='text-2xl lg:text-xl'>(巧克力口味/草莓口味)</span>
								{width > RespondBreakPoint.md && <br />}
								指定盒裝品項任兩件
								{width > RespondBreakPoint.md && '，'}
								{width <= RespondBreakPoint.md && <br />}
								<span className='font-MiBold'>登錄發票</span>
								就有機會將熱銷3C、豪華住宿
								{width <= RespondBreakPoint.md && <br />}等{width > RespondBreakPoint.md && <br />}
								多項好禮帶回家！
							</div>
							<div className='product mb-10 mt-3' />
						</div>
						<div className='buttonGroup'>
							<div>
								<RegularButton
									onClick={() => {
										window.location.href = MenuState.data[1].page;
									}}
									width='160px'
								>
									玩遊戲
								</RegularButton>
								<RegularButton
									width='160px'
									onClick={() => {
										window.location.href = MenuState.data[2].page;
									}}
								>
									登錄發票
								</RegularButton>
							</div>
						</div>
						<Prospect>
							<Clouds />
						</Prospect>
					</Dialog>
				</Article>
			</Container>
		</div>
	);
});
export default Home;
