import { GLTFLoader, GLTF } from 'three/examples/jsm/loaders/GLTFLoader';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader';

class ObjectLoader {
  dracoLoader = new DRACOLoader();
  glTFLoader = new GLTFLoader();
  fbxLoader = new FBXLoader();

  constructor() {
    this.dracoLoader.setDecoderPath('/js/libs/draco/');

    this.glTFLoader.setDRACOLoader(this.dracoLoader);
  }

  async loadGLBModel(url: string): Promise<GLTF> {
    return new Promise(resolve => {
      this.glTFLoader.load(url, gltf => {
        resolve(gltf);
      });
    });
  }

  async loadFBXModel(url: string): Promise<THREE.Group> {
    return new Promise(resolve => {
      this.fbxLoader.load(url, group => {
        resolve(group);
      });
    });
  }
}

export default ObjectLoader;
