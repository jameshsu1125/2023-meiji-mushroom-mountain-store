import GlbLoader from 'lesca-glb-loader';
import * as CANNON from 'cannon-es';
import { ModelSize, CubeGapSize, CubeSize } from './config';
import mushroom from './models/mushroom.glb';

export default class Mushroom {
	constructor({ webgl }) {
		this.webgl = webgl;
		this.model = null;
		this.body = null;

		this.property = {
			index: 5,
			y: CubeSize * 0.5 + 0.25,
			size: CubeSize,
			gap: CubeGapSize,
			offset: {
				x: (CubeSize + CubeGapSize) * -1,
				z: (CubeSize + CubeGapSize) * -1,
			},
			correction: {
				x: -0.08,
				y: -0.25,
				z: 0.095,
			},
		};

		this.init();
		this.addMushroom();
		this.randomPosition = () => Math.floor(Math.random() * 9);

		// window.addEventListener('keydown', (e) => {
		// 	const { keyCode } = e;
		// 	const gap = 0.01;
		// 	switch (keyCode) {
		// 		case 65: // a
		// 			this.property.correction.x -= gap;
		// 			console.log(this.property.correction.x);
		// 			break;
		// 		case 68:
		// 			this.property.correction.x += gap;
		// 			console.log(this.property.correction.x);
		// 			break;
		// 		case 87:
		// 			this.property.correction.z += gap;
		// 			console.log(this.property.correction.z);
		// 			break;
		// 		case 83:
		// 			this.property.correction.z -= gap;
		// 			console.log(this.property.correction.z);
		// 			break;
		// 	}
		// });
	}

	init() {
		const { y, size, gap, offset } = this.property;
		this.position = [...new Array(9).keys()].map((i) => {
			const col = Math.floor(i / 3);
			const row = i % 3;
			const x = (i % 3) * size + row * gap + offset.x;
			const z = Math.floor(i / 3) * size + col * gap + offset.z;
			return { x, y, z };
		});
	}

	setPositionByIndex() {
		const position = this.position[this.property.index];
		this.body.position.copy(position);
	}

	addPhysics() {
		const { world, physicsStaticMaterial } = this.webgl;
		const height = 0.5;

		const cylinderShape = new CANNON.Cylinder(0.16, 0.16, height, 16, 1);
		this.body = new CANNON.Body({
			mass: 0,
			shape: cylinderShape,
			type: CANNON.Body.STATIC,
			material: physicsStaticMaterial,
		});

		world.addBody(this.body);
	}

	addMushroom() {
		return new Promise((resolve, reject) => {
			GlbLoader(mushroom)
				.then((e) => {
					const { model, gltf } = e;
					gltf.scene.traverse((child) => {
						const mesh = child;
						if (mesh.isMesh) mesh.castShadow = true;
					});
					const scale = ModelSize;
					model.scale.set(scale, scale, scale);
					this.webgl.scene.add(model);
					this.model = model;
					this.addPhysics();
					this.setPositionByIndex();
					resolve();
				})
				.catch(reject);
		});
	}

	visible(v) {
		this.model.visible = v;
	}

	update() {
		if (this.model) {
			const { position } = this.body;
			const { correction } = this.property;
			const p = { ...position };
			p.x += correction.x;
			p.y += correction.y;
			p.z += correction.z;
			this.model.position.copy(p);
		}
	}
}
