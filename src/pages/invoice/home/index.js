import { memo, useContext, useEffect, useState } from 'react';
import RegularButton from '../../../components/button';
import Container from '../../../components/container';
import RegularInput from '../../../components/input';
import Remark from '../../../components/remark';
import Terms from '../../../components/terms';
import { RespondBreakPoint } from '../../../settings/config';
import './index.less';
import { InvoiceContext, InvoicePage } from '../config';

const InvoiceHome = memo(() => {
	const [, setState] = useContext(InvoiceContext);

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
		<div className='InvoiceHome'>
			<Container {...{ ...maxWidth }}>
				<div className='title' />
				<div className='inputs'>
					<div className='note'>欄位皆為必填</div>
					<div className='space-y-5'>
						<RegularInput label='姓名' placeholder='請輸入真實姓名' type='text' required />
						<RegularInput label='稱呼' type='radio' required />
						<RegularInput label='年齡區間' placeholder='請選擇' type='select' required />
						<RegularInput label='手機' placeholder='請輸入聯絡手機' type='tel' required />
						<RegularInput label='信箱' placeholder='請輸入E-mail' type='email' required />
						<RegularInput label='發票號碼' placeholder='英文2碼＋數字8碼' type='text' required />
						<RegularInput label='隨機碼' placeholder='數字4碼' type='text' required code />
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
						setState((S) => ({ ...S, page: InvoicePage.submitted }));
					}}
				>
					確認送出
				</RegularButton>
			</Container>
		</div>
	);
});
export default InvoiceHome;
