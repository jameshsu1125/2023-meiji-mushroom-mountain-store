/* eslint-disable no-bitwise */
/* eslint-disable no-return-assign */
/* eslint-disable no-param-reassign */
import * as CANNON from 'cannon-es';
import GlbLoader from 'lesca-glb-loader';
import Tweener from 'lesca-object-tweener';
import { CubeGapSize, CubeSize, gameRule, mushroomSize } from './config';
import { easingDelta, shuffleArray } from './misc';
import mushroom from './models/mushroom2.glb';

export default class Mushroom {
	constructor({ webgl, collector, onload }) {
		this.webgl = webgl;
		this.collector = collector;
		this.name = 'mushroom';
		this.models = [];
		this.bodies = [];

		this.serial = gameRule.startCountDown + 1;
		this.enabled = true;
		this.offset = { x: 0, z: 0 };

		this.once = false;

		this.currentDrop = 999;

		this.getOffset = () => {
			// const paddingCubeSize = CubeSize * 0.8;
			const paddingCubeSize = CubeSize * 0.6;
			this.offset.x = 0 - paddingCubeSize * 0.5 + Math.random() * paddingCubeSize;
			this.offset.z = 0 - paddingCubeSize * 0.5 + Math.random() * paddingCubeSize;
		};

		this.property = {
			index: 5,
			y: CubeSize * 0.5 + (0.09 / 0.6) * mushroomSize,
			size: CubeSize,
			gap: CubeGapSize,
			offset: { x: (CubeSize + CubeGapSize) * -1, z: (CubeSize + CubeGapSize) * -1 },
			correction: {
				x: (-0.08 / 0.6) * mushroomSize,
				y: (-0.09 / 0.6) * mushroomSize,
				z: (0.095 / 0.6) * mushroomSize,
			},
		};

		this.init();
		this.addMushroom().then(() => onload(this.name));
		this.randomPosition = () => Math.floor(Math.random() * 9);
	}

	stop(dropIndex) {
		this.enabled = false;
		if (dropIndex) this.currentDrop = dropIndex;
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
		this.tweeners = [...new Array(gameRule.maxMushroom).keys()].map(() => new Tweener());
	}

	setPositionByIndex() {
		if (!this.enabled) return;

		if (this.once) return;
		this.once = true;

		const [aliveCubes] = shuffleArray(
			this.collector.data.filter((e, i) => {
				if (!e.drop) {
					if (this.collector.stay === i) return false;
					if (e.hasItem !== '') return false;
					return true;
				}
				return false;
			}),
		);

		if (!aliveCubes) return;
		// const { index } = aliveCubes;
		const index = 4;
		this.collector.setMushroomIndex(index);
		const position = this.position[index];
		position.y = this.property.y - 0.6;
		const targetIndex = this.serial % gameRule.maxMushroom;
		const tweener = this.tweeners[targetIndex];
		const body = this.bodies[targetIndex];
		const model = this.models[targetIndex];
		model.dropIndex = index;

		if (!tweener) return;
		tweener
			.stop()
			.clearQueue()
			.add({
				from: {
					...position,
					y: this.property.y - (0.6 / 0.6) * mushroomSize,
				},
				to: { ...position, y: this.property.y },
				duration: 200,
				onStart: () => {
					this.getOffset();
					model.visible = true;
					body.type = CANNON.Body.STATIC;
					body.collisionFilterMask = gameRule.collideGroup.unset;
					body.velocity.setZero();
					model.rotation.y = Math.random(Math.PI * 2);
					model.rotation.x = (Math.PI / 180) * (-10 + Math.random() * 20);
					model.rotation.z = (Math.PI / 180) * (-10 + Math.random() * 20);
				},
				onUpdate: (e) => {
					body.position.copy({ x: e.x + this.offset.x, y: e.y, z: e.z + this.offset.z });
				},
				onComplete: (e) => {
					body.position.copy({ x: e.x + this.offset.x, y: e.y, z: e.z + this.offset.z });
					body.type = CANNON.Body.DYNAMIC;
					body.velocity.setZero();
					body.quaternion.setFromAxisAngle(new CANNON.Vec3(1, 0, 0), 0);
					body.collisionFilterMask = gameRule.collideGroup.box | gameRule.collideGroup.character;
				},
			})
			.play();
	}

	addPhysics() {
		const { world, physicsStaticMaterial } = this.webgl;
		const height = (0.2 / 0.6) * mushroomSize;

		const cylinderShape = new CANNON.Cylinder(
			(0.16 / 0.6) * mushroomSize,
			(0.16 / 0.6) * mushroomSize,
			height,
			16,
			1,
		);
		this.bodies = [...new Array(gameRule.maxMushroom).keys()].map(() => {
			const body = new CANNON.Body({
				mass: 100,
				shape: cylinderShape,
				type: CANNON.Body.STATIC,
				material: physicsStaticMaterial,
				collisionFilterGroup: gameRule.collideGroup.mushroom,
				collisionFilterMask: gameRule.collideGroup.box | gameRule.collideGroup.character,
			});
			body.name = this.name;
			world.addBody(body);
			return body;
		});
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
					const scale = mushroomSize;
					model.scale.set(scale, scale, scale);

					this.models = [...new Array(gameRule.maxMushroom).keys()].map(() => {
						const currentModel = model.clone();
						this.webgl.scene.add(currentModel);
						return currentModel;
					});
					this.addPhysics();
					resolve();
				})
				.catch(reject);
		});
	}

	visible(v) {
		this.models.forEach((model) => {
			model.visible = v;
		});
	}

	update(delta) {
		if (this.models.length !== 0) {
			const currentDelta = easingDelta(delta, 'linear');

			if (currentDelta > this.serial) {
				this.serial = currentDelta;
				// this.setPositionByIndex();
			}

			[...new Array(gameRule.maxMushroom).keys()].forEach((index) => {
				const model = this.models[index];
				const { position } = this.bodies[index];
				const { correction } = this.property;
				if (this.enabled) {
					model.position.copy({
						x: position.x + correction.x,
						y: position.y + correction.y,
						z: position.z + correction.z,
					});
				} else if (this.currentDrop === model.dropIndex) {
					model.position.copy({
						x: position.x + correction.x,
						y: position.y + correction.y,
						z: position.z + correction.z,
					});
				}
			});
		}
	}
}
