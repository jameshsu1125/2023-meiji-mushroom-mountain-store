import { Suspense, lazy, memo, useEffect, useMemo, useState } from 'react';
import Section from '../../components/section';
import { LandingContext, LandingSections, LandingState } from './config';
import './index.less';

let timeout;
const Landing = memo(() => {
	const value = useState(LandingState);

	useEffect(() => {
		timeout = setTimeout(() => {
			const target = document.getElementById(window.location.hash.slice(1));
			if (target) window.scrollTo(0, target.getBoundingClientRect().top);
		}, 300);

		const scroll = () => {
			clearTimeout(timeout);
			window.removeEventListener('scroll', scroll);
		};
		window.addEventListener('scroll', scroll);
	}, []);

	const Pages = useMemo(() => {
		const pages = LandingSections.map((target) => {
			const Element = lazy(() => import(`.${target.src}/`));

			if (Element) {
				return (
					<Suspense fallback='' key={target.src}>
						<Section id={target.src.slice(1)}>
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
			<div className='Landing'>{Pages}</div>
		</LandingContext.Provider>
	);
});
export default Landing;
