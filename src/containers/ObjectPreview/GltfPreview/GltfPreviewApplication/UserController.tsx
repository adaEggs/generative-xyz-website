/* eslint-disable @typescript-eslint/ban-ts-comment */
import * as THREE from 'three';
import { Capsule } from 'three/examples/jsm/math/Capsule';
import { Octree } from 'three/examples/jsm/math/Octree';
import GltfPreviewApplication from '.';
import {
  PLAYER_CAPSULE_START,
  PLAYER_CAPSULE_END,
  PLAYER_CAPSULE_RADIUS,
  GRAVITY,
  DEFAULT_CAMERA_ROTATION,
} from './constants';

class UserController {
  character?: THREE.Object3D;

  gravity = GRAVITY;
  // First person shooter
  isFPS = true;
  application: GltfPreviewApplication;
  worldOctree: Octree;
  playerCollider: Capsule;

  keyStates: Record<string, boolean> = {};
  playerVelocity: THREE.Vector3;
  playerDirection: THREE.Vector3;

  playerOnFloor = false;

  constructor(_app: GltfPreviewApplication) {
    this.application = _app;
    this.worldOctree = new Octree();

    this.playerCollider = new Capsule(
      new THREE.Vector3(...PLAYER_CAPSULE_START),
      new THREE.Vector3(...PLAYER_CAPSULE_END),
      PLAYER_CAPSULE_RADIUS
    );

    this.keyStates = {};
    this.playerVelocity = new THREE.Vector3();
    this.playerDirection = new THREE.Vector3();

    this.addEventListeners();
    this.loaderCharacter();
  }

  updateCharacterPosition() {
    if (this.character) {
      this.character.position.copy(this.application.camera.position);
    }
  }
  loaderCharacter() {
    setTimeout(async () => {
      if (!this.character) {
        const object = await this.application.loadFBXModel(
          '/models/wizardbroom.fbx'
        );

        const box = this.application.getModelDimension(object);
        const scaleSize = 1 / box.y;
        object.scale.x = scaleSize;
        object.scale.y = scaleSize;
        object.scale.z = scaleSize;

        object.traverse(child => {
          if ((child as THREE.Mesh).isMesh) {
            child.castShadow = true;
            child.receiveShadow = true;
          }
        });
        this.character = object;
      }
    }, 1000);
  }

  addEventListeners() {
    document.addEventListener('keydown', event => {
      this.keyStates[event.code] = true;
    });
    document.addEventListener('keyup', event => {
      this.keyStates[event.code] = false;

      if (event.code === 'KeyV') {
        // change to view
        this.isFPS = !this.isFPS;

        if (this.character) {
          if (this.isFPS) {
            this.application.scene.remove(this.character);
          } else {
            this.application.scene.add(this.character);
          }
        }
      }
    });

    document.body.addEventListener('mousedown', () => {
      document.body.requestPointerLock();
    });

    document.body.addEventListener('mousemove', event => {
      if (document.pointerLockElement === document.body) {
        const { movementX, movementY } = event;
        this.application.camera.rotation.y -= movementX / 500;
        this.application.camera.rotation.x -= movementY / 500;
        if (this.application.camera.rotation.x > 1) {
          this.application.camera.rotation.x = 1;
        }
        if (this.application.camera.rotation.x < -1) {
          this.application.camera.rotation.x = -1;
        }
      }
    });
  }

  playerCollisions() {
    const result = this.worldOctree.capsuleIntersect(this.playerCollider);
    this.playerOnFloor = false;
    if (result) {
      this.playerOnFloor = result.normal.y > 0;
      if (!this.playerOnFloor) {
        this.playerVelocity.addScaledVector(
          result.normal,
          -result.normal.dot(this.playerVelocity)
        );
      }
      this.playerCollider.translate(result.normal.multiplyScalar(result.depth));
    }
  }

  updatePlayer(deltaTime: number) {
    if (this.worldOctree && this.playerCollider) {
      let damping = Math.exp(-4 * deltaTime) - 1;
      if (!this.playerOnFloor) {
        this.playerVelocity.y -= this.gravity * deltaTime;
        // small air resistance
        damping *= 0.1;
      }
      this.playerVelocity.addScaledVector(this.playerVelocity, damping);
      const deltaPosition = this.playerVelocity
        .clone()
        .multiplyScalar(deltaTime);
      this.playerCollider.translate(deltaPosition);
      this.playerCollisions();
      this.application.camera.position.copy(this.playerCollider.end);
    }
  }

  teleportPlayerIfOob() {
    if (this.application.camera.position.y <= -25) {
      //@ts-ignore
      this.playerCollider.start.set(...PLAYER_CAPSULE_START);

      //@ts-ignore
      this.playerCollider.end.set(...PLAYER_CAPSULE_END);
      this.playerCollider.radius = PLAYER_CAPSULE_RADIUS;
      this.application.camera.position.copy(this.playerCollider.end);

      //@ts-ignore
      this.application.camera.rotation.set(...DEFAULT_CAMERA_ROTATION);
    }
  }

  getForwardVector() {
    this.application.camera.getWorldDirection(this.playerDirection);
    this.playerDirection.y = 0;
    this.playerDirection.normalize();
    return this.playerDirection;
  }

  getSideVector() {
    this.application.camera.getWorldDirection(this.playerDirection);
    this.playerDirection.y = 0;
    this.playerDirection.normalize();
    this.playerDirection.cross(this.application.camera.up);
    return this.playerDirection;
  }

  controls(deltaTime: number) {
    const speedDelta = this.playerOnFloor ? deltaTime * 30 : deltaTime;
    if (this.worldOctree && this.playerCollider) {
      // gives a bit of air control

      if (this.keyStates['KeyW']) {
        this.playerVelocity.add(
          this.getForwardVector().multiplyScalar(speedDelta)
        );
      }
      if (this.keyStates['KeyS']) {
        this.playerVelocity.add(
          this.getForwardVector().multiplyScalar(-speedDelta)
        );
      }
      if (this.keyStates['KeyA']) {
        this.playerVelocity.add(
          this.getSideVector().multiplyScalar(-speedDelta)
        );
      }
      if (this.keyStates['KeyD']) {
        this.playerVelocity.add(
          this.getSideVector().multiplyScalar(speedDelta)
        );
      }
      if (this.playerOnFloor) {
        if (this.keyStates['Space']) {
          this.playerVelocity.y = 5;
        }
      }
    }
  }

  update() {
    const deltaTime = this.application.clock.getDelta();

    this.controls(deltaTime);
    this.updatePlayer(deltaTime);
    if (this.isFPS) {
      this.updateCharacterPosition();
      this.teleportPlayerIfOob();
    }
  }
}

export default UserController;
