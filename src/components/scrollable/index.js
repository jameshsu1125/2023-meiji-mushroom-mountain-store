import { memo } from 'react';
import './index.less';

const Scrollable = memo(({ children }) => (
	<div className='Scrollable'>
		<div className='w-full h-full flex flex-col justify-start items-center pt-12 lg:pt-5'>
			{children}
		</div>
	</div>
));
export default Scrollable;
