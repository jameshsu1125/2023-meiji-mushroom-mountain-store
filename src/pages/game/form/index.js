import { memo, useContext, useEffect, useState } from 'react';
import RegularButton from '../../../components/button';
import Container from '../../../components/container';
import RegularInput from '../../../components/input';
import Remark from '../../../components/remark';
import Symbols from '../../../components/symbols';
import Terms from '../../../components/terms';
import { RespondBreakPoint } from '../../../settings/config';
import { GameContext, GamePage } from '../config';
import './index.less';

const GameForm = memo(() => {
	const [, setState] = useContext(GameContext);
	const [maxWidth, setMaxWidth] = useState({ maxWidth: '1024px' });
	useEffect(() => {
		const resize = () => {
			const { innerWidth } = window;

			if (innerWidth > RespondBreakPoint.md) {
				setMaxWidth({ maxWidth: '500px' });
			} else setMaxWidth({ maxWidth: '1024px' });
		};
		resize();
		window.addEventListener('resize', resize);
		return () => window.removeEventListener('resize', resize);
	}, []);

	return (
		<div className='GameForm'>
			<Symbols />
			<div className='w-full px-24 py-10'>
				<Container {...{ ...maxWidth }}>
					<div className='title' />
					<div className='subtitle' />
					<div className='inputs'>
						<div className='note'>欄位皆為必填</div>
						<div className='space-y-5'>
							<RegularInput label='姓名' placeholder='請輸入真實姓名' type='text' required />
							<RegularInput label='稱呼' type='radio' required />
							<RegularInput label='年齡區間' placeholder='請選擇' type='select' required />
							<RegularInput label='手機' placeholder='請輸入聯絡手機' type='tel' required />
							<RegularInput label='信箱' placeholder='請輸入E-mail' type='email' required />
						</div>
					</div>
					<div className='mb-8 mt-5 w-full'>
						<Terms />
						<Remark />
					</div>
					<RegularButton
						width='160px'
						maxWidth='100%'
						onClick={() => {
							setState((S) => ({ ...S, page: GamePage.submitted }));
						}}
					>
						確認送出
					</RegularButton>
				</Container>
			</div>
		</div>
	);
});
export default GameForm;
