/*  Pixel Sweeper - ThreeD Service
    Common API for 3D rendering, used within the game for the level selection screen.
    3D objects are rendered using Three.js

    (C) 2021-2022 John Vincent M. Corcega - TenSeventy7
*/

import * as Three from '../external/three.js/three.module.js'
import {
    GLTFLoader
} from '../external/three.js/GLTFLoader.module.js';

const loader = new GLTFLoader();
let glAssets = [];

// Animate the ThreeD DOM
class ThreedAnimationService {
    constructor(gltf, scene, camera, renderer) {
        this.gltf = gltf;
        this.scene = scene;
        this.camera = camera;
        this.renderer = renderer;
    }

    animate() {
        requestAnimationFrame(this.animate.bind(this));
        this.gltf.scene.rotation.y += 0.01;
        this.renderer.render(this.scene, this.camera);
    }
}

export default class ThreedService {
    // Cache 3D model into memory for easy access
    preloadModel(key, asset, lightColor, lightInt) {
        glAssets.push({
            key: key,
            asset: asset,
            light: {
                "color": lightColor,
                "intensity": lightInt
            }
        });
    }

    // Load 3D model into scene
    loadModel(dom, key) {
        let glAsset = glAssets.find((glAsset) => {
            return glAsset.key === key;
        });

        const scene = new Three.Scene();
        const canvas = document.querySelector(dom);
        const camera = new Three.PerspectiveCamera(50, canvas.clientWidth / canvas.clientHeight, 0.1, 1000);
        const light = new Three.DirectionalLight(glAsset.light.color, glAsset.light.intensity);
        light.position.set(0, 4, 5);
        const renderer = new Three.WebGLRenderer({
            alpha: true
        });
        renderer.setSize(canvas.clientWidth, canvas.clientHeight);
        canvas.appendChild(renderer.domElement);

        loader.load(glAsset.asset, function (gltf) {
            scene.add(light)
            scene.add(gltf.scene);
            camera.position.z = 2;
            gltf.scene.rotation.x = 0.25;

            const animator = new ThreedAnimationService(gltf, scene, camera, renderer);
            animator.animate();
        }, undefined, function (error) {
            console.error("ThreeD: Error!", error);
        });
    }
}