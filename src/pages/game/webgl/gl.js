import * as dat from 'dat.gui';
import Webgl from 'lesca-webgl-threejs';
import Bamboo from './bamboo';
import Character from './character';
import { webglConfig } from './config';
import Controller from './controller';
import Cubes from './cubes';
import Mushroom from './mushroom';

export default class GL {
	constructor(dom) {
		this.webgl = new Webgl(webglConfig);
		this.webgl.controls.controls.enablePan = false;
		dom.appendChild(this.webgl.render.domElement);

		this.cubes = null;
		this.character = null;
		this.mushroom = null;
		this.bamboo = null;
		this.controller = null;
		// this.cannonDebugger = this.webgl.addCannonDebuger();

		this.addGUI();
		this.addCubes();
		this.addCharacter();
		// this.addMushroom();
		// this.addBamboo();
		this.addController();
		this.update();

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
		this.bamboo = new Bamboo({ webgl: this.webgl });
	}

	addMushroom() {
		this.mushroom = new Mushroom({ webgl: this.webgl });
	}

	addCharacter() {
		this.character = new Character({ webgl: this.webgl });
	}

	addCubes() {
		this.cubes = new Cubes({ webgl: this.webgl });
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

		const characterGUI = gui.addFolder('character');
		const wave = {
			揮手: () => this.character.wave(),
			跑步: () => this.character.walk(),
			掉落: () => this.character.down(),
		};
		characterGUI.add(wave, '揮手');
		characterGUI.add(wave, '跑步');
		characterGUI.add(wave, '掉落');

		const Debug = gui.addFolder('debug');
		const debug = { mesh: true };
		Debug.add(debug, 'mesh').onChange((v) => {
			this.cubes?.visible(v);
			this.character?.visible(v);
			this.bamboo?.visible(v);
			this.mushroom?.visible(v);
		});
	}

	update() {
		const { enterframe, stats } = this.webgl;
		enterframe.add(() => {
			this.character.move(this.controller.direct);
			this.cannonDebugger?.update();
			this.bamboo?.update();
			this.mushroom?.update();
			this.character?.update();
			stats.end();
		});
	}
}
