import * as dat from 'dat.gui';
import Webgl from 'lesca-webgl-threejs';
import { webglConfig } from './config';
import Cubes from './cubes';
import Character from './character';

export default class GL {
	constructor(dom) {
		this.webgl = new Webgl(webglConfig);
		this.cubes = null;
		this.character = null;

		dom.appendChild(this.webgl.render.domElement);
		this.addGUI();
		this.addCubes();
		this.addCharacter();
	}

	addCharacter() {
		this.character = new Character({ webgl: this.webgl });
	}

	addCubes() {
		this.cubes = new Cubes({ webgl: this.webgl });
	}

	addGUI() {
		const effectController = Object.fromEntries(
			Object.entries(this.webgl.sky.sky.material.uniforms)
				.filter((item) => {
					if (item[0] === 'up' || item[0] === 'sunPosition') return false;
					return true;
				})
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

		const gui = new dat.GUI();
		const skyGUI = gui.addFolder('sky');
		skyGUI.add(effectController, 'turbidity', 0.0, 20.0, 0.1).onChange(guiChanged);
		skyGUI.add(effectController, 'rayleigh', 0.0, 4, 0.001).onChange(guiChanged);
		skyGUI.add(effectController, 'mieCoefficient', 0.0, 4, 0.001).onChange(guiChanged);
		skyGUI.add(effectController, 'mieDirectionalG', 0.0, 4, 0.001).onChange(guiChanged);
		skyGUI.add(effectController, 'azimuth', 0, Math.PI / 2, 0.001).onChange(guiChanged);
		skyGUI.add(effectController, 'inclination', 0, Math.PI / 2, 0.001).onChange(guiChanged);
		skyGUI.add(effectController, 'exposure', 0, 1, 0.001).onChange(guiChanged);
		// const characterGUI = gui.addFolder('character');

		// const wave = {
		// 	揮手: () => {},
		// };
		// characterGUI.add(wave, '揮手');
	}
}
