/* eslint-disable no-param-reassign */
import * as CANNON from 'cannon-es';
import GlbLoader from 'lesca-glb-loader';
import Tweener from 'lesca-object-tweener';
import { CubeGapSize, CubeSize, ModelSize } from './config';
import { easingDelta, shuffleArray } from './misc';
import bamboo from './models/bamboo.glb';

export default class Bamboo {
	constructor({ webgl, collector, onload }) {
		this.webgl = webgl;
		this.collector = collector;
		this.name = 'bamboo';
		this.model = null;
		this.body = null;

		this.serial = 0;
		this.enabled = true;
		this.isTween = false;
		this.offset = { x: 0, z: 0 };

		this.property = {
			y: CubeSize * 0.5 + 0.25,
			size: CubeSize,
			gap: CubeGapSize,
			offset: { x: (CubeSize + CubeGapSize) * -1, z: (CubeSize + CubeGapSize) * -1 },
			correction: { x: -0.07, y: -0.25, z: 0.115 },
		};

		this.getOffset = () => {
			const paddingCubeSize = CubeSize * 0.8;
			this.offset.x = 0 - paddingCubeSize * 0.5 + Math.random() * paddingCubeSize;
			this.offset.z = 0 - paddingCubeSize * 0.5 + Math.random() * paddingCubeSize;
		};

		this.init();
		this.addBamboo().then(() => onload(this.name));
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
		this.tweener = new Tweener();
	}

	stop() {
		this.enabled = false;
	}

	hide() {
		this.body.position.set(10, 10, 10);
		this.model.visible = false;
	}

	setPositionByIndex() {
		if (!this.enabled) return;
		if (this.isTween) return;

		const [aliveCubes] = shuffleArray(
			this.collector.data.filter((e) => {
				if (e.number > 0) {
					if (e.hasItem !== '') return false;
					return true;
				}
				return false;
			}),
		);

		if (!aliveCubes) return;

		const { index } = aliveCubes;
		this.collector.setBambooIndex(index);
		const position = this.position[index];
		position.y = this.property.y - 0.6;

		this.tweener
			.stop()
			.clearQueue()
			.add({
				from: {
					...position,
					y: this.property.y - 0.6,
				},
				to: { ...position, y: this.property.y },
				duration: 200,
				onStart: () => {
					this.getOffset();
					this.model.visible = true;
					this.isTween = true;

					this.body.type = CANNON.Body.STATIC;
					this.body.velocity.setZero();
				},
				onUpdate: (e) => {
					this.body.position.copy({ x: e.x + this.offset.x, y: e.y, z: e.z + this.offset.z });
				},
				onComplete: (e) => {
					this.body.position.copy({ x: e.x + this.offset.x, y: e.y, z: e.z + this.offset.z });
					this.isTween = false;

					this.body.type = CANNON.Body.DYNAMIC;
					this.body.velocity.setZero();
				},
			})
			.play();
	}

	addPhysics() {
		const { world, physicsStaticMaterial } = this.webgl;
		const height = 0.5;
		const cylinderShape = new CANNON.Cylinder(0.1, 0.16, height, 16, 1);
		this.body = new CANNON.Body({
			mass: 100,
			shape: cylinderShape,
			type: CANNON.Body.STATIC,
			material: physicsStaticMaterial,
		});
		this.body.name = this.name;
		this.hide();
		world.addBody(this.body);
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
					resolve();
				})
				.catch(reject);
		});
	}

	visible(v) {
		this.model.visible = v;
	}

	update(delta) {
		if (this.model) {
			const currentDelta = easingDelta(delta, 'linear');
			if (currentDelta !== this.serial) {
				this.serial = currentDelta;
				this.setPositionByIndex();
			}

			const { position } = this.body;
			const { correction } = this.property;
			this.model.position.copy({
				x: position.x + correction.x,
				y: position.y + correction.y,
				z: position.z + correction.z,
			});
		}
	}
}
