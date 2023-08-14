import { memo, useCallback, useState } from 'react';
import { MenuState } from '../../settings/config';
import Container from '../container';
import Drawer from './drawer';
import './index.less';

const Logo = () => <div className='logo' />;

const MenuButton = ({ name, page, navigate }) => (
	<button onClick={() => navigate?.(page)} type='button'>
		{name}
	</button>
);

const Menu = ({ drawer, setDrawer, navigate }) => (
	<div className='menu'>
		<div className='hidden lg:block'>
			{MenuState.data.map((item) => (
				<MenuButton
					key={JSON.stringify(item)}
					page={item.page}
					name={item.name}
					navigate={navigate}
				/>
			))}
		</div>
		<div className='block lg:hidden'>
			<button
				className={`burger${drawer ? ' active' : ''}`}
				onClick={() => {
					setDrawer((S) => !S);
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

const Navigation = memo(() => {
	const [drawer, setDrawer] = useState(false);

	const navigate = useCallback((p) => {
		window.location.href = p;
	}, []);

	return (
		<div className='Navigation'>
			{drawer && <Drawer navigate={navigate} setDrawer={setDrawer} />}
			<Container>
				<div className='flex h-[134px] w-full items-center justify-between bg-white px-5 lg:h-[80px] xl:px-0'>
					<Logo />
					<Menu drawer={drawer} setDrawer={setDrawer} navigate={navigate} />
				</div>
			</Container>
		</div>
	);
});
export default Navigation;
