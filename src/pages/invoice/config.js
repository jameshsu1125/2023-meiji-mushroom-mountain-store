import { createContext } from 'react';

export const InvoiceSteps = { unset: 0 };
export const InvoicePage = { home: '/home', submitted: '/submitted' };
export const InvoiceState = { steps: InvoiceSteps.unset, page: InvoicePage.home };
export const InvoiceContext = createContext(InvoiceState);
