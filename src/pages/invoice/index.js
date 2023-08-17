import { Suspense, lazy, memo, useMemo, useState } from 'react';
import Section from '../../components/section';
import Symbols from '../../components/symbols';
import { InvoiceContext, InvoicePage, InvoiceState } from './config';
import './index.less';

const Invoice = memo(() => {
	const value = useState(InvoiceState);
	const { page } = value[0];

	const Pages = useMemo(() => {
		const [target] = Object.values(InvoicePage).filter((data) => data === page);
		const Element = lazy(() => import(`.${target}/`));
		if (target) {
			return (
				<Suspense fallback=''>
					<Section>
						<Element />
					</Section>
				</Suspense>
			);
		}
		return '';
	}, [page]);

	return (
		<div className='Invoice'>
			<Symbols />
			<InvoiceContext.Provider value={value}>{Pages}</InvoiceContext.Provider>
		</div>
	);
});
export default Invoice;
