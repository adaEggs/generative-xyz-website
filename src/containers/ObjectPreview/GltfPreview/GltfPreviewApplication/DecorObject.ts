import * as THREE from 'three';
import GltfPreviewApplication from '.';

class DecorObject {
  particle = new THREE.LOD();
  application: GltfPreviewApplication;

  constructor(_app: GltfPreviewApplication) {
    this.application = _app;
  }

  createGalaxyStars() {
    return new Promise(resolve => {
      this.application.scene.add(this.particle);

      const geometry = new THREE.SphereGeometry(0.5, 32, 32);

      const material = new THREE.MeshBasicMaterial({
        color: 0xffffff,
        // flatShading: true,
      });
      const sphere = new THREE.Mesh(geometry, material);
      for (let i = 0; i < 1000; i++) {
        const mesh = sphere.clone();

        const level = 90 + Math.random() * 700;
        mesh.position
          .set(Math.random() - 0.5, Math.random() - 0.5, Math.random() - 0.5)
          .normalize();
        mesh.position.multiplyScalar(level);
        mesh.rotation.set(
          Math.random() * 2,
          Math.random() * 2,
          Math.random() * 2
        );
        this.particle.add(mesh);
      }

      resolve(true);
    });
  }

  update() {
    this.particle.rotation.x += 0.0;
    this.particle.rotation.y -= 0.004;
  }
}

export default DecorObject;
