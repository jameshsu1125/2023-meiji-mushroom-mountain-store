import Click from 'lesca-click';
import Fetcher, { contentType, formatType } from 'lesca-fetcher';
import { lazy, memo, Suspense, useMemo, useReducer } from 'react';
import { createRoot } from 'react-dom/client';
import LoadingProcess from '../components/loadingProcess';
import Modal from '../components/modal';
import Navigation from '../components/navigation';
import { Context, initialState, reducer } from '../settings/config';
import { ACTION } from '../settings/constant';
import '../settings/global.less';

Click.install();
Fetcher.install({
	hostUrl: process.env.API,
	contentType: contentType.JSON,
	formatType: formatType.JSON,
});

const Pages = memo(() => {
	const Page = useMemo(() => {
		const target = '/game';
		const Element = lazy(() => import(`.${target}/`));
		if (target) {
			return (
				<Suspense fallback=''>
					<Element />
				</Suspense>
			);
		}
		return '';
	}, []);
	return Page;
});

const App = () => {
	const [state, setState] = useReducer(reducer, initialState);
	const value = useMemo(() => [state, setState], [state]);
	return (
		<div className='App'>
			<Context.Provider {...{ value }}>
				<Navigation />
				<Pages />
				{state[ACTION.loadingProcess].enabled && <LoadingProcess />}
				{state[ACTION.modal].enabled && <Modal />}
			</Context.Provider>
		</div>
	);
};

createRoot(document.getElementById('app')).render(<App />);
