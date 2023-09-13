import Click from 'lesca-click';
import Fetcher, { contentType, formatType } from 'lesca-fetcher';
import { Suspense, lazy, memo, useMemo, useReducer } from 'react';
import { createRoot } from 'react-dom/client';
import { Context, initialState, reducer } from '../settings/config';
import '../settings/global.less';
import TransitionKeyFrame from '../settings/misc';

Click.install();
Fetcher.install({
	hostUrl: process.env.API,
	contentType: contentType.JSON,
	formatType: formatType.JSON,
});

const Pages = memo(() => {
	const Page = useMemo(() => {
		const target = '/free';
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
				<Pages />
			</Context.Provider>
			<TransitionKeyFrame />
		</div>
	);
};

createRoot(document.getElementById('app')).render(<App />);
