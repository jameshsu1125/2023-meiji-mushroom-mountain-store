import Click from 'lesca-click';
import Gtag from 'lesca-gtag';
import { memo, useCallback, useContext, useEffect, useMemo, useRef } from 'react';
import RegularButton from '../../../components/button';
import { RespondContainer } from '../../../components/container';
import RegularInput from '../../../components/input';
import Remark from '../../../components/remark';
import Terms from '../../../components/terms';
import useSaveInvoice from '../../../hooks/useSaveInvoice';
import { GtagState } from '../../../settings/config';
import { INVOICE_INFO_NAME } from '../../../settings/constant';
import { InvoiceContext, InvoicePage } from '../config';
import './index.less';

const InvoiceHome = memo(() => {
	const termRef = useRef();
	const [res, fetcher] = useSaveInvoice();
	const [, setState] = useContext(InvoiceContext);
	const labelName = useMemo(() => Object.entries(INVOICE_INFO_NAME).map((e) => e), []);

	useEffect(() => {
		if (res) {
			if (res.Result) setState((S) => ({ ...S, page: InvoicePage.submitted }));
			else alert(res.MessageList.join(', '));
		}
	}, [res]);

	useEffect(() => {
		Click.addPreventExcept('.InvoiceHome');
		Gtag.pv(GtagState.invoice.登錄發票頁.page);
		window.fbq?.('trackCustom', 'Invoice', { event: 'Invoice' });
	}, []);

	const onSubmit = useCallback((e) => {
		e.preventDefault();
		const agree = termRef.current.value();
		const formData = new FormData(e.target);
		formData.append('agree', agree ? '1' : '0');
		fetcher(Object.fromEntries([...formData]));
		Gtag.event(GtagState.invoice.登錄發票頁.page, GtagState.invoice.登錄發票頁.event.確認送出);
	}, []);

	return (
		<div className='InvoiceHome'>
			<RespondContainer>
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
			</RespondContainer>
		</div>
	);
});
export default InvoiceHome;
