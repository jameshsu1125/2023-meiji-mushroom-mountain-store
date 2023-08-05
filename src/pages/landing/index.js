import { memo, useState } from 'react';
import { LandingContext, LandingState } from './config';
import Container from '../../components/container';
import Navigation from '../../components/navigation';

const Landing = memo(() => {
	const value = useState(LandingState);

	return (
		<LandingContext.Provider value={value}>
			<Navigation />
			<Container>
				<div className='Landing'>asd</div>
			</Container>
		</LandingContext.Provider>
	);
});
export default Landing;
