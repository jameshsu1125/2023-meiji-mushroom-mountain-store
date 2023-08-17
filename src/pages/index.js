import Click from 'lesca-click';
import { Suspense, lazy, memo, useContext, useMemo, useReducer } from 'react';
import { createRoot } from 'react-dom/client';
import LoadingProcess from '../components/loadingProcess';
import Modal from '../components/modal';
import Navigation from '../components/navigation';
import { Context, initialState, reducer } from '../settings/config';
import { ACTION, PAGE } from '../settings/constant';
import '../settings/global.less';

Click.install();

const Pages = memo(() => {
	const [context] = useContext(Context);
	const page = context[ACTION.page];

	const Page = useMemo(() => {
		const [target] = Object.values(PAGE).filter((data) => data === page);
		const Element = lazy(() => import(`.${target}/`));
		if (target) {
			return (
				<Suspense fallback=''>
					<Element>static pages</Element>
				</Suspense>
			);
		}
		return '';
	}, [page]);

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
