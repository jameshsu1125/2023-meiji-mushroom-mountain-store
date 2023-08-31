import { memo } from 'react';
import Article from '../../../components/article';
import Container from '../../../components/container';
import './index.less';

const Retail = memo(() => (
	<div className='Retail'>
		<Container maxWidth='1024px'>
			<Article>
				<div className='w-full pt-20'>
					<div className='w-full text-center font-MiSemibold text-4xl lg:text-3xl'>購買通路</div>
				</div>
				<div className='w-full p-20'>
					<div className='logos' />
				</div>
			</Article>
		</Container>
	</div>
));
export default Retail;
