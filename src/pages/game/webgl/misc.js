/* eslint-disable no-plusplus */
import BezierEasing from 'bezier-easing';
import { Bezier } from 'lesca-use-tween';

export const ABDistance = (a, b) => {
	const x = a.x - b.x;
	const y = a.y - b.y;
	const z = a.z - b.z;
	return Math.sqrt(x ** 2 + y ** 2 + z ** 2);
};

export const ABAngle = (a, b) => Math.atan2(a.x - b.x, a.z - b.z);

export const easingDelta = (delta, type = 'inCirc') => {
	const maxDuration = 20000;
	const bezier = type === 'inCirc' ? Bezier.inCirc : Bezier.linear;
	const easing = BezierEasing(bezier[0], bezier[1], bezier[2], bezier[3]);
	const currentDelta = Math.floor((easing(delta / maxDuration) * maxDuration) / 1000);
	const overRangeDelta = delta > maxDuration ? delta / 1000 : currentDelta;
	return type === 'inCirc' ? overRangeDelta : currentDelta;
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
