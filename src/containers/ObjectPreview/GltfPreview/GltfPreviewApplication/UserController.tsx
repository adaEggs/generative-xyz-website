/* eslint-disable @typescript-eslint/ban-ts-comment */
import * as THREE from 'three';
import GltfPreviewApplication from '.';
import {
  PLAYER_CAPSULE_START,
  PLAYER_CAPSULE_END,
  PLAYER_CAPSULE_RADIUS,
  GRAVITY,
  DEFAULT_CAMERA_ROTATION,
  ORIGIN_CAMERA,
  CHARACTER_Y_ROTATION,
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

  cameraOrigin = new THREE.Vector3(...ORIGIN_CAMERA);
  xAxis = new THREE.Vector3(1, 0, 0);
  tempCameraVector = new THREE.Vector3();
  tempModelVector = new THREE.Vector3();

  container = new THREE.Group();

  mousedown = false;

  interactive = false;

  // sphere: THREE.Mesh;

  constructor(_app: GltfPreviewApplication) {
    this.application = _app;

    this.keyStates = {};
    this.playerVelocity = new THREE.Vector3();
    this.playerDirection = new THREE.Vector3();

    this.addEventListeners();
    this.loaderCharacter();

    this.application.scene.add(this.container);
    this.container.add(this.application.camera);

    // const geometry = new THREE.SphereGeometry(0.1, 32, 32);

    // const material = new THREE.MeshBasicMaterial({
    //   color: 0xff0000,
    //   // flatShading: true,
    // });
    // this.sphere = new THREE.Mesh(geometry, material);
  }

  initView() {
    if (this.isFPS) {
      this.gravity = GRAVITY;
      // this.container.remove(this.sphere);
      this.container.remove(this.character);
      this.application.camera.position.copy(this.cameraOrigin);
      // this.application.camera.rotation.x = 0.5;
    } else {
      this.gravity = 0;
      // this.container.add(this.sphere);
      this.container.add(this.character);
      this.application.camera.getWorldDirection(this.tempCameraVector);
      const cameraDirection = this.tempCameraVector.setY(0).normalize();

      this.cameraOrigin.copy(this.application.camera.position);
      this.application.camera.position.addScaledVector(cameraDirection, -1);

      // this.application.camera.position.y += 0.5;
      // this.application.camera.position.z -= 0.5;
      this.application.camera.lookAt(this.cameraOrigin);

      this.character.position.copy(this.cameraOrigin);

      // this.application.camera.rotation.x = -0.3;
      // this.application.camera.rotation.y = -0.1;
      // this.application.camera.rotation.z = 0;
    }
  }

  setCharacterRotation() {
    this.application.camera.getWorldDirection(this.tempCameraVector);
    const cameraDirection = this.tempCameraVector.setY(0).normalize();

    // Get the X-Z plane in which player is looking to compare with camera
    this.character.getWorldDirection(this.tempModelVector);
    const playerDirection = this.tempModelVector.setY(0).normalize();
    cameraDirection.angleTo(this.xAxis) * (cameraDirection.z > 0 ? 1 : -1);

    // Get the angle to x-axis. z component is used to compare if the angle is clockwise or anticlockwise since angleTo returns a positive value
    const cameraAngle =
      cameraDirection.angleTo(this.xAxis) * (cameraDirection.z > 0 ? 1 : -1);
    const playerAngle =
      playerDirection.angleTo(this.xAxis) * (playerDirection.z > 0 ? 1 : -1);

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
    this.character.rotateY(
      Math.max(-0.05, Math.min(sanitisedAngle + CHARACTER_Y_ROTATION, 0.05))
    );
  }

  loaderCharacter() {
    setTimeout(async () => {
      if (!this.character) {
        const object = await this.application.objectLoader.loadFBXModel(
          '/models/wizardbroom.fbx'
        );

        const box = this.application.getModelDimension(object);
        const scaleSize = 0.5 / box.y;
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

        this.setCharacterRotation();

        this.initView();
      }
    }, 1000);
  }

  addEventListeners() {
    document.addEventListener('keydown', event => {
      this.interactive = true;
      this.keyStates[event.code] = true;
    });
    document.addEventListener('keyup', event => {
      this.keyStates[event.code] = false;

      if (event.code === 'KeyV') {
        // change to view
        this.isFPS = !this.isFPS;

        this.interactive = false;

        this.initView();
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
          offset.phi = Math.max(0.01, Math.min(1 * Math.PI, phi));
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

  updateFirstPersonPlayer(deltaTime: number) {
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

  updateThirdPersonPlayer(deltaTime: number) {
    if (
      this.character &&
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
      this.cameraOrigin.copy(this.application.colliders.playerCollider.end);

      const oldObjectPosition = new THREE.Vector3();
      this.character.getWorldPosition(oldObjectPosition);

      // this.sphere.position.copy(this.cameraOrigin);
      this.character.position.copy(this.cameraOrigin);
      this.character.position.y =
        this.cameraOrigin.y -
        (PLAYER_CAPSULE_END[1] - PLAYER_CAPSULE_START[1]) / 2;

      const newObjectPosition = new THREE.Vector3();
      this.character.getWorldPosition(newObjectPosition);

      const delta = newObjectPosition.clone().sub(oldObjectPosition);

      this.application.camera.position.add(delta);

      this.setCharacterRotation();
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
    if (
      this.application.colliders.worldOctree &&
      this.application.colliders.playerCollider
    ) {
      // gives a bit of air control
      if (this.isFPS) {
        const speedDelta = this.playerOnFloor ? deltaTime * 30 : deltaTime;
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
      } else {
        if (this.interactive) {
          const speedDelta = deltaTime * 30 * 1.5;
          this.playerVelocity.add(
            this.getForwardVector().multiplyScalar(speedDelta)
          );
          if (this.keyStates['KeyW']) {
            this.playerVelocity.y += 0.5;
          }

          if (this.keyStates['KeyS']) {
            this.playerVelocity.y -= 0.5;
          }
        }
      }
    }
  }

  update() {
    const deltaTime = this.application.clock.getDelta();

    if (this.isFPS) {
      this.controls(deltaTime);
      this.updateFirstPersonPlayer(deltaTime);
      this.teleportPlayerIfOob();
    } else {
      this.controls(deltaTime);
      this.updateThirdPersonPlayer(deltaTime);
    }

    // console.log(this.application.camera.rotation);
  }
}

export default UserController;
