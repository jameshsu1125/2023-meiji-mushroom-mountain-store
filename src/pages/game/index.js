import { memo, useState } from 'react';
import { GameContext, GameState } from './config';
import WebGL from './webgl';

const Landing = memo(() => {
	const value = useState(GameState);

	return (
		<GameContext.Provider value={value}>
			<div className='Game'>
				<WebGL />
			</div>
		</GameContext.Provider>
	);
});
export default Landing;
