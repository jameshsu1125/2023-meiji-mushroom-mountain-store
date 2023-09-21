import { memo } from 'react';
import './index.less';

const Article = memo(({ children, position = 'initial' }) => (
	<article className='Article' style={{ position }}>
		{children}
	</article>
));
export default Article;
