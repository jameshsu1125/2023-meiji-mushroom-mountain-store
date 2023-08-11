import { memo } from 'react';

const Section = memo(({ children }) => (
	<section className='Section flex w-full items-center justify-center'>{children}</section>
));
export default Section;
