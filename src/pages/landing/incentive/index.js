import { memo, useEffect, useState } from 'react';
import 'slick-carousel/slick/slick-theme.css';
import 'slick-carousel/slick/slick.css';
import Article from '../../../components/article';
import Container from '../../../components/container';
import { RespondBreakPoint } from '../../../settings/config';
import Desktop from './desktop';
import './index.less';
import Mobile from './mobile';

const Incentive = memo(() => {
	const [margin, setMargin] = useState({ marginTop: '130px', marginBottom: '250px' });
	const [width, setWidth] = useState(window.innerWidth);
	useEffect(() => {
		const resize = () => {
			const { innerWidth } = window;
			setWidth(innerWidth);
			if (innerWidth > RespondBreakPoint.md) {
				setMargin({ marginTop: '130px', marginBottom: '150px' });
			} else setMargin({ marginTop: '600px', marginBottom: '150px' });
		};
		resize();
		window.addEventListener('resize', resize);
		return () => window.removeEventListener('resize', resize);
	}, []);
	return (
		<div className='Incentive'>
			<Container>
				<Article>
					{(width > RespondBreakPoint.md && <Desktop margin={margin} />) || (
						<Mobile margin={margin} />
					)}
				</Article>
			</Container>
		</div>
	);
});
export default Incentive;
