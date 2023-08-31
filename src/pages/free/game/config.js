import * as THREE from 'three';
import { CameraType } from 'lesca-webgl-threejs/lib/types';
import { RespondBreakPoint } from '../../../settings/config';

export const webglConfig = {
	camera: { fov: 50, far: 75, type: CameraType.perspective },
	sky: {
		enabled: false,
		turbidity: 3.6,
		rayleigh: 0.165,
		mieCoefficient: 0,
		mieDirectionalG: 0.768,
		inclination: 0.25,
		azimuth: 0.25,
	},
	controls: {
		distance: { min: 5, max: 20 },
		polar: { min: -80, max: 80 },
		azimuth: { min: -Infinity, max: Infinity },
		default: {
			polar: 50,
			azimuth: 35,
		},
		offsetAzimuth: 0,
		enabled: true,
		panEasing: 100,
	},
	light: {
		ambient: {
			color: 0xffff51,
			intensity: 0.6,
		},
		point: {
			color: 0xffffff,
			intensity: 0.1,
			distance: 100,
			decay: 0.5,
			position: { x: 2, y: 10, z: 0 },
		},
		shadowMapSize: 2048,
		debug: true,
	},
	renderer: {
		alpha: true,
		shadowType: THREE.PCFShadowMap,
		exposure: 0.9,
	},
	physics: true,
	stats: false,
};

export const CubeSize = 2;
export const CubeGapSize = 0.1;
export const ModelSize = 0.6;
export const mushroomSize = 1;
export const bambooSize = 1;

export const cubeData = { number: 0, index: 0, hasItem: '', drop: false };
export const gameRule = {
	startCountDown: 0,
	maxMushroom: 3,
	stay: 0,
	collideGroup: { box: 1, character: 2, bamboo: 2, mushroom: 3, unset: 0 },
	cubes: [...new Array(9).keys()].map((index) => {
		const cloneData = { ...cubeData };
		if (index === 4) cloneData.number = 5 + Math.floor(Math.random() * 5);
		else cloneData.number = 2 + Math.floor(Math.random() * 8);
		cloneData.index = index;
		return cloneData;
	}),
	gameOverStayDuration: 2000,
};

export const ControlsDefaultProps = {
	x: 0,
	y: 0,
	z: 0,
	polar: 50,
	azimuth: 35,
	distance: window.innerWidth >= RespondBreakPoint.md ? 14 : 17,
	duration: 5000,
};
