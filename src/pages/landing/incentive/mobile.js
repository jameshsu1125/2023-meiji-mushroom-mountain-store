import { Dollar } from 'lesca-number';
import { memo } from 'react';
import Slider from 'react-slick';
import Dialog from '../../../components/dialog';
import { IncentiveList } from '../config';
import './mobile.less';

const BillCarousel = () => {
	const settings = {
		dots: true,
		infinite: true,
		speed: 500,
		slidesToShow: 1,
		slidesToScroll: 1,
		arrows: false,
	};

	return (
		<div className='w-full'>
			<Slider {...settings}>
				{IncentiveList.bill.map((item, index) => (
					<div key={JSON.stringify(item)} className='item'>
						<div className='img'>
							<div className={`image-${index}`}>
								<div className='amount bg-secondary'>
									<div>{item.amount}</div>
								</div>
							</div>
						</div>
						<div className='text'>
							<div className='name'>
								{item.name.map((e) => (
									<div key={e}>{e}</div>
								))}
							</div>
							{item.price && <div className='price'>{`市值$${Dollar(item.price)}`}</div>}
						</div>
					</div>
				))}
			</Slider>
		</div>
	);
};

const BothCarousel = () => {
	const settings = {
		dots: true,
		infinite: true,
		speed: 500,
		slidesToShow: 1,
		slidesToScroll: 1,
		arrows: false,
	};

	return (
		<div className='w-full'>
			<Slider {...settings}>
				{IncentiveList.both.map((item, index) => (
					<div key={JSON.stringify(item)} className='w-full'>
						<div className='item'>
							<div className='img'>
								<div className={`image-${index}`}>
									<div className='amount bg-secondary'>
										<div>{item.amount}</div>
									</div>
								</div>
							</div>
							<div className='text'>
								<div className='name'>
									{item.name.map((e) => (
										<div key={e}>{e}</div>
									))}
								</div>
								{item.price && <div className='price'>{`市值$${Dollar(item.price)}`}</div>}
							</div>
						</div>
					</div>
				))}
			</Slider>
		</div>
	);
};

const Mobile = memo(({ margin }) => (
	<div className='Mobile'>
		<Dialog {...{ ...margin, maxWidth: 'auto' }}>
			<div className='inner'>
				<div className='title' />
				<div className='subtitle'>
					<div>
						<span className='round'>玩</span>
						<span className='font-MiSemibold'>遊戲</span>
						<div className='cross' />
						<span className='round'>登</span>
						<span className='mr-3 font-MiSemibold'>發票</span>
					</div>
					<div className='text-5xl'>
						<span className='font-MiHeavy text-secondary'>豪華回饋禮</span>
						等你抽！
					</div>
				</div>
				<div className='flag-red'>
					<div className='flag'>
						<span>發票登錄</span>
						專屬限定
					</div>
				</div>
				<BillCarousel />
			</div>
		</Dialog>
		<Dialog maxWidth='auto' marginBottom='100px'>
			<div className='inner-both'>
				<div className='flag-brown'>
					<div className='flag'>
						<span>玩遊戲/登發票</span>
						都可抽
					</div>
				</div>
				<BothCarousel />
			</div>
		</Dialog>
		<div className='remark'>
			<div />
			<div className='dialog'>
				<div>
					天天
					<span className='mr-2 font-MiHeavy'>玩遊戲</span>
					天天
					<span className='mr-2 font-MiHeavy'>登發票</span>
				</div>
				<div className='font-MiBold text-secondary'>累積多重好禮中獎率！</div>
			</div>
		</div>
		<div className='symbols'>
			{[...new Array(2).keys()].map((e) => (
				<div key={`symbol${e}`} />
			))}
		</div>
	</div>
));
export default Mobile;
