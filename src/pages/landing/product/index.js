import { memo } from 'react';
import Container from '../../../components/container';
import { ProductList } from '../config';
import './index.less';

const Product = memo(() => (
	<div className='Product'>
		<div className='symbols'>
			{[...new Array(3).keys()].map((i) => (
				<div key={`symbols${i}`} />
			))}
		</div>
		<Container>
			<div className='flex w-full flex-col items-center justify-center space-x-8 lg:flex-row'>
				{ProductList.map((item, index) => (
					<div key={JSON.stringify(item)} className='item'>
						<div className={`img image-${index}`} />
						<div className={`text${item.color ? ' strawberry' : ''}`}>
							<div className='name'>
								<span className='font-MiBold'>明治香菇造型餅乾</span>
								{`${item.flavor}口味`}
							</div>
							<div className='description'>
								{item.description.map((text) => (
									<div key={text}>{text}</div>
								))}
							</div>
						</div>
					</div>
				))}
			</div>
		</Container>
	</div>
));
export default Product;
