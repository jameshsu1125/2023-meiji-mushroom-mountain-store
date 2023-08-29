import OnloadProvider from 'lesca-react-onload';
import useTween, { Bezier } from 'lesca-use-tween';
import { memo, useEffect, useMemo } from 'react';
import { TRANSITION } from '../../../settings/constant';
import './index.less';

const Demo = memo(({ step, transition, setState, setTransition }) => {
	const [style, setStyle] = useTween({ opacity: 0, y: 50 });
	useEffect(() => {
		if (transition === TRANSITION.fadeIn) {
			setStyle({ opacity: 1, y: 0 }, { duration: 500, delay: 300 });
		} else if (transition === TRANSITION.fadeOut) {
			setStyle(
				{ opacity: 0, y: 50 },
				{
					duration: 500,
					easing: Bezier.inQuart,
					delay: 250,
					onEnd: () => {
						setState((S) => ({ ...S, step: S.step + 1 }));
					},
				},
			);
		}
	}, [transition]);

	const currentComponent = useMemo(() => {
		if (step === 0) return <div className={`demo step${step}`} />;
		return (
			<OnloadProvider key={step} onload={() => setTransition(TRANSITION.fadeIn)}>
				<div className={`demo step${step}`} />
			</OnloadProvider>
		);
	}, [step]);

	return (
		<div style={style} className='p-5'>
			{currentComponent}
		</div>
	);
});
export default Demo;
