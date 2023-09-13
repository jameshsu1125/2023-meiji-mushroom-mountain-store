import Tweener, { Bezier } from 'lesca-object-tweener';
import Webgl from 'lesca-webgl-threejs';
import * as THREE from 'three';
import Bamboo from './bamboo';
import Character from './character';
import Collector from './collector';
import { ControlsDefaultProps, webglConfig } from './config';
import Controller from './controller';
import Cubes from './cubes';
import Mushroom from './mushroom';

export default class GL {
	constructor({
		onMushroomTrigger,
		onBambooTrigger,
		onModulesLoaded,
		onGameCountDown,
		onGameOver,
		onCameraZoomOuted,
	}) {
		this.webgl = new Webgl(webglConfig);
		this.webgl.controls.controls.enablePan = false;
		this.webgl.render.outputEncoding = THREE.sRGBEncoding;
		this.onMushroomTrigger = onMushroomTrigger;
		this.onModulesLoaded = onModulesLoaded;
		this.onGameOver = onGameOver;
		this.onCameraZoomOuted = onCameraZoomOuted;
		this.onGameCountDown = onGameCountDown;
		this.webgl.world.gravity.y = -8;
		// this.debuger = this.webgl.addCannonDebuger();

		this.collector = new Collector();
		this.cubes = null;
		this.character = null;
		this.mushroom = null;
		this.bamboo = null;
		this.controller = null;
		this.moreLights = [
			{ x: 3, y: 1.5, z: 3 },
			{ x: -3, y: 1.5, z: 3 },
		];

		// controls
		this.lookTarget = { x: 0, y: 2, z: 0 };
		this.webgl.controls.lookAt(this.lookTarget);

		// loader
		this.loaderData = {};
		this.onGLBLoaded = (target) => {
			this.loaderData[target] = true;
			const { length } = Object.keys(this.loaderData);
			if (length >= 4) onModulesLoaded();
		};

		// updater
		this.gameStart = false;
		this.firstDelta = false;

		this.stopMove = false;

		this.addMushroom();
		this.addBamboo();
		this.addCubes(onGameOver);
		this.addCharacter(onMushroomTrigger, onBambooTrigger, onGameOver);
		this.addMoreLight();

		const onWindowResize = () => {
			const { camera, renderer } = this.webgl;
			camera.aspect = window.innerWidth / window.innerHeight;
			camera.updateProjectionMatrix();
			renderer.renderer.setSize(window.innerWidth, window.innerHeight);
		};
		window.addEventListener('resize', onWindowResize, false);

		window.addEventListener('keydown', (e) => {
			if (e.key === 'w') {
				this.stopMove = true;
				this.character.wave(() => {
					this.stopMove = false;
				});
			}
		});
	}

	setCharacterMoveSoundTrack(track) {
		this.character.setCharacterMoveSoundTrack(track);
	}

	addMoreLight() {
		const { scene } = this.webgl;
		this.moreLights.forEach((position) => {
			const light = new THREE.PointLight(
				webglConfig.light.point.color,
				1,
				webglConfig.light.point.distance,
			);
			light.position.set(position.x, position.y, position.z);
			light.castShadow = false;
			scene.add(light);
		});
	}

	start(dom) {
		dom.appendChild(this.webgl.render.domElement);
		this.update();
		this.character.wave();

		this.addController();
		this.gameStart = true;
		// this.zoomOut();
	}

	zoomOut() {
		const { controls } = this.webgl;
		const from = { ...controls.get(), ...this.lookTarget };
		const to = { ...ControlsDefaultProps };
		delete to.duration;

		const updateControls = (value) => {
			this.webgl.controls.set(value);
			this.webgl.controls.lookAt(value);
		};
		const tweener = new Tweener({
			from,
			to,
			easing: Bezier.easeInOutQuart,
			duration: ControlsDefaultProps.duration,
			onUpdate: updateControls,
			onComplete: (value) => {
				updateControls(value);
				this.onCameraZoomOuted();
			},
		});

		tweener.play();
	}

	begin() {
		this.addController();
		this.gameStart = true;
	}

	addController() {
		const { webgl, cubes, character, mushroom, bamboo } = this;
		this.controller = new Controller({ webgl, cubes, character, mushroom, bamboo });
	}

	addBamboo() {
		this.bamboo = new Bamboo({
			webgl: this.webgl,
			collector: this.collector,
			onload: this.onGLBLoaded,
		});
	}

	addMushroom() {
		this.mushroom = new Mushroom({
			webgl: this.webgl,
			collector: this.collector,
			onload: this.onGLBLoaded,
		});
	}

	addCharacter(onMushroomTrigger, onBambooTrigger, onGameOver) {
		this.character = new Character({
			webgl: this.webgl,
			onMushroomTrigger,
			onBambooTrigger,
			onGameOver,
			collector: this.collector,
			stopRender: () => {
				this.controller?.stop();
				this.bamboo.stop();
				this.mushroom.stop();
				this.cubes.stop();
			},
			onload: this.onGLBLoaded,
		});
	}

	addCubes(onGameOver) {
		this.cubes = new Cubes({
			webgl: this.webgl,
			onGameOver,
			collector: this.collector,
			onGameCountDown: this.onGameCountDown,
			stopRender: (dropIndex) => {
				this.controller?.stop();
				this.bamboo.stop(dropIndex);
				this.mushroom.stop(dropIndex);
				this.cubes.stop();
				this.character.kickOut();
			},
			onload: this.onGLBLoaded,
		});
	}

	update() {
		const { enterframe } = this.webgl;
		enterframe.add((e) => {
			const { delta } = e;
			if (this.gameStart) {
				if (this.firstDelta === false) this.firstDelta = delta;
				const currentDelta = delta - this.firstDelta;
				this.bamboo?.update(currentDelta);
				this.mushroom?.update(currentDelta);
				this.cubes?.update(currentDelta);
			}
			if (this.controller && !this.stopMove) this.character.move(this.controller);
			this.character.update();
			// this.debuger?.update();
		});
		enterframe.play();
	}
}
