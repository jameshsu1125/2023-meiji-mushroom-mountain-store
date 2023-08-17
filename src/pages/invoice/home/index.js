import Click from 'lesca-click';
import { memo, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import RegularButton from '../../../components/button';
import Container from '../../../components/container';
import RegularInput from '../../../components/input';
import Remark from '../../../components/remark';
import Terms from '../../../components/terms';
import useSaveInvoice from '../../../hooks/useSaveInvoice';
import { RespondBreakPoint } from '../../../settings/config';
import { INVOICE_INFO_NAME } from '../../../settings/constant';
import { InvoiceContext, InvoicePage } from '../config';
import './index.less';

const InvoiceHome = memo(() => {
	const termRef = useRef();
	const [res, fetcher] = useSaveInvoice();
	const [, setState] = useContext(InvoiceContext);
	const labelName = useMemo(() => Object.entries(INVOICE_INFO_NAME).map((e) => e), []);
	const [maxWidth, setMaxWidth] = useState({ maxWidth: '1024px' });

	useEffect(() => {
		if (res) {
			console.log(res);
			setState((S) => ({ ...S, page: InvoicePage.submitted }));
		}
	}, [res]);

	useEffect(() => {
		Click.addPreventExcept('.InvoiceHome');
		const resize = () => {
			const { innerWidth } = window;
			if (innerWidth > RespondBreakPoint.md) setMaxWidth({ maxWidth: '500px' });
			else setMaxWidth({ maxWidth: '1024px' });
		};
		resize();
		window.addEventListener('resize', resize);
		return () => window.removeEventListener('resize', resize);
	}, []);

	const onSubmit = useCallback((e) => {
		e.preventDefault();
		const agree = termRef.current.value();
		const formData = new FormData(e.target);
		formData.append('agree', agree ? '1' : '0');

		fetcher(Object.fromEntries([...formData]));
	}, []);

	return (
		<div className='InvoiceHome'>
			<Container {...{ ...maxWidth }}>
				<div className='title' />
				<form onSubmit={onSubmit}>
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
							<RegularInput labelName={labelName[2]} placeholder='請選擇' type='select' required />
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
							<RegularInput
								labelName={labelName[6]}
								placeholder='英文2碼＋數字8碼'
								type='text'
								required
							/>
							<RegularInput
								labelName={labelName[7]}
								placeholder='數字4碼'
								type='text'
								required
								code
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
			</Container>
		</div>
	);
});
export default InvoiceHome;
