import * as THREE from 'three';
import Stats from 'three/examples/jsm/libs/stats.module.js';

class jiananMap {
  constructor(canvasWidth, canvasHeight) {
    this.canvasWidth = canvasWidth || window.innerWidth;
    this.canvasHeight = canvasHeight || window.innerHeight;
  }

  init() {
    console.log(this.canvasWidth, this.canvasHeight);
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(75, this.canvasWidth / this.canvasHeight, 0.1, 10000);
    this.renderer = new THREE.WebGLRenderer();
    this.renderer.setSize(this.canvasWidth, this.canvasHeight);
    this.stats = new Stats();
    document.body.appendChild(this.renderer.domElement);
    this.createCube();
    // 加载性能测试fps组件
    this.loadStats();
    this.animate();
    this.fetchData();
  }

  loadStats() {
    document.body.appendChild(this.stats.domElement);
  }

  fetchData() {
    fetch('./assets/jingan.geojson').then((res) => {
      res.json().then((data) => {
        if (data.type === 'FeatureCollection') {
          this.loadBuildings(data.features);
        }
      });
    });
  }

  loadBuildings(features) {
    console.log(features);
  }

  createCube() {
    // 创建一个立方体
    const geometry = new THREE.BoxGeometry();
    // 定义材质
    const meterial = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
    this.cube = new THREE.Mesh(geometry, meterial);
    this.scene.add(this.cube);
    this.camera.position.z = 5;
  }

  animate() {
    requestAnimationFrame(this.animate.bind(this));
    this.renderer.render(this.scene, this.camera);
    this.cube.rotation.x += 0.01;
    this.cube.rotation.y += 0.01;
    this.stats.update();
  }
}

export default jiananMap;
