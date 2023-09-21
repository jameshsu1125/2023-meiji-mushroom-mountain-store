import { memo } from 'react';
import { MenuState } from '../../settings/config';
import './drawer.less';

const Button = ({ name, page, navigate, setDrawer }) => (
	<button
		type='button'
		onClick={() => {
			navigate?.(page);
			setDrawer(false);
		}}
	>
		{name}
	</button>
);

const Drawer = memo(({ navigate, setDrawer }) => (
	<div className='Drawer'>
		<div className='jacking'>
			<div className='inner'>
				{MenuState.data.map((item) => (
					<Button
						key={JSON.stringify(item)}
						page={item.page}
						name={item.name}
						navigate={navigate}
						setDrawer={setDrawer}
					/>
				))}
			</div>
		</div>
	</div>
));
export default Drawer;
