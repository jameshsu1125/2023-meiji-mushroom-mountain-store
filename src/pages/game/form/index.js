import Click from 'lesca-click';
import { memo, useCallback, useContext, useEffect, useMemo, useRef } from 'react';
import RegularButton from '../../../components/button';
import { RespondContainer } from '../../../components/container';
import RegularInput from '../../../components/input';
import Remark from '../../../components/remark';
import Symbols from '../../../components/symbols';
import Terms from '../../../components/terms';
import useSaveUserInfo from '../../../hooks/useSaveUserInfo';
import { USER_INFO_NAME } from '../../../settings/constant';
import { GameContext, GamePage } from '../config';
import './index.less';
import Scrollable from '../../../components/scrollable';

const GameForm = memo(() => {
	const termRef = useRef();
	const [res, fetcher] = useSaveUserInfo();
	const [, setState] = useContext(GameContext);
	const labelName = useMemo(() => Object.entries(USER_INFO_NAME).map((e) => e), []);
	useEffect(() => {
		if (res) {
			console.log(res);
			if (res.Result) setState((S) => ({ ...S, page: GamePage.submitted }));
			else alert(res.MessageList.join(', '));
		}
	}, [res]);

	useEffect(() => {
		Click.addPreventExcept('.GameForm');
	}, []);

	const onSubmit = useCallback((e) => {
		e.preventDefault();
		const agree = termRef.current.value();
		const formData = new FormData(e.target);
		formData.append('agree', agree ? '1' : '0');
		fetcher(Object.fromEntries([...formData]));
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
