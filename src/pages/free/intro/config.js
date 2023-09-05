export const IntroState = {
	step: 0,
};

export const Info = [
	{
		headline: '快速集菇！',
		subline: (
			<div className='flex flex-row justify-center items-center'>
				幫菇太郎採收
				<span>菇菇</span>
				<div className='mushroom' />
			</div>
		),
		demo: '',
	},
	{
		headline: '小心腳步！',
		subline: (
			<div>
				踩到
				<span>倒數至0</span>
				的菇田 遊戲就會結束
			</div>
		),
		demo: '',
	},
	{
		headline: '小心間諜菇菇！',
		subline: (
			<div className='w-full flex items-center flex-row justify-center'>
				別被隨機長出的
				<span>竹筍</span>
				<div className='bamboo' />
				彈飛啦
			</div>
		),
		demo: '',
	},
];
