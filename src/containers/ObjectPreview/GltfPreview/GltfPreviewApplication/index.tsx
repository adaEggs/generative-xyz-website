import * as THREE from 'three';
import Base from './Base';
import { GLTF } from 'three/examples/jsm/loaders/GLTFLoader';
import { promiseAllCounting } from '../helpers';

class GltfPreviewApplication extends Base {
  onChainModel?: GLTF;

  loadMainModel(_url: string) {
    return new Promise(resolve => {
      // load main model
      this.objectLoader.loadGLBModel(_url).then(gltf => {
        this.onChainModel = gltf;

        this.onChainModel.scene.position.x = 0;
        this.onChainModel.scene.position.y = 0.5;
        this.onChainModel.scene.position.z = 0;

        this.onChainModel.scene.rotation.y = 6.3;

        this.colliders.worldOctree.fromGraphNode(this.onChainModel.scene);
        this.scene.add(this.onChainModel.scene);

        this.onChainModel.scene.traverse(function (mesh) {
          if ((mesh as THREE.Mesh).isMesh) {
            mesh.castShadow = true;
            mesh.receiveShadow = true;
          }
        });

        try {
          const size = this.getModelDimension(this.onChainModel.scene);
          if (size.y > 10) {
            this.camera.rotation.x = 0.35 + (size.y - 20) / 100;
          }
        } catch (e) {
          //
        }

        resolve(true);
      });
    });
  }

  loadHouseSetup() {
    return new Promise(resolve => {
      this.objectLoader.loadGLBModel('/models/candyHouse.glb').then(gltf => {
        const model = gltf.scene;
        this.scene.add(model);

        model.scale.x = 4;
        model.scale.y = 4;
        model.scale.z = 4;

        model.position.y = -1.1;

        this.colliders.worldOctree.fromGraphNode(model);

        model.traverse(mesh => {
          if ((mesh as THREE.Mesh).isMesh) {
            mesh.castShadow = true;
            mesh.receiveShadow = true;
            if (this.whiteHouse) {
              ((mesh as THREE.Mesh).material as THREE.MeshBasicMaterial).color =
                new THREE.Color(0xffffff);
            }
          }
        });

        resolve(true);
      });
    });
  }

  async start(
    _url: string,
    totalCounter: (total: number) => void,
    counter: (doneStep: number) => void,
    callback: () => void
  ) {
    await promiseAllCounting(
      [
        this.loadMainModel(_url),
        this.loadHouseSetup(),
        this.createSky(),
        this.decorObject.createGalaxyStars(),
        this.createDecoLights(),
      ],
      totalCounter,
      counter
    );

    callback();
  }

  render(): void {
    super.render();
    if (this.userController) {
      this.userController.update();
    }
  }
}

export default GltfPreviewApplication;
