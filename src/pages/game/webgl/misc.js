/* eslint-disable no-plusplus */
import { Bezier } from 'lesca-use-tween';
import BezierEasing from 'bezier-easing';
import { gameRule } from './config';

export const ABDistance = (a, b) => {
	const x = a.x - b.x;
	const y = a.y - b.y;
	const z = a.z - b.z;
	return Math.sqrt(x ** 2 + y ** 2 + z ** 2);
};

export const ABAngle = (a, b) => Math.atan2(a.x - b.x, a.z - b.z);

export const easingDelta = (delta, type = 'inCirc') => {
	const bezier = type === 'inCirc' ? Bezier.inCirc : Bezier.linear;
	const easing = BezierEasing(bezier[0], bezier[1], bezier[2], bezier[3]);
	return Math.floor((easing(delta / gameRule.totalDuration) * gameRule.totalDuration) / 1000);
};

export const shuffleArray = (array) => {
	const clone = [...array];
	let currentIndex = array.length;
	let randomIndex;
	while (currentIndex !== 0) {
		randomIndex = Math.floor(Math.random() * currentIndex);
		currentIndex--;
		[clone[currentIndex], clone[randomIndex]] = [clone[randomIndex], clone[currentIndex]];
	}
	return clone;
};
