import { memo } from 'react';
import './index.less';

const Article = memo(({ children, position = 'initial' }) => (
	<div className='Article' style={{ position }}>
		{children}
	</div>
));
export default Article;
