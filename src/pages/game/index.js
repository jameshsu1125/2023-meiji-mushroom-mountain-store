import { Suspense, lazy, memo, useMemo, useState } from 'react';
import { GameContext, GamePage, GameState } from './config';
import './index.less';

const Game = memo(() => {
	const value = useState(GameState);
	const { page } = value[0];

	const Pages = useMemo(() => {
		const [target] = Object.values(GamePage).filter((data) => data === page);
		const Element = lazy(() => import(`.${target}/`));

		if (target) {
			return (
				<Suspense fallback=''>
					<Element />
				</Suspense>
			);
		}
		return '';
	}, [page]);

	return (
		<GameContext.Provider value={value}>
			<div className='Game'>
				<div className='symbols'>
					{[...new Array(3).keys()].map((index) => (
						<div key={`cloud${index}`} />
					))}
				</div>
				{Pages}
			</div>
		</GameContext.Provider>
	);
});
export default Game;
