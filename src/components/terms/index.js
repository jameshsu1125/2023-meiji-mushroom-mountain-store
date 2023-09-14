/* eslint-disable jsx-a11y/control-has-associated-label */
import { forwardRef, useImperativeHandle, useRef } from 'react';
import './index.less';

const Terms = forwardRef((props, ref) => {
	const inputRef = useRef();

	useImperativeHandle(ref, () => ({
		value() {
			return inputRef.current.checked;
		},
	}));

	return (
		<div className='Terms'>
			<div>
				<input ref={inputRef} type='checkbox' />
				<button
					className='trigger'
					type='button'
					onClick={() => {
						inputRef.current.checked = !inputRef.current.checked;
					}}
				/>
			</div>
			<div className='txt'>
				已詳閱活動辦法及個人資料使用說明，參加本活動即表示同意公告之辦法及說明
			</div>
		</div>
	);
});

export default Terms;
