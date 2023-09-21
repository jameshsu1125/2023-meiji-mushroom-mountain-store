import Click from 'lesca-click';
import Gtag from 'lesca-gtag';
import { memo, useCallback, useContext, useEffect, useMemo, useRef } from 'react';
import RegularButton from '../../../components/button';
import { RespondContainer } from '../../../components/container';
import RegularInput from '../../../components/input';
import Remark from '../../../components/remark';
import Scrollable from '../../../components/scrollable';
import Symbols from '../../../components/symbols';
import Terms from '../../../components/terms';
import useSaveUserInfo from '../../../hooks/useSaveUserInfo';
import { GtagState } from '../../../settings/config';
import { USER_INFO_NAME } from '../../../settings/constant';
import { GameContext, GamePage, SoundsTrackName } from '../config';
import './index.less';

const GameForm = memo(() => {
	const termRef = useRef();
	const [respond, fetcher] = useSaveUserInfo();
	const [state, setState] = useContext(GameContext);
	const { sounds } = state;
	const labelName = useMemo(() => Object.entries(USER_INFO_NAME).map((e) => e), []);

	const onSubmit = useCallback((e) => {
		e.preventDefault();
		const agree = termRef.current.value();
		const formData = new FormData(e.target);
		formData.append('agree', agree ? '1' : '0');
		fetcher(Object.fromEntries([...formData]));
		Gtag.event(GtagState.game.填單抽回饋禮頁.page, GtagState.game.填單抽回饋禮頁.event.確認送出);
	}, []);

	useEffect(() => {
		if (respond) {
			if (respond.Result) setState((S) => ({ ...S, page: GamePage.submitted }));
			else alert(respond.MessageList.join(', '));
		}
	}, [respond]);

	useEffect(() => {
		sounds?.tracks[SoundsTrackName.bgm]?.sound.fade(
			sounds.isMute ? 0 : sounds.sounds[0].volume,
			0,
			1000,
		);
		Click.addPreventExcept('.GameForm');
	}, []);

	useEffect(() => {
		Gtag.pv(GtagState.game.填單抽回饋禮頁.page);
	}, []);

	return (
		<div className='GameForm'>
			<Scrollable>
				<Symbols />
				<div className='w-full px-24 py-10'>
					<RespondContainer>
						<div className='title' />
						<form onSubmit={onSubmit}>
							<div className='subtitle' />
							<div className='inputs'>
								<div className='note'>欄位皆為必填</div>
								<div className='space-y-5'>
									<RegularInput
										labelName={labelName[0]}
										placeholder='請輸入真實姓名'
										type='text'
										required
									/>
									<RegularInput labelName={labelName[1]} type='radio' required />
									<RegularInput
										labelName={labelName[2]}
										placeholder='請選擇'
										type='select'
										required
									/>
									<RegularInput
										labelName={labelName[3]}
										placeholder='請輸入聯絡手機'
										type='tel'
										required
									/>
									<RegularInput
										labelName={labelName[4]}
										placeholder='請輸入E-mail'
										type='email'
										required
									/>
								</div>
							</div>
							<div className='mb-8 mt-5 w-full'>
								<Terms ref={termRef} />
								<Remark />
							</div>
							<RegularButton width='160px' maxWidth='100%' type='submit'>
								確認送出
							</RegularButton>
						</form>
					</RespondContainer>
				</div>
			</Scrollable>
		</div>
	);
});
export default GameForm;
