import GlbLoader from 'lesca-glb-loader';
import * as THREE from 'three';
import Model from './models/cloud.glb';

export default class Cloud {
	constructor({ webgl, onload }) {
		this.webgl = webgl;
		this.name = 'cloud';

		this.addCharacter().then(() => onload(this.name));
	}

	addCharacter() {
		return new Promise((resolve, reject) => {
			GlbLoader(Model)
				.then((e) => {
					const { model, gltf } = e;
					gltf.scene.traverse((child) => {
						const mesh = child;
						if (mesh.isMesh) mesh.castShadow = true;
					});

					model.scale.set(2, 2, 2);
					const material = new THREE.MeshLambertMaterial({
						color: 0xffffff,
						emissive: 0x333333,
					});
					model.children[0].material = material;

					const cloud2 = model.clone();
					model.position.set(-3, 3, 0);

					cloud2.scale.set(5, 5, 5);
					cloud2.position.set(5, -10, -2);
					cloud2.rotation.y = Math.PI / 2;

					this.webgl.scene.add(model);
					this.webgl.scene.add(cloud2);
					resolve();
				})
				.catch(reject);
		});
	}
}
