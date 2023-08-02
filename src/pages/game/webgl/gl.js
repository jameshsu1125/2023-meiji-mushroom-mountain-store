import * as dat from 'dat.gui';
import Webgl from 'lesca-webgl-threejs';
import Bamboo from './bamboo';
import Character from './character';
import Collector from './collector';
import { webglConfig } from './config';
import Controller from './controller';
import Cubes from './cubes';
import Mushroom from './mushroom';

export default class GL {
	constructor({ dom, onMushroomTrigger, onModulesLoaded, onGameTimeUp, onGameOver }) {
		this.webgl = new Webgl(webglConfig);
		this.webgl.controls.controls.enablePan = false;
		dom.appendChild(this.webgl.render.domElement);
		this.onMushroomTrigger = onMushroomTrigger;
		this.onModulesLoaded = onModulesLoaded;
		this.onGameTimeUp = onGameTimeUp;
		this.onGameOver = onGameOver;

		this.collector = new Collector();
		this.cubes = null;
		this.character = null;
		this.mushroom = null;
		this.bamboo = null;
		this.controller = null;
		this.cannonDebugger = this.webgl.addCannonDebuger();

		// loader
		this.loaderData = {};
		this.onGLBLoaded = (target) => {
			this.loaderData[target] = true;
			const { length } = Object.keys(this.loaderData);
			if (length >= 4) {
				onModulesLoaded();
				this.addController();
				this.update();
			}
		};

		// updater
		this.firstDelta = false;

		this.addGUI();
		this.addCubes();
		this.addMushroom();
		this.addBamboo();
		this.addCharacter(onMushroomTrigger, onGameOver);

		const onWindowResize = () => {
			const { camera, renderer } = this.webgl;
			camera.aspect = window.innerWidth / window.innerHeight;
			camera.updateProjectionMatrix();
			renderer.renderer.setSize(window.innerWidth, window.innerHeight);
		};
		window.addEventListener('resize', onWindowResize, false);
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
				this.controller.stop();
				this.bamboo.stop();
				this.mushroom.stop();
				this.cubes.stop();
			},
			onload: this.onGLBLoaded,
		});
	}

	addCubes() {
		this.cubes = new Cubes({
			webgl: this.webgl,
			collector: this.collector,
			onload: this.onGLBLoaded,
		});
	}

	addGUI() {
		const gui = new dat.GUI();

		const effectController = Object.fromEntries(
			Object.entries(this.webgl.sky.sky.material.uniforms)
				.filter((item) => item[0] !== 'up' && item[0] !== 'sunPosition')
				.map((item) => [item[0], item[1].value]),
		);
		effectController.exposure = this.webgl.renderer.renderer.toneMappingExposure;
		effectController.azimuth = this.webgl.sky.options.azimuth;
		effectController.inclination = this.webgl.sky.options.inclination;
		const guiChanged = () => {
			const { uniforms } = this.webgl.sky.sky.material;
			uniforms.turbidity.value = effectController.turbidity;
			uniforms.rayleigh.value = effectController.rayleigh;
			uniforms.mieCoefficient.value = effectController.mieCoefficient;
			uniforms.mieDirectionalG.value = effectController.mieDirectionalG;

			this.webgl.renderer.renderer.toneMappingExposure = effectController.exposure;
			this.webgl.sky.options.azimuth = effectController.azimuth;
			this.webgl.sky.options.inclination = effectController.inclination;
			this.webgl.sky.update();
		};

		const skyGUI = gui.addFolder('sky');
		skyGUI.add(effectController, 'turbidity', 0.0, 20.0, 0.1).onChange(guiChanged);
		skyGUI.add(effectController, 'rayleigh', 0.0, 4, 0.001).onChange(guiChanged);
		skyGUI.add(effectController, 'mieCoefficient', 0.0, 4, 0.001).onChange(guiChanged);
		skyGUI.add(effectController, 'mieDirectionalG', 0.0, 4, 0.001).onChange(guiChanged);
		skyGUI.add(effectController, 'azimuth', 0, Math.PI / 2, 0.001).onChange(guiChanged);
		skyGUI.add(effectController, 'inclination', 0, Math.PI / 2, 0.001).onChange(guiChanged);
		skyGUI.add(effectController, 'exposure', 0, 1, 0.001).onChange(guiChanged);
	}

	update() {
		const { enterframe, stats } = this.webgl;
		enterframe.add((e) => {
			const { delta } = e;

			if (this.firstDelta === false) this.firstDelta = delta;
			const currentDelta = delta - this.firstDelta;
			this.character.move(this.controller.direct);
			this.cannonDebugger?.update();
			this.bamboo?.update(currentDelta);
			this.mushroom?.update(currentDelta);
			this.character?.update();
			this.cubes?.update(currentDelta);

			stats.end();
		});
	}
}
