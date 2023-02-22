/* eslint-disable @typescript-eslint/ban-ts-comment */
import * as THREE from 'three';
import GltfPreviewApplication from '.';
import {
  PLAYER_CAPSULE_START,
  PLAYER_CAPSULE_END,
  PLAYER_CAPSULE_RADIUS,
  GRAVITY,
  DEFAULT_CAMERA_ROTATION,
} from './constants';

class UserController {
  character!: THREE.Object3D;

  gravity = GRAVITY;
  // First person shooter
  isFPS = true;
  application: GltfPreviewApplication;

  keyStates: Record<string, boolean> = {};
  playerVelocity: THREE.Vector3;
  playerDirection: THREE.Vector3;

  playerOnFloor = false;

  cameraOrigin = new THREE.Vector3();
  xAxis = new THREE.Vector3(1, 0, 0);
  tempCameraVector = new THREE.Vector3();
  tempModelVector = new THREE.Vector3();

  container = new THREE.Group();

  mousedown = false;

  constructor(_app: GltfPreviewApplication) {
    this.application = _app;

    this.keyStates = {};
    this.playerVelocity = new THREE.Vector3();
    this.playerDirection = new THREE.Vector3();

    this.addEventListeners();
    this.loaderCharacter();

    this.application.scene.add(this.container);
    this.container.add(this.application.camera);
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
        this.container.add(this.character);

        // this.application.scene.add(this.character);
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

        if (!this.isFPS) {
          this.cameraOrigin.copy(this.application.camera.position);
          this.application.camera.getWorldDirection(this.tempCameraVector);
          const cameraDirection = this.tempCameraVector.setY(0).normalize();
          this.cameraOrigin.addScaledVector(cameraDirection, -5);
          this.character.position.copy(this.cameraOrigin);
        }
      }
    });

    window.addEventListener('pointerdown', () => {
      this.mousedown = true;
    });

    window.addEventListener('pointerup', () => {
      this.mousedown = false;
    });

    window.addEventListener('pointermove', e => {
      if (this.mousedown) {
        const { movementX, movementY } = e;
        if (this.isFPS) {
          this.application.camera.rotation.y -= movementX / 500;
          this.application.camera.rotation.x -= movementY / 500;
          if (this.application.camera.rotation.x > 1) {
            this.application.camera.rotation.x = 1;
          }
          if (this.application.camera.rotation.x < -1) {
            this.application.camera.rotation.x = -1;
          }
        } else {
          const offset = new THREE.Spherical().setFromVector3(
            this.application.camera.position.clone().sub(this.cameraOrigin)
          );
          const phi = offset.phi - movementY * 0.02;
          offset.theta -= movementX * 0.02;
          offset.phi = Math.max(0.01, Math.min(0.35 * Math.PI, phi));
          this.application.camera.position.copy(
            this.cameraOrigin
              .clone()
              .add(new THREE.Vector3().setFromSpherical(offset))
          );
          this.application.camera.lookAt(
            this.container.position.clone().add(this.cameraOrigin)
          );
        }
      }
    });
  }

  playerCollisions() {
    const result = this.application.colliders.worldOctree.capsuleIntersect(
      this.application.colliders.playerCollider
    );
    this.playerOnFloor = false;
    if (result) {
      this.playerOnFloor = result.normal.y > 0;
      if (!this.playerOnFloor) {
        this.playerVelocity.addScaledVector(
          result.normal,
          -result.normal.dot(this.playerVelocity)
        );
      }
      this.application.colliders.playerCollider.translate(
        result.normal.multiplyScalar(result.depth)
      );
    }
  }

  updatePlayer(deltaTime: number) {
    if (
      this.application.colliders.worldOctree &&
      this.application.colliders.playerCollider
    ) {
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
      this.application.colliders.playerCollider.translate(deltaPosition);
      this.playerCollisions();
      this.application.camera.position.copy(
        this.application.colliders.playerCollider.end
      );
    }
  }

  teleportPlayerIfOob() {
    if (this.application.camera.position.y <= -25) {
      this.application.colliders.playerCollider.start.set(
        // @ts-ignore
        ...PLAYER_CAPSULE_START
      );

      // @ts-ignore
      this.application.colliders.playerCollider.end.set(...PLAYER_CAPSULE_END);
      this.application.colliders.playerCollider.radius = PLAYER_CAPSULE_RADIUS;
      this.application.camera.position.copy(
        this.application.colliders.playerCollider.end
      );

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
    if (
      this.application.colliders.worldOctree &&
      this.application.colliders.playerCollider
    ) {
      // gives a bit of air control

      if (this.keyStates['KeyW']) {
        if (this.isFPS) {
          this.playerVelocity.add(
            this.getForwardVector().multiplyScalar(speedDelta)
          );
        } else {
          // Get the X-Z plane in which camera is looking to move the player
          this.application.camera.getWorldDirection(this.tempCameraVector);
          const cameraDirection = this.tempCameraVector.setY(0).normalize();

          // Get the X-Z plane in which player is looking to compare with camera
          this.character.getWorldDirection(this.tempModelVector);
          const playerDirection = this.tempModelVector.setY(0).normalize();

          // Get the angle to x-axis. z component is used to compare if the angle is clockwise or anticlockwise since angleTo returns a positive value
          const cameraAngle =
            cameraDirection.angleTo(this.xAxis) *
            (cameraDirection.z > 0 ? 1 : -1);
          const playerAngle =
            playerDirection.angleTo(this.xAxis) *
            (playerDirection.z > 0 ? 1 : -1);

          // Get the angle to rotate the player to face the camera. Clockwise positive
          const angleToRotate = playerAngle - cameraAngle;

          // Get the shortest angle from clockwise angle to ensure the player always rotates the shortest angle
          let sanitisedAngle = angleToRotate;
          if (angleToRotate > Math.PI) {
            sanitisedAngle = angleToRotate - 2 * Math.PI;
          }
          if (angleToRotate < -Math.PI) {
            sanitisedAngle = angleToRotate + 2 * Math.PI;
          }

          // Rotate the model by a tiny value towards the camera direction
          this.character.rotateY(
            Math.max(-0.05, Math.min(sanitisedAngle, 0.05))
          );

          this.container.position.add(
            cameraDirection.multiplyScalar(speedDelta)
          );
          this.application.camera.lookAt(
            this.container.position.clone().add(this.cameraOrigin)
          );
        }
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

    if (this.isFPS) {
      this.controls(deltaTime);
      this.updatePlayer(deltaTime);
      this.teleportPlayerIfOob();
    } else {
      this.controls(deltaTime);
      // console.log(this.application.camera.position, this.cameraOrigin);
      // console.log(this.character.position);
    }
  }
}

export default UserController;
