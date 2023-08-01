export const ABDistance = (a, b) => {
	const x = a.x - b.x;
	const y = a.y - b.y;
	const z = a.z - b.z;
	return Math.sqrt(x ** 2 + y ** 2 + z ** 2);
};

export const ABAngle = (a, b) => Math.atan2(a.x - b.x, a.z - b.z);
