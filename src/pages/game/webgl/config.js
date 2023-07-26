import * as THREE from 'three';
import { CameraType } from 'lesca-webgl-threejs/lib/types';

export const webglConfig = {
	fps: 0,
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
		distance: { min: 13, max: 30 },
		polar: { min: -70, max: 70 },
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
		shadowMapSize: 512,
		debug: true,
	},
	renderer: {
		alpha: false,
		shadowType: THREE.PCFSoftShadowMap,
		exposure: 1,
		outputEncoding: THREE.sRGBEncoding,
		physicallyCorrectLights: false,
	},
	physics: false,
	stats: true,
};

export const CubeSize = 2;
export const CharacterSize = 0.8;
