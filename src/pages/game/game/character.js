/* eslint-disable no-underscore-dangle */
/* eslint-disable no-bitwise */
/* eslint-disable no-param-reassign */
import * as CANNON from 'cannon-es';
import GlbLoader from 'lesca-glb-loader';
import * as THREE from 'three';
import { CubeSize, ModelSize, bambooSize, gameRule } from './config';
import Avatar from './models/character3.glb';
import { CONTROL_MODE } from '../../../settings/constant';

export default class Character {
	constructor({ webgl, onMushroomTrigger, onGameOver, collector, stopRender, onload }) {
		this.webgl = webgl;
		this.onMushroomTrigger = onMushroomTrigger;
		this.onGameOver = onGameOver;
		this.collector = collector;
		this.stopRender = stopRender;
		this.name = 'character';
		this.model = null;
		this.mixer = null;
		this.actions = {};
		this.actionName = 'idle';
		this.delta = 0.03 * 0.8;
		this.speed = 0.08 * 0.8;
		this.isOut = false;
		this.moveable = true;
		this.bounce = true;

		this.property = {
			size: CubeSize,
			position: { x: 0, y: CubeSize - 0.5, z: 0 },
			correction: { x: 0, y: -0.38, z: 0 },
		};

		this.addCharacter().then(() => {
			this.actions[this.actionName].play();
			onload(this.name);
		});
		this.update();
	}

	setMoveable(bool) {
		this.moveable = bool;
		this.stop();
	}

	stand() {
		const keyName = 'idle';
		this.doActionByName(keyName);
	}

	down() {
		const keyName = 'down';
		this.doActionByName(keyName);
	}

	wave() {
		if (this.isOut) return;
		const keyName = 'wave';
		this.doActionByName(keyName);

		const onActionEnd = () => {
			this.stand();
			this.actions[this.actionName].loop = THREE.LoopRepeat;
			Object.keys(this.actions).forEach((key) => {
				this.actions[key].loop = THREE.LoopRepeat;
			});
		};
		this.actions[this.actionName].loop = THREE.LoopOnce;
		this.actions[this.actionName]._mixer.addEventListener('finished', onActionEnd);
	}

	walk() {
		if (this.isOut) return;
		const keyName = 'run';
		this.doActionByName(keyName);
	}

	stop() {
		if (!this.model || this.isOut) return;
		const keyName = 'idle';
		this.doActionByName(keyName);
	}

	rotate(rotation = 0) {
		const quaternion = new THREE.Quaternion();
		quaternion.setFromAxisAngle(new THREE.Vector3(0, 1, 0).normalize(), rotation);
		this.model.rotation.setFromQuaternion(quaternion);
	}

	doActionByName(keyName) {
		if (keyName === this.actionName) return;
		if (this.actionName) this.actions[this.actionName].stop();
		this.actions[keyName].play();
		this.actionName = keyName;
	}

	addPhysics() {
		const { world, physicsImpactMaterial } = this.webgl;
		const cylinderShape = new CANNON.Sphere(0.4);
		this.body = new CANNON.Body({
			mass: 100,
			shape: cylinderShape,
			type: CANNON.Body.DYNAMIC,
			material: physicsImpactMaterial,
			collisionFilterGroup: gameRule.collideGroup.character,
		});
		this.body.position.copy(this.property.position);

		const onCollide = (event) => {
			const { name } = event.body;
			const { target } = event;

			if (name.indexOf('box') >= 0) {
				target.velocity.setZero();
				const index = Number(name.slice(3));
				this.collector.stay = index;
				if (!this.moveable) this.moveable = true;
				return;
			}

			// body => bamboo or mushroom, target => character
			if (name === 'bamboo') {
				const { position: p1 } = event.body;
				const { position: p2 } = target;
				const forceScale = (-5 / bambooSize) * 0.6;

				const dx = p1.x - p2.x > 0 ? 1 : -1;
				const dz = p1.z - p2.z > 0 ? 1 : -1;

				const velocity = { x: 2 * dx * forceScale, z: 2 * dz * forceScale, y: 8 };

				target.velocity.setZero();
				this.setMoveable(false);

				requestAnimationFrame(() => {
					target.velocity.set(velocity.x, velocity.y, velocity.z);
				});
			} else {
				const { body } = event;

				body.type = CANNON.Body.STATIC;
				body.velocity.setZero();
				body.position.y = -1;
				setTimeout(() => {
					body.position.y = -1000;
					// body.quaternion.setFromAxisAngle(new CANNON.Vec3(1, 0, 0), 0);
				}, 50);

				// 防抖動
				if (!this.bounce) return;
				this.bounce = false;
				this.onMushroomTrigger();
				setTimeout(() => {
					this.bounce = true;
				}, 500);
			}
		};
		this.body.addEventListener('collide', onCollide);
		world.addBody(this.body);
	}

	addCharacter() {
		return new Promise((resolve, reject) => {
			GlbLoader(Avatar)
				.then((e) => {
					const { model, gltf } = e;
					gltf.scene.traverse((child) => {
						const mesh = child;
						if (mesh.isMesh) mesh.castShadow = true;
					});
					this.mixer = new THREE.AnimationMixer(gltf.scene);
					gltf.animations.forEach((clip) => {
						const { name } = clip;
						const action = this.mixer.clipAction(clip);
						this.actions[name.toLowerCase()] = action;
					});
					const scale = ModelSize;
					model.scale.set(scale, scale, scale);
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

	moveByJoystick({ angle }) {
		const currentAngle = angle + (Math.PI / 180) * 30;
		this.rotate(currentAngle - Math.PI);
		this.walk();
		const x = Math.cos(currentAngle - Math.PI / 2) * 12 * this.speed;
		const z = Math.sin(currentAngle + Math.PI / 2) * 12 * this.speed;

		return { x, z };
	}

	moveByKeyBoard({ direct }) {
		const { ArrowLeft = 0, ArrowRight = 0, ArrowUp = 0, ArrowDown = 0 } = direct;

		const x = ArrowLeft - ArrowRight;
		const z = ArrowUp - ArrowDown;

		const degree = {
			'00': false,
			10: -Math.PI / 2,
			'-10': Math.PI / 2,
			'01': Math.PI,
			'0-1': 0,
			'-11': (Math.PI / 4) * 3,
			11: (-Math.PI / 4) * 3,
			'1-1': -Math.PI / 4,
			'-1-1': Math.PI / 4,
		};

		const angle = degree[`${x}${z}`];
		if (angle !== false) {
			this.rotate(angle);
			this.walk();
		} else this.stop();

		return { x, z };
	}

	move(controller) {
		const { mode, direct, angle } = controller;
		if (mode === CONTROL_MODE.unset) {
			this.stop();
			return;
		}
		if (this.isOut || !this.moveable) return;
		if (!this.body && !this.model) return;

		const { x, z } =
			mode === CONTROL_MODE.keyboard
				? this.moveByKeyBoard({ direct })
				: this.moveByJoystick({ angle });

		const { position } = this.body;
		const clonePosition = { ...position };
		clonePosition.x -= x * this.speed;
		clonePosition.z -= z * this.speed;
		this.body.velocity.x = 0;
		this.body.velocity.z = 0;
		this.body.position.x = clonePosition.x;
		this.body.position.z = clonePosition.z;
	}

	kickOut() {
		this.body.velocity.y = -10;
		this.setMoveable(false);
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
			this.mixer?.update(this.delta);

			if (this.isOut) return;
			if (position.y <= 1.25) {
				this.isOut = true;
				this.down();
				this.collector.stay = 999;
				this.stopRender();
				this.onGameOver();
			}
		}
	}
}
