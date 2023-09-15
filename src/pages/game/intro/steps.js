import Gtag from 'lesca-gtag';
import { memo } from 'react';
import Article from '../../../components/article';
import { GtagState } from '../../../settings/config';
import { TRANSITION } from '../../../settings/constant';
import { GamePage } from '../config';
import Button from './button';
import Demo from './demo';
import Headline from './headline';
import './index.less';
import Subline from './subline';

const Steps = memo(({ transition, step, data, setState, setTransition, setGameState }) => (
	<>
		<Headline step={step} transition={transition}>
			{data.headline}
		</Headline>
		<Subline step={step} transition={transition}>
			{data.subline}
		</Subline>
		<Article position='relative'>
			<Demo step={step} transition={transition} setState={setState} setTransition={setTransition} />
			<div className='relative -mt-20 px-20 flex flex-col items-start justify-center space-y-5'>
				<Button
					index={0}
					transition={transition}
					onClick={() => {
						Gtag.event(GtagState.game.遊戲解說頁.page, GtagState.game.遊戲解說頁.event.下一步);
						setTransition(TRANSITION.fadeOut);
					}}
				>
					下一步
				</Button>
				<Button
					index={1}
					transition={transition}
					onClick={() => {
						Gtag.event(GtagState.game.遊戲解說頁.page, GtagState.game.遊戲解說頁.event.開始採菇);
						setGameState((S) => {
							S.sounds?.loadSound?.(() => {
								setGameState((SS) => ({ ...SS, soundsLoaded: true }));
							});
							return { ...S, page: GamePage.game };
						});
					}}
				>
					開始採菇
				</Button>
			</div>
		</Article>
	</>
));
export default Steps;
