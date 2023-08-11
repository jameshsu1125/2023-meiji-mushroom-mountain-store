import { Dollar } from 'lesca-number';
import { memo, useEffect } from 'react';
import Dialog from '../../../components/dialog';
import { IncentiveList } from '../config';
import './desktop.less';

const Desktop = memo(({ margin }) => {
	useEffect(() => {}, []);
	return (
		<div className='Desktop'>
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
					<div className='products'>
						{IncentiveList.bill.map((item, index) => (
							<div key={JSON.stringify(item)} className='item'>
								<div className='img h-72'>
									<div className={`image-${index}`}>
										<div className='amount bg-secondary'>
											<div>{item.amount}</div>
										</div>
									</div>
								</div>
								<div className='text'>
									<div className='name'>
										{item.name.map((txt) => (
											<div key={txt}>{txt}</div>
										))}
									</div>
									<div className='price'>{`市值$${Dollar(item.price)}`}</div>
								</div>
							</div>
						))}
					</div>
					<div className='note'>*老爺酒店聯合住宿券使用辦法以活動網站為準</div>
					<div className='flag-brown'>
						<div className='flag'>
							<span>玩遊戲/登發票</span>
							都可抽
						</div>
					</div>
					<div className='products'>
						{IncentiveList.both.map((item, index) => (
							<div key={JSON.stringify(item)} className='item'>
								<div className='img h-52'>
									<div className={`image-both-${index}`}>
										<div className='amount bg-quaternary'>
											<div>{item.amount}</div>
										</div>
									</div>
								</div>
								<div className='text'>
									<div className='name'>
										{item.name.map((txt) => (
											<div key={txt}>{txt}</div>
										))}
									</div>
									{item.price && <div className='price'>{`市值$${Dollar(item.price)}`}</div>}
								</div>
							</div>
						))}
					</div>
				</div>
				<div className='remark'>
					<div className='dialog'>
						天天
						<span className='mr-2 font-MiHeavy'>玩遊戲</span>
						天天
						<span className='mr-2 font-MiHeavy'>登發票</span>
						<span className='font-MiBold text-secondary'>累積多重好禮中獎率！</span>
					</div>
				</div>
			</Dialog>
			<div className='symbols'>
				<div>
					{[...new Array(3).keys()].map((e) => (
						<div key={`symbol${e}`} />
					))}
				</div>
			</div>
		</div>
	);
});
export default Desktop;
