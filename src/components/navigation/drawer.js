import { memo, useEffect } from 'react';
import './drawer.less';
import { MenuState } from '../../settings/config';

const Button = ({ name }) => <button type='button'>{name}</button>;

const Drawer = memo(() => {
	useEffect(() => {}, []);
	return (
		<div className='Drawer'>
			<div className='jacking'>
				<div className='inner'>
					{MenuState.data.map((item) => (
						<Button key={JSON.stringify(item)} name={item.name} />
					))}
				</div>
			</div>
		</div>
	);
});
export default Drawer;
