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
		this.actionName = 'run';

		this.property = {
			index: 5,
			height: 1.7,
			size: CubeSize,
			position: {
				x: 0,
				y: CubeSize - 0.13,
				z: 0,
			},
			correction: {
				x: 0,
				y: -0.85,
				z: 0,
			},
		};

		this.addCharacter().then(() => {
			// this.actions[this.actionName].play();
		});
		this.update();
	}

	down() {
		const keyName = 'down';
		this.doActionByName(keyName);
	}

	wave() {
		const keyName = 'wavehand';
		this.doActionByName(keyName);
	}

	walk() {
		const keyName = 'run';
		this.doActionByName(keyName);
	}

	doActionByName(keyName) {
		if (keyName === this.actionName) return;
		this.actions[this.actionName].stop();
		this.actions[keyName].play();
		this.actionName = keyName;
	}

	addPhysics() {
		const { world, physicsStaticMaterial } = this.webgl;

		const cylinderShape = new CANNON.Cylinder(0.5, 0.5, this.property.height, 16, 1);
		this.body = new CANNON.Body({
			mass: 1,
			shape: cylinderShape,
			type: CANNON.Body.STATIC,
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

	update() {
		if (this.model) {
			const { position } = this.body;
			const { correction } = this.property;
			const p = { ...position };
			p.x += correction.x;
			p.y += correction.y;
			p.z += correction.z;
			this.model.position.copy(p);
			const delta = this.webgl.clock.getDelta();
			this.mixer?.update(delta);
		}
	}
}
