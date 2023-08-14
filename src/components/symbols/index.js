import { memo } from 'react';
import './index.less';

const Symbols = memo(() => (
	<div className='Symbols'>
		{[...new Array(3).keys()].map((index) => (
			<div key={`symbols${index}`} />
		))}
	</div>
));
export default Symbols;
