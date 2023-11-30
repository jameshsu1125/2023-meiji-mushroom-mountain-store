import Click from 'lesca-click';
import Gtag from 'lesca-gtag';
import QueryString from 'lesca-url-parameters';
import { Suspense, lazy, memo, useContext, useEffect, useMemo, useReducer } from 'react';
import { createRoot } from 'react-dom/client';
import LoadingProcess from '../components/loadingProcess';
import Modal from '../components/modal';
import Navigation from '../components/navigation';
import { Context, WINNER_DATE, initialState, reducer } from '../settings/config';
import { ACTION, PAGE } from '../settings/constant';
import '../settings/global.less';

Click.install();
Gtag.install(process.env.GA_ID);

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

	useEffect(() => {
		const now = Date.now();
		const currentTime = WINNER_DATE.getTime();
		if (now > currentTime || QueryString.get('modal') === 'true') {
			setState({ type: ACTION.modal, state: { enabled: true } });
		}
	}, []);

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
