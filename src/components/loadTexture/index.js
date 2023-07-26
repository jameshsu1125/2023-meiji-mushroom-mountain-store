import * as THREE from 'three';

const loadTexture = async (source) => {
	const loader = new THREE.TextureLoader();
	return new Promise((resolve, reject) => {
		loader.load(
			source,
			(texture) => {
				resolve(texture);
			},
			reject,
		);
	});
};

export default loadTexture;
