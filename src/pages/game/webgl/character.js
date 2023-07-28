import * as CANNON from 'cannon-es';
import GlbLoader from 'lesca-glb-loader';
import * as THREE from 'three';
import { CubeSize, ModelSize } from './config';
import Avatar from './models/character.glb';

export default class Character {
	constructor({ webgl }) {
		this.webgl = webgl;
		this.model = null;
		this.mixer = null;
		this.actions = {};
		this.actionName = 'idle';
		this.delta = this.webgl.clock.getDelta();
		this.isOut = false;

		this.property = {
			size: CubeSize,
			position: { x: 0, y: CubeSize - 0.4, z: 0 },
			correction: { x: 0, y: -0.6, z: 0 },
		};

		this.addCharacter().then(() => {
			this.actions[this.actionName].play();
		});
		this.update();
	}

	down() {
		const keyName = 'down';
		this.doActionByName(keyName);
	}

	wave() {
		if (this.isOut) return;
		const keyName = 'wavehand';
		this.doActionByName(keyName);
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
		const { world, physicsStaticMaterial } = this.webgl;
		const cylinderShape = new CANNON.Sphere(0.6);
		this.body = new CANNON.Body({
			mass: 10,
			shape: cylinderShape,
			type: CANNON.Body.DYNAMIC,
			material: physicsStaticMaterial,
		});
		this.body.position.copy(this.property.position);
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

	move(direct) {
		if (this.isOut) return;
		if (!this.body && !this.model) return;
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
		if (angle !== false) this.rotate(angle);
		else this.stop();

		const { position } = this.body;
		const clonePosition = { ...position };
		clonePosition.x -= x * 0.05;
		clonePosition.z -= z * 0.05;
		this.body.velocity.x = 0;
		this.body.velocity.z = 0;
		this.body.position.x = clonePosition.x;
		this.body.position.z = clonePosition.z;
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
			if (position.y <= 1.55) {
				this.isOut = true;
				this.down();
			}
		}
	}
}
