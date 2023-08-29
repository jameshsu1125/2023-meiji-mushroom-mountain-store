import Tweener, { Bezier } from 'lesca-object-tweener';
import Webgl from 'lesca-webgl-threejs';
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
		onModulesLoaded,
		onGameCountDown,
		onGameOver,
		onCameraZoomOuted,
	}) {
		this.webgl = new Webgl(webglConfig);
		this.webgl.controls.controls.enablePan = false;
		this.onMushroomTrigger = onMushroomTrigger;
		this.onModulesLoaded = onModulesLoaded;
		this.onGameOver = onGameOver;
		this.onCameraZoomOuted = onCameraZoomOuted;
		this.onGameCountDown = onGameCountDown;

		this.collector = new Collector();
		this.cubes = null;
		this.character = null;
		this.mushroom = null;
		this.bamboo = null;
		this.controller = null;

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

		this.addMushroom();
		this.addBamboo();
		this.addCubes(onGameOver);
		this.addCharacter(onMushroomTrigger, onGameOver);

		const onWindowResize = () => {
			const { camera, renderer } = this.webgl;
			camera.aspect = window.innerWidth / window.innerHeight;
			camera.updateProjectionMatrix();
			renderer.renderer.setSize(window.innerWidth, window.innerHeight);
		};
		window.addEventListener('resize', onWindowResize, false);
	}

	start(dom) {
		dom.appendChild(this.webgl.render.domElement);
		this.update();
		this.character.wave();
		this.zoomOut();
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

	addCharacter(onMushroomTrigger, onGameOver) {
		this.character = new Character({
			webgl: this.webgl,
			onMushroomTrigger,
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
			stopRender: () => {
				this.controller?.stop();
				this.bamboo.stop();
				this.mushroom.stop();
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
			if (this.controller) this.character.move(this.controller);
			this.character.update();
		});
		enterframe.play();
	}
}
