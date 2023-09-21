/* eslint-disable no-param-reassign */
/* eslint-disable jsx-a11y/control-has-associated-label */
import { useMemo } from 'react';
import { INVOICE_INFO_NAME, USER_AGE, USER_GENDER } from '../../settings/constant';
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

const CheckBox = ({ name, value, checked = false }) => {
	const onClick = () => {
		const inputs = document.getElementsByTagName('input');
		const checkboxes = [...inputs].filter((tag) => tag.type === 'radio');
		checkboxes.forEach((item) => {
			if (item.value === String(value)) item.checked = true;
			else item.checked = false;
		});
	};
	return (
		<div className='relative p-3'>
			<input type='radio' name={name} value={value} defaultChecked={checked} />
			<button
				className='w-14 h-14 absolute top-0 left-0 -ml-2 mt-1 bg-transparent'
				onClick={onClick}
				type='button'
			/>
		</div>
	);
};

const RegularInput = ({
	labelName = ['name', 'name'],
	placeholder = '',
	type = 'text',
	required,
	code,
}) => {
	const maxLength = useMemo(() => {
		if (type === 'tel') return 10;
		if (labelName[1] === INVOICE_INFO_NAME.發票號碼) return 10;
		if (labelName[1] === INVOICE_INFO_NAME.隨機碼) return 4;
		return null;
	}, [type, labelName]);

	const Element = useMemo(() => {
		switch (type) {
			case 'select':
				return (
					<div className='h-full w-full px-5'>
						<select name={labelName[1]}>
							<option>{placeholder}</option>
							{Object.entries(USER_AGE).map((item) => (
								<option key={item[0]} value={item[1]}>
									{item[0]}
								</option>
							))}
						</select>
					</div>
				);

			case 'radio':
				return (
					<div className='flex w-full flex-row items-center justify-start space-x-5 px-5'>
						<div className='flex flex-row items-center space-x-2'>
							<CheckBox name={labelName[1]} value={USER_GENDER.先生} checked />
							<div className='pr-3'>先生</div>
						</div>
						<div className='flex flex-row items-center space-x-2'>
							<CheckBox name={labelName[1]} value={USER_GENDER.小姐} />
							<div>小姐</div>
						</div>
					</div>
				);
			case 'text':
			case 'number':
			case 'tel':
			case 'email':
			default:
				return (
					<input
						name={labelName[1]}
						type={type}
						placeholder={placeholder}
						style={
							labelName[1] === INVOICE_INFO_NAME.發票號碼 ? { textTransform: 'uppercase' } : {}
						}
						maxLength={maxLength}
					/>
				);
		}
	}, [type, placeholder, labelName]);

	const className = useMemo(() => {
		const classes = [];
		if (required) classes.push('required');
		const { length } = String(labelName[0]);

		if (length <= 2) classes.push('tracking-widest');
		return classes.join(' ');
	}, [required, labelName]);

	return (
		<div className='Input'>
			<div className={className}>{labelName[0]}</div>
			<div className='relative flex-1'>
				{Element}
				{code && <RandomCode />}
			</div>
			{code && (
				<figcaption className='w-full -bottom-10 lg:-bottom-7 text-2xl lg:text-base absolute text-secondary text-right'>
					*若無隨機碼，輸入0000即可
				</figcaption>
			)}
		</div>
	);
};
export default RegularInput;
