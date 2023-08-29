import { memo, useContext } from 'react';
import { Context } from '../../settings/config';
import { ACTION } from '../../settings/constant';
import './index.less';

const Background = () => (
	<div className='absolute top-0 h-full w-full bg-backgroundColor opacity-90' />
);
const Text = ({ children }) => <span className='relative text-textColor'>{children}</span>;
const LoadingProcess = memo(() => {
	const [context] = useContext(Context);
	const data = context[ACTION.loadingProcess];

	return (
		<div className='LoadingProcess fixed top-0 z-40 flex h-full w-full flex-col items-center justify-center space-y-3'>
			<Background />
			<div className='character' />
			<div className='dots'>
				{[...new Array(3).keys()].map((index) => (
					<div key={`dot${index}`} />
				))}
			</div>
			{data.body && <Text>{data.body}</Text>}
		</div>
	);
});
export default LoadingProcess;
