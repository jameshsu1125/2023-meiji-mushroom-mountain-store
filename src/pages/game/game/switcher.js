/* eslint-disable jsx-a11y/control-has-associated-label */
import OnloadProvider from 'lesca-react-onload';
import useTween, { Bezier } from 'lesca-use-tween';
import { memo, useCallback, useContext, useEffect, useState } from 'react';
import { RespondContainer } from '../../../components/container';
import { TRANSITION } from '../../../settings/constant';
import './switcher.less';
import { GameContext } from '../config';

const Button = ({ transition }) => {
	const [state] = useContext(GameContext);
	const { sounds } = state;
	const { isMute } = sounds;
	const [style, setStyle] = useTween({ opacity: 0, y: -100 });

	const [, setCounter] = useState(0);

	useEffect(() => {
		if (transition === TRANSITION.fadeIn) {
			setStyle({ opacity: 1, y: 0 }, { duration: 500, easing: Bezier.outBack });
		}
	}, [transition]);

	const onClick = useCallback(() => {
		setCounter((S) => S + 1);
		sounds.switch();
	}, [sounds]);

	return <button style={style} className={isMute ? 'off' : ''} type='button' onClick={onClick} />;
};

const Switcher = memo(() => {
	const [transition, setTransition] = useState(TRANSITION.unset);
	const [scale, setScale] = useState(1);
	useEffect(() => {
		const resize = () => {
			const radio = window.innerHeight / 808;
			setScale(radio > 1 ? 1 : radio);
		};
		resize();
		window.addEventListener('resize', resize);
		return () => window.removeEventListener('resize', resize);
	}, []);
	return (
		<OnloadProvider onload={() => setTransition(TRANSITION.fadeIn)}>
			<div className='Switcher' style={{ transform: `scale(${scale})` }}>
				<RespondContainer maxWidth='500px' fitHeight={false}>
					<div className='px-10 py-4 lg:py-[9px] h-full flex justify-end flex-row items-center'>
						<Button transition={transition} />
					</div>
				</RespondContainer>
			</div>
		</OnloadProvider>
	);
});
export default Switcher;
