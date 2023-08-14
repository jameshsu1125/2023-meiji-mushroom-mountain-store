import { useMemo } from 'react';
import './index.less';

const RandomCode = () => (
	<button
		className='randomCode'
		onClick={() => {
			window.open(
				'https://www.einvoice.nat.gov.tw/APCONSUMER/images/reanomCode.jpg?v=1e72edb8f423bb9118480a1b040c57a2',
			);
		}}
		type='button'
	>
		參考圖例
	</button>
);

const RegularInput = ({ label = 'name', placeholder = '', type = 'text', required, code }) => {
	const Element = useMemo(() => {
		switch (type) {
			case 'select':
				return (
					<div className='h-full w-full px-5'>
						<select>
							<option>{placeholder}</option>
						</select>
					</div>
				);

			case 'radio':
				return (
					<div className='flex w-full flex-row items-center justify-start space-x-5 px-5'>
						<div className='flex flex-row items-center space-x-2'>
							<input type='radio' name='gender' />
							<div className='pr-3'>先生</div>
						</div>
						<div className='flex flex-row items-center space-x-2'>
							<input type='radio' name='gender' />
							<div>小姐</div>
						</div>
					</div>
				);
			case 'text':
			case 'number':
			case 'tel':
			case 'email':
			default:
				return <input type={type} placeholder={placeholder} maxLength={type === 'tel' ? 10 : ''} />;
		}
	}, [type, placeholder]);

	const className = useMemo(() => {
		const classes = [];
		if (required) classes.push('required');
		const { length } = String(label);

		if (length <= 2) classes.push('tracking-widest');
		return classes.join(' ');
	}, [required, label]);

	return (
		<div className='Input'>
			<div className={className}>{label}</div>
			<div className='relative flex-1'>
				{Element}
				{code && <RandomCode />}
			</div>
		</div>
	);
};
export default RegularInput;
