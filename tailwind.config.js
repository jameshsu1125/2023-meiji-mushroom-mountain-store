/* eslint-disable import/no-extraneous-dependencies */
const color = require('tailwindcss/colors');
const { fontSize } = require('tailwindcss/defaultTheme');

module.exports = {
	content: ['./src/**/*.{html,js}'],
	theme: {
		container: { screen: {} },
		fontSize: {
			...fontSize,
		},
		colors: {
			...color,
			primary: '#642f20',
			secondary: '#ff0000',
			tertiary: '#ff6666',
			quaternary: '#7f562d',
			backgroundColor: '#fff028',
			textColor: '#642f20',
			gray: '#333',
		},
		fontFamily: {
			MiMedium: ['MiSans-medium', 'sans-serif'],
			MiBold: ['MiSans-bold', 'sans-serif'],
			MiRegular: ['MiSans-regular', 'sans-serif'],
			MiHeavy: ['MiSans-heavy', 'sans-serif'],
			MiSemibold: ['MiSans-semibold', 'sans-serif'],
			MiNormal: ['MiSans-normal', 'sans-serif'],
		},
	},
	plugins: [],
};
