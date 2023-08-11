import { Suspense, lazy, memo, useMemo, useState } from 'react';
import Navigation from '../../components/navigation';
import Section from '../../components/section';
import { LandingContext, LandingState, Sections } from './config';
import './index.less';

const Landing = memo(() => {
	const value = useState(LandingState);

	const Pages = useMemo(() => {
		const pages = Sections.map((target) => {
			const Element = lazy(() => import(`.${target.src}/`));
			if (Element) {
				return (
					<Suspense fallback='' key={target.src}>
						<Section>
							<Element />
						</Section>
					</Suspense>
				);
			}
			return '';
		});
		return pages;
	}, []);

	return (
		<LandingContext.Provider value={value}>
			<Navigation />
			<div className='Landing'>{Pages}</div>
		</LandingContext.Provider>
	);
});
export default Landing;
