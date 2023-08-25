import OnloadProvider from 'lesca-react-onload';
import { memo, useContext, useEffect, useState } from 'react';
import RegularButton from '../../../components/button';
import Container from '../../../components/container';
import { Context, RespondBreakPoint } from '../../../settings/config';
import { GameContext, GamePage, GameSteps } from '../config';
import WebGL from '../game';
import './index.less';
import { ACTION } from '../../../settings/constant';

const GameHome = memo(() => {
	const [state, setState] = useContext(GameContext);
	const [, setContext] = useContext(Context);
	const [maxWidth, setMaxWidth] = useState({ maxWidth: '1024px' });

	useEffect(() => {
		if (state.steps === GameSteps.modelLoaded) {
			setContext({ type: ACTION.loadingProcess, state: { enabled: false } });
		}
	}, [state.steps]);

	useEffect(() => {
		setContext({ type: ACTION.loadingProcess, state: { enabled: true } });
		const resize = () => {
			const { innerWidth } = window;
			if (innerWidth > RespondBreakPoint.md) setMaxWidth({ maxWidth: '500px' });
			else setMaxWidth({ maxWidth: '1024px' });
		};
		resize();
		window.addEventListener('resize', resize);
		return () => window.removeEventListener('resize', resize);
	}, []);

	return (
		<OnloadProvider
			onload={() => {
				setState((S) => ({ ...S, steps: GameSteps.loaded }));
			}}
		>
			<div className='GameHome'>
				<div className='w-full h-full flex flex-col justify-center items-center'>
					<Container {...maxWidth}>
						<div className='w-full'>
							<div className='title' />
						</div>
						<div className='w-full flex flex-col justify-start items-center space-y-5'>
							<div className='headline'>採菇達人請留步！</div>
							<div className='subLine'>
								菇菇山開園大豐收～快忙翻啦（暈）
								<br />
								熱血的你，一起來幫菇太郎採收菇菇吧！
								<br />
								還有機會帶走豪華回饋禮噢～
							</div>
						</div>
					</Container>
				</div>
				{state.steps === GameSteps.loaded && <WebGL />}
			</div>
		</OnloadProvider>
	);
});
export default GameHome;
