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
			quaternary: '#00ff00',
			backgroundColor: '#fff028',
			textColor: '#642f20',
			gray: '#333',
		},
		fontFamily: {
			MiMedium: ['MiSans-medium', 'sans-serif'],
		},
	},
	plugins: [],
};
