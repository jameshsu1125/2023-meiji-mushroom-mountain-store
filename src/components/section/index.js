import { memo } from 'react';
import './index.less';

const Section = memo(({ children, id }) => (
	<section className='Section relative flex w-full items-center justify-center'>
		<div id={id} className='mark' />
		{children}
	</section>
));
export default Section;
