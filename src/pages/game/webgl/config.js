import * as THREE from 'three';
import { CameraType } from 'lesca-webgl-threejs/lib/types';

export const webglConfig = {
	camera: { fov: 50, far: 75, type: CameraType.perspective },
	sky: {
		enabled: true,
		turbidity: 3.6,
		rayleigh: 0.165,
		mieCoefficient: 0,
		mieDirectionalG: 0.768,
		inclination: 0.25,
		azimuth: 0.25,
	},
	controls: {
		distance: { min: 13, max: 13 },
		polar: { min: 50, max: 50 },
		azimuth: { min: 35, max: 35 },
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
			color: 0xc8dbf4,
			intensity: 1,
		},
		point: {
			color: 0xf4c8c8,
			intensity: 0.9,
			distance: 100,
			decay: 0.5,
			position: { x: 0, y: 8, z: 0 },
		},
		shadowMapSize: 1024,
		debug: true,
	},
	renderer: {
		alpha: false,
		shadowType: THREE.PCFSoftShadowMap,
		exposure: 1,
		outputEncoding: THREE.sRGBEncoding,
		physicallyCorrectLights: false,
	},
	physics: true,
	stats: true,
};

export const CubeSize = 2;
export const CubeGapSize = 0.1;
export const ModelSize = 0.6;
export const mushroomSize = 1;
export const bambooSize = 1;

export const cubeData = { number: 0, index: 0, hasItem: '', drop: false };
export const gameRule = {
	startCountDown: 3,
	maxMushroom: 3,
	stay: 0,
	cubes: [...new Array(9).keys()].map((index) => {
		const cloneData = { ...cubeData };
		if (index === 4) cloneData.number = 5 + Math.floor(Math.random() * 5);
		else cloneData.number = 2 + Math.floor(Math.random() * 8);
		cloneData.index = index;
		return cloneData;
	}),
	collideGroup: {
		box: 1,
		character: 2,
		bamboo: 2,
		mushroom: 3,
		unset: 0,
	},
};

export const ControllerMode = {
	unset: 0,
	keyboard: 1,
	joystick: 2,
};
