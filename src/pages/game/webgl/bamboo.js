/* eslint-disable no-param-reassign */
import GlbLoader from 'lesca-glb-loader';
import * as CANNON from 'cannon-es';
import { CubeGapSize, CubeSize, ModelSize } from './config';
import bamboo from './models/bamboo.glb';

export default class Bamboo {
	constructor({ webgl }) {
		this.webgl = webgl;

		this.model = null;
		this.body = null;
		this.property = {
			index: 7,
			y: CubeSize * 0.5 + 0.25,
			size: CubeSize,
			gap: CubeGapSize,
			offset: {
				x: (CubeSize + CubeGapSize) * -1,
				z: (CubeSize + CubeGapSize) * -1,
			},
			correction: {
				x: -0.07,
				y: -0.25,
				z: 0.115,
			},
		};

		this.init();
		this.addBamboo();
		this.randomPosition = () => Math.floor(Math.random() * 9);
	}

	init() {
		const { y, gap, size, offset } = this.property;
		this.position = [...new Array(9).keys()].map((i) => {
			const col = Math.floor(i / 3);
			const row = i % 3;
			const x = (i % 3) * size + row * gap + offset.x;
			const z = Math.floor(i / 3) * size + col * gap + offset.z;
			return { x, y, z };
		});
	}

	addPhysics() {
		const { world, physicsStaticMaterial } = this.webgl;
		const height = 0.5;

		const cylinderShape = new CANNON.Cylinder(0.1, 0.16, height, 16, 1);
		this.body = new CANNON.Body({
			mass: 0,
			shape: cylinderShape,
			type: CANNON.Body.STATIC,
			material: physicsStaticMaterial,
		});

		world.addBody(this.body);
	}

	setPositionByIndex() {
		const position = this.position[this.property.index];
		this.body.position.copy(position);
	}

	addBamboo() {
		return new Promise((resolve, reject) => {
			GlbLoader(bamboo)
				.then((e) => {
					const { model, gltf } = e;
					gltf.scene.traverse((child) => {
						if (child.isMesh) child.castShadow = true;
					});
					model.scale.set(ModelSize, ModelSize, ModelSize);

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
