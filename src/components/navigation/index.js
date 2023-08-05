import { memo, useEffect, useState } from 'react';
import { MenuState } from '../../settings/config';
import Container from '../container';
import Drawer from './drawer';
import './index.less';

const Logo = () => {
	useEffect(() => {}, []);
	return <div className='logo' />;
};

const MenuButton = ({ name }) => <button type='button'>{name}</button>;

const Menu = ({ setDrawer }) => {
	const [state, setState] = useState(false);
	useEffect(() => setDrawer(state), [state]);
	return (
		<div className='menu'>
			<div className='hidden lg:block'>
				{MenuState.data.map((item) => (
					<MenuButton key={JSON.stringify(item)} name={item.name} />
				))}
			</div>
			<div className='block lg:hidden'>
				<button
					className={`burger${state ? ' active' : ''}`}
					onClick={() => {
						setState((S) => !S);
					}}
					type='button'
				>
					{[...new Array(3).keys()].map((e) => (
						<div key={`burger${e}`} />
					))}
				</button>
			</div>
		</div>
	);
};

const Navigation = memo(() => {
	const [drawer, setDrawer] = useState(false);

	return (
		<div className='Navigation'>
			{drawer && <Drawer />}
			<Container>
				<div className='flex h-[134px] w-full items-center justify-between bg-white px-5 lg:h-[80px] xl:px-0'>
					<Logo />
					<Menu setDrawer={setDrawer} />
				</div>
			</Container>
		</div>
	);
});
export default Navigation;
