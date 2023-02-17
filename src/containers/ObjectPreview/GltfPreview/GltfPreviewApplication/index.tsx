import * as THREE from 'three';
import Base from './Base';
import { GLTF } from 'three/examples/jsm/loaders/GLTFLoader';

class GltfPreviewApplication extends Base {
  onChainModel?: GLTF;

  getModelDimension(model: THREE.Object3D) {
    const box3 = new THREE.Box3().setFromObject(model);
    const size = new THREE.Vector3();
    return box3.getSize(size);
  }

  async loadMainModel(_url: string) {
    // load main model
    const gltf = await this.loadModel(_url);

    this.onChainModel = gltf;

    this.onChainModel.scene.position.x = 0;
    this.onChainModel.scene.position.y = -0.005;
    this.onChainModel.scene.position.z = 0;

    this.onChainModel.scene.rotation.y = 6.3;

    const circle = this.onChainModel.scene.getObjectByProperty(
      'name',
      'Circle'
    );

    if (circle) {
      this.onChainModel.scene.remove(circle);
    }

    this.userController?.worldOctree.fromGraphNode(this.onChainModel.scene);
    this.scene.add(this.onChainModel.scene);

    this.onChainModel.scene.traverse(function (mesh) {
      if (mesh.type === 'mesh') {
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
  }

  async loadHouseSetup() {
    const gltf = await this.loadModel('/models/Candy_Housesetup.glb');
    const model = gltf.scene;
    this.scene.add(model);

    model.scale.x = 0.3;
    model.scale.y = 0.3;
    model.scale.z = 0.3;

    model.position.z = -10;

    this.userController.worldOctree.fromGraphNode(model);

    model.traverse(function (mesh) {
      if (mesh.type === 'mesh') {
        mesh.castShadow = true;
        mesh.receiveShadow = true;
      }
    });
  }

  async start(_url: string, callback: () => void) {
    await this.loadMainModel(_url);

    // await this.loadHouseSetup();

    callback();
  }

  render(): void {
    super.render();
    if (this.userController) {
      this.userController.render();
    }
  }
}

export default GltfPreviewApplication;