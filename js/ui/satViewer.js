// Khung xem mô hình 3D vệ tinh trong bảng thông tin. Canvas được tạo một lần và
// được gắn lại vào bảng mỗi khi bảng vẽ lại, nên ngữ cảnh WebGL không bị tạo mới.
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { buildSatellite } from '../models/satellites.js';
import { disposeTree } from '../core/engine.js';

const HIGHLIGHT = new THREE.Color(0x4fd1ff);

export class SatViewer {
  constructor() {
    this.canvas = document.createElement('canvas');
    this.canvas.className = 'sat-canvas';
    this.renderer = new THREE.WebGLRenderer({ canvas: this.canvas, antialias: true, alpha: true });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;

    this.scene = new THREE.Scene();
    const pmrem = new THREE.PMREMGenerator(this.renderer);
    this.scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
    const sun = new THREE.DirectionalLight(0xffffff, 2.2);
    sun.position.set(5, 8, 6);
    this.scene.add(sun, new THREE.AmbientLight(0xffffff, 0.25));

    this.camera = new THREE.PerspectiveCamera(35, 1, 0.01, 2000);
    this.controls = new OrbitControls(this.camera, this.canvas);
    this.controls.enableDamping = true;
    this.controls.autoRotate = true;
    this.controls.autoRotateSpeed = 1.2;
    this.controls.enablePan = false;
    this.canvas.addEventListener('pointerdown', () => { this.controls.autoRotate = false; });

    this.id = null;
    this.model = null;
    this.active = null;
  }

  /** Gắn canvas vào phần tử chứa và hiển thị vệ tinh id. */
  mount(container, id) {
    container.appendChild(this.canvas);
    if (id !== this.id) this.show(id);
    this.resize();
  }

  show(id) {
    if (this.model) { this.scene.remove(this.model.group); disposeTree(this.model.group); }
    this.id = id;
    this.model = buildSatellite(id);
    this.active = null;
    if (!this.model) return;
    this.scene.add(this.model.group);
    const sphere = new THREE.Box3().setFromObject(this.model.group).getBoundingSphere(new THREE.Sphere());
    this.model.group.position.sub(sphere.center);
    // nhìn chéo nên vật dài trông ngắn lại; 2,4 lần bán kính bao vừa khung ngang
    const dist = sphere.radius * 2.4;
    this.camera.position.set(0.9, 0.55, 1).normalize().multiplyScalar(dist);
    this.camera.near = dist / 100; this.camera.far = dist * 10;
    this.camera.updateProjectionMatrix();
    this.controls.target.set(0, 0, 0);
    this.controls.minDistance = dist * 0.3;
    this.controls.maxDistance = dist * 2.5;
    this.controls.autoRotate = true;
  }

  /** Làm sáng các mesh thuộc một bộ phận; gọi lại cùng key để tắt. */
  highlight(key) {
    this.active = this.active === key ? null : key;
    if (!this.model) return this.active;
    for (const [k, meshes] of Object.entries(this.model.parts)) {
      for (const m of meshes) {
        const mat = m.material;
        const base = (mat.userData.base ??= { transparent: mat.transparent, opacity: mat.opacity });
        const on = k === this.active, dim = this.active && !on;
        mat.emissive.set(on ? HIGHLIGHT : 0x000000);
        mat.emissiveIntensity = on ? 0.6 : 0;
        mat.transparent = dim || base.transparent;
        mat.opacity = dim ? 0.2 : base.opacity;
        mat.depthWrite = !dim;
        mat.needsUpdate = true;
      }
    }
    return this.active;
  }

  resize() {
    const w = this.canvas.clientWidth, h = this.canvas.clientHeight;
    if (!w || !h) return;
    if (this.canvas.width !== Math.floor(w * this.renderer.getPixelRatio())) {
      this.renderer.setSize(w, h, false);
      this.camera.aspect = w / h;
      this.camera.updateProjectionMatrix();
    }
  }

  render() {
    if (!this.model || !this.canvas.isConnected) return;
    this.resize();
    this.controls.update();
    this.renderer.render(this.scene, this.camera);
  }
}
