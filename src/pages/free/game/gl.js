import * as dat from 'dat.gui';
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
		onModulesLoaded,
		onGameCountDown,
		onGameOver,
		onCameraZoomOuted,
	}) {
		this.webgl = new Webgl(webglConfig);
		this.webgl.controls.controls.enablePan = false;
		this.webgl.render.outputEncoding = THREE.sRGBEncoding;
		// this.webgl.render.outputEncoding = THREE.LinearEncoding;
		this.onMushroomTrigger = onMushroomTrigger;
		this.onModulesLoaded = onModulesLoaded;
		this.onGameOver = onGameOver;
		this.onCameraZoomOuted = onCameraZoomOuted;
		this.onGameCountDown = onGameCountDown;
		this.moreLights = [
			{ x: 3, y: 1.5, z: 3 },
			{ x: -3, y: 1.5, z: 3 },
		];

		this.collector = new Collector();
		this.cubes = null;
		this.character = null;
		this.mushroom = null;
		this.bamboo = null;
		this.controller = null;

		// controls
		this.lookTarget = { x: 0, y: 0, z: 0 };
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
		this.addGUI();
		this.addMoreLight();

		const onWindowResize = () => {
			const { camera, renderer } = this.webgl;
			camera.aspect = window.innerWidth / window.innerHeight;
			camera.updateProjectionMatrix();
			renderer.renderer.setSize(window.innerWidth, window.innerHeight);
		};
		window.addEventListener('resize', onWindowResize, false);
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

			// const helper = new THREE.PointLightHelper(light);
			// scene.add(helper);
		});
	}

	addGUI() {
		const gui = new dat.GUI();
		const ambientLight = gui.addFolder('全域光(無陰影)');
		const { color } = this.webgl.scene.children[0];
		color.intensity = webglConfig.light.ambient.intensity;

		ambientLight.add(color, 'r', 0.0, 1.0, 0.1);
		ambientLight.add(color, 'g', 0.0, 1.0, 0.1);
		ambientLight.add(color, 'b', 0.0, 1.0, 0.1);
		ambientLight.add(color, 'intensity', 0.1, 5, 0.1).onChange((v) => {
			this.webgl.scene.children[0].intensity = v;
		});

		const pointLight = gui.addFolder('太陽光(有陰影)');
		const { color: color2, position } = this.webgl.scene.children[1];
		color2.intensity = webglConfig.light.point.intensity;

		pointLight.add(color2, 'r', 0.0, 1.0, 0.1);
		pointLight.add(color2, 'g', 0.0, 1.0, 0.1);
		pointLight.add(color2, 'b', 0.0, 1.0, 0.1);
		pointLight.add(color2, 'intensity', 0.1, 5, 0.1).onChange((v) => {
			this.webgl.scene.children[1].intensity = v;
		});

		pointLight.add(position, 'x', -10.0, 10.0, 0.1);
		pointLight.add(position, 'y', 0.0, 10.0, 0.1);
		pointLight.add(position, 'z', -10.0, 10.0, 0.1);

		const { render } = this.webgl;

		ambientLight.add(render, 'toneMappingExposure', 0, 2, 0.1);
	}

	start(dom) {
		dom.appendChild(this.webgl.render.domElement);
		this.update();
		this.character.wave();
		this.begin();
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
