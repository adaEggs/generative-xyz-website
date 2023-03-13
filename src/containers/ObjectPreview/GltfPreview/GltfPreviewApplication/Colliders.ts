import * as THREE from 'three';
import { Capsule } from 'three/examples/jsm/math/Capsule';
import { Octree } from 'three/examples/jsm/math/Octree';
import {
  PLAYER_CAPSULE_START,
  PLAYER_CAPSULE_END,
  PLAYER_CAPSULE_RADIUS,
} from './constants';

class Colliders {
  worldOctree: Octree;
  playerCollider: Capsule;

  constructor() {
    this.worldOctree = new Octree();

    this.playerCollider = new Capsule(
      new THREE.Vector3(...PLAYER_CAPSULE_START),
      new THREE.Vector3(...PLAYER_CAPSULE_END),
      PLAYER_CAPSULE_RADIUS
    );
  }
}

export default Colliders;
