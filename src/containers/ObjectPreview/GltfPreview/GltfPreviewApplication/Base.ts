import * as THREE from 'three';
import { GLTFLoader, GLTF } from 'three/examples/jsm/loaders/GLTFLoader';
import { Sky } from 'three/examples/jsm/objects/Sky';
import UserController from './UserController';

class Base {
  container: HTMLDivElement;

  clock = new THREE.Clock();
  glTFLoader = new GLTFLoader();

  renderer!: THREE.WebGLRenderer;
  scene!: THREE.Scene;
  camera!: THREE.PerspectiveCamera;

  userController!: UserController;

  topLight!: THREE.SpotLight;
  bottomLight!: THREE.SpotLight;
  spotLight1!: THREE.SpotLight;
  spotLight2!: THREE.SpotLight;
  spotLight3!: THREE.SpotLight;
  spotLight4!: THREE.SpotLight;

  pointLight1!: THREE.PointLight;
  pointLight2!: THREE.PointLight;
  pointLight3!: THREE.PointLight;
  pointLight4!: THREE.PointLight;

  particle = new THREE.Object3D();

  constructor(id: string) {
    this.container = document.getElementById(id) as HTMLDivElement;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    this.userController = new UserController(this as any);

    this.createScene();
    this.createCamera();
    this.createRenderer();
    this.createFloor();
    this.createLights();

    this.onWindowResize = this.onWindowResize.bind(this);

    this.animate = this.animate.bind(this);

    this.animate();

    this.createGalaxyStars();
  }

  createGalaxyStars() {
    const geometry = new THREE.TetrahedronGeometry(0.5, 0);

    const material = new THREE.MeshPhongMaterial({
      color: 0xffffff,
      flatShading: true,
    });

    this.scene.add(this.particle);
    for (let i = 0; i < 1000; i++) {
      const mesh = new THREE.Mesh(geometry, material);
      mesh.position
        .set(Math.random() - 0.5, Math.random() - 0.5, Math.random() - 0.5)
        .normalize();
      mesh.position.multiplyScalar(90 + Math.random() * 700);
      mesh.rotation.set(
        Math.random() * 2,
        Math.random() * 2,
        Math.random() * 2
      );
      this.particle.add(mesh);
    }
  }

  createScene() {
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x000000);
    this.scene.fog = new THREE.Fog(0x000000, 1, 1000);
  }

  createCamera() {
    this.camera = new THREE.PerspectiveCamera(
      70,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );

    this.camera.rotation.order = 'YXZ';
    this.camera.rotation.y = 0.02;
    this.camera.rotation.x = 0.5;
  }

  createRenderer() {
    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.autoClear = false;
    this.renderer.setClearColor(0x000000, 0.0);
    this.renderer.shadowMap.enabled = true;
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.outputEncoding = THREE.sRGBEncoding;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 0.5;

    this.container.appendChild(this.renderer.domElement);
  }

  createLights() {
    const ambientLight = new THREE.AmbientLight(0xb9d5ff, 0.015);
    this.scene.add(ambientLight);

    // Top
    this.topLight = new THREE.SpotLight(0xffee88, 5);
    this.topLight.position.set(0, 100, 0);
    this.topLight.angle = 0.3;
    this.topLight.penumbra = 1;
    this.topLight.decay = 0;
    this.topLight.distance = 200;
    this.scene.add(this.topLight);

    this.bottomLight = new THREE.SpotLight(0xffee88, 5);
    this.bottomLight.position.set(0, -50, 0);
    this.bottomLight.angle = 0.3;
    this.bottomLight.penumbra = 1;
    this.bottomLight.decay = 0;
    this.bottomLight.distance = 200;
    this.scene.add(this.bottomLight);
    // const spotLightHelper1 = new THREE.SpotLightHelper(spotLight1);
    // this.scene.add(spotLightHelper1);

    this.spotLight1 = new THREE.SpotLight(0x7f00ff, 1);
    this.spotLight1.position.set(50, 0, 50);
    this.spotLight1.angle = 0.4;
    this.spotLight1.penumbra = 1;
    this.spotLight1.decay = 0;
    this.spotLight1.distance = 100;
    this.scene.add(this.spotLight1);
    // const spotLightHelper2 = new THREE.SpotLightHelper(this.spotLight2);
    // this.scene.add(spotLightHelper2);

    this.spotLight2 = new THREE.SpotLight(0xff7f00, 1);
    this.spotLight2.position.set(-50, 0, 50);
    this.spotLight2.angle = 0.4;
    this.spotLight2.penumbra = 1;
    this.spotLight2.decay = 0;
    this.spotLight2.distance = 100;
    this.scene.add(this.spotLight2);
    // // const spotLightHelper3 = new THREE.SpotLightHelper(spotLight3);
    // // this.scene.add(spotLightHelper3);

    this.spotLight3 = new THREE.SpotLight(0xb00c3f, 1);
    this.spotLight3.position.set(50, 0, -50);
    this.spotLight3.angle = 0.4;
    this.spotLight3.penumbra = 1;
    this.spotLight3.decay = 0;
    this.spotLight3.distance = 100;
    this.scene.add(this.spotLight3);
    // // const spotLightHelper4 = new THREE.SpotLightHelper(spotLight4);
    // // this.scene.add(spotLightHelper4);

    this.spotLight4 = new THREE.SpotLight(0x0c8cbf, 1);
    this.spotLight4.position.set(-50, 0, -50);
    this.spotLight4.angle = 0.4;
    this.spotLight4.penumbra = 1;
    this.spotLight4.decay = 0;
    this.spotLight4.distance = 100;
    this.scene.add(this.spotLight4);

    const pointLightSphere = new THREE.SphereGeometry(0.1, 16, 8);
    this.pointLight1 = new THREE.PointLight(0xff0040, 2, 50);
    this.pointLight1.add(
      new THREE.Mesh(
        pointLightSphere,
        new THREE.MeshBasicMaterial({ color: 0xff0040 })
      )
    );
    this.scene.add(this.pointLight1);

    this.pointLight2 = new THREE.PointLight(0x0040ff, 2, 50);
    this.pointLight2.add(
      new THREE.Mesh(
        pointLightSphere,
        new THREE.MeshBasicMaterial({ color: 0x0040ff })
      )
    );
    this.scene.add(this.pointLight2);

    this.pointLight3 = new THREE.PointLight(0x80ff80, 2, 50);
    this.pointLight3.add(
      new THREE.Mesh(
        pointLightSphere,
        new THREE.MeshBasicMaterial({ color: 0x80ff80 })
      )
    );
    this.scene.add(this.pointLight3);

    this.pointLight4 = new THREE.PointLight(0xffaa00, 2, 50);
    this.pointLight4.add(
      new THREE.Mesh(
        pointLightSphere,
        new THREE.MeshBasicMaterial({ color: 0xffaa00 })
      )
    );
    this.scene.add(this.pointLight4);
  }

  createSky() {
    const sky = new Sky();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (sky.material as any).color = new THREE.Color(0xffe87c);
    sky.scale.setScalar(450000);
    this.scene.add(sky);
    const effectController = {
      turbidity: 10,
      rayleigh: 3,
      mieCoefficient: 0.005,
      mieDirectionalG: 0.7,
      elevation: 28,
      azimuth: -122,
      exposure: this.renderer.toneMappingExposure,
    };
    const uniforms = sky.material.uniforms;
    uniforms['turbidity'].value = effectController.turbidity;
    uniforms['rayleigh'].value = effectController.rayleigh;
    uniforms['mieCoefficient'].value = effectController.mieCoefficient;
    uniforms['mieDirectionalG'].value = effectController.mieDirectionalG;

    const sun = new THREE.Vector3();
    const phi = THREE.MathUtils.degToRad(90 - effectController.elevation);
    const theta = THREE.MathUtils.degToRad(effectController.azimuth);
    sun.setFromSphericalCoords(1, phi, theta);
    uniforms['sunPosition'].value.copy(sun);
    this.renderer.toneMappingExposure = effectController.exposure;
  }

  createFloor() {
    const floorGeo = new THREE.PlaneGeometry(500, 500, 1, 1);
    const floorMat = new THREE.MeshBasicMaterial();
    floorMat.opacity = 0;
    floorMat.transparent = true;

    const floor = new THREE.Mesh(floorGeo, floorMat);
    floor.rotation.x = -Math.PI / 2;
    floor.position.y = 0;
    this.scene.add(floor);

    this.userController.worldOctree.fromGraphNode(floor);
  }

  onWindowResize() {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }

  animate() {
    requestAnimationFrame(this.animate);
    this.render();
  }

  render() {
    this.renderer.render(this.scene, this.camera);

    this.particle.rotation.x += 0.0;
    this.particle.rotation.y -= 0.004;

    const sLTime = performance.now() / 1000;
    this.topLight.position.x = Math.cos(sLTime) * 25;
    this.topLight.position.z = Math.sin(sLTime) * 25;

    this.bottomLight.position.x = -Math.cos(sLTime) * 25;
    this.bottomLight.position.z = -Math.sin(sLTime) * 25;

    const plTime = Date.now() * 0.0005;
    this.pointLight1.position.x = Math.sin(plTime * 0.7) * 10;
    this.pointLight1.position.y = Math.cos(plTime * 0.5) * 30;
    this.pointLight1.position.z = Math.cos(plTime * 0.3) * 10;

    this.pointLight2.position.x = Math.cos(plTime * 0.3) * 10;
    this.pointLight2.position.y = Math.sin(plTime * 0.5) * 20;
    this.pointLight2.position.z = Math.sin(plTime * 0.7) * 10;

    this.pointLight3.position.x = Math.sin(plTime * 0.7) * 10;
    this.pointLight3.position.y = Math.cos(plTime * 0.3) * 20;
    this.pointLight3.position.z = Math.sin(plTime * 0.5) * 10;

    this.pointLight4.position.x = Math.sin(plTime * 0.3) * 10;
    this.pointLight4.position.y = Math.cos(plTime * 0.7) * 20;
    this.pointLight4.position.z = Math.sin(plTime * 0.5) * 10;
  }

  async loadModel(url: string): Promise<GLTF> {
    return new Promise(resolve => {
      this.glTFLoader.load(url, gltf => {
        resolve(gltf);
      });
    });
  }
}

export default Base;
