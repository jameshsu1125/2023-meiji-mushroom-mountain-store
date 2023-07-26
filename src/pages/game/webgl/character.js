import GlbLoader from 'lesca-glb-loader';
import * as THREE from 'three';
import { CharacterSize, CubeSize } from './config';
import Avatar from './models/character.glb';

export default class Character {
	constructor({ webgl }) {
		this.webgl = webgl;
		this.mixers = [];
		this.index = 1;

		this.addCharacter();
		this.wave();

		this.update();
	}

	update() {
		const { enterframe } = this.webgl;
		enterframe.add(() => {
			const delta = this.webgl.clock.getDelta();
			this.mixers[this.index]?.update(delta);
		});
	}

	wave() {
		// const action = mixer[2].clipAction(gltf.animations[0]);
		// action.setLoop(THREE.LoopOnce);
		// action.play();
		this.index = 2;
	}

	walk() {
		this.index = 1;
	}

	addCharacter() {
		GlbLoader(Avatar).then((e) => {
			const { model, mixers, gltf } = e;

			gltf.scene.traverse((child) => {
				const mesh = child;
				if (mesh.isMesh) mesh.castShadow = true;
			});

			// const action = mixers[2].clipAction(gltf.animations[2]);
			// action.setLoop(THREE.LoopOnce);
			// action.play();

			// this.mixer = new THREE.AnimationMixer(gltf.scene);
			// this.actions = {};

			// console.log(gltf);

			// gltf.animations.forEach((clip) => {
			// 	const { name } = clip;
			// 	const action = this.mixer.clipAction(clip);

			// 	this.actions[name] = action;
			// });
			// console.log(this.actions.WaveHand);

			const scale = CharacterSize;
			model.scale.set(scale, scale, scale);
			model.position.y = CubeSize - 1;
			this.webgl.scene.add(model);

			this.mixers = mixers;
		});
	}
}
