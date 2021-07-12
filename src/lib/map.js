import * as THREE from 'three';
import { MapControls } from 'three/examples/jsm/controls/OrbitControls';
import Stats from 'three/examples/jsm/libs/stats.module.js';
import mapUtils from './utils';
let sky, sun;
class jiananMap {
  constructor(canvasWidth, canvasHeight) {
    this.canvasWidth = canvasWidth || window.innerWidth;
    this.canvasHeight = canvasHeight || window.innerHeight;
  }

  init() {
    console.log(this.canvasWidth, this.canvasHeight);
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(75, this.canvasWidth / this.canvasHeight, 1, 100000);
    this.camera.position.set(3000, 500, 100);
    // 添加光源

    let light0 = new THREE.AmbientLight(0xfafafa, 1);
    let light1 = new THREE.PointLight(0xfafafa, 0.6);
    let light2 = new THREE.PointLight(0xfafafa, 0.6);

    this.scene.add(light0);
    // this.scene.add(light1);
    // this.scene.add(light2);

    this.renderer = new THREE.WebGLRenderer();
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setSize(this.canvasWidth, this.canvasHeight);
    this.MAT_BUILDING = new THREE.MeshPhongMaterial({ color: 0x3b92e9 });
    let gh = new THREE.GridHelper(14000, 180, new THREE.Color(0x555555), new THREE.Color(0x333333));
    // this.scene.add(gh);
    this.controls = new MapControls(this.camera, this.renderer.domElement);

    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.25;
    this.controls.screenSpacePanning = false;
    this.controls.maxDistance = 80000;

    this.controls.update();

    this.stats = new Stats();
    document.body.appendChild(this.renderer.domElement);
    // this.createCube();
    this.calcCenterMercator();

    // this.initSky();

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
    for (var i = 0; i < features.length; i++) {
      let fel = features[i];
      if (!fel['properties']) return;
      if (fel.properties['building']) {
        this.addbuilding(
          fel.geometry.coordinates,
          fel.properties,
          fel.properties['building:levels']
        );
      }
    }
  }

  addbuilding(coordinates, properties, level) {
    const config = {
      depth: level ? 5 * level : 10,
      bevelEnabled: false,
      curveSegments: 2,
    };
    let shape, geometry;
    let holes = [];
    // console.log(coordinates, properties, level);
    for (var i = 0; i < coordinates.length; i++) {
      if (i == 0) {
        shape = this.getShape(coordinates[i]);
      } else {
        holes.push(this.getShape(coordinates[i]));
      }
    }

    for (var i = 0; i < holes.length; i++) {
      shape.holes.push(holes[i]);
    }

    geometry = this.getGeometry(shape, config);
    geometry.rotateX(Math.PI / 2);
    geometry.rotateZ(Math.PI);
    let mesh = new THREE.Mesh(geometry, this.MAT_BUILDING);
    this.scene.add(mesh);
  }

  getShape(points) {
    let shape = new THREE.Shape();
    for (var i = 0; i < points.length; i++) {
      let elp = mapUtils.lonLat2Mercator({
        lng: points[i][0],
        lat: points[i][1],
      });
      // console.log(elp);
      if (i === 0) {
        shape.moveTo(elp.x, elp.y);
      } else {
        shape.lineTo(elp.x, elp.y);
      }
    }
    return shape;
  }

  getGeometry(shape, config) {
    let geometry = new THREE.ExtrudeBufferGeometry(shape, config);
    geometry.computeBoundingBox();

    return geometry;
  }

  calcCenterMercator() {
    // 121.4522673, 31.2519534;
    const center = {
      lng: 121.4522673,
      lat: 31.2519534,
    };
    const pos = mapUtils.lonLat2Mercators(center);
    console.log(pos);
  }

  createCube() {
    // 创建一个立方体
    const geometry = new THREE.BoxGeometry(1, 1, 1);
    // 定义材质
    const meterial = new THREE.MeshBasicMaterial({ color: 0x3b92e9 });
    this.cube = new THREE.Mesh(geometry, meterial);
    this.scene.add(this.cube);
    this.camera.position.z = 5;
  }

  animate() {
    requestAnimationFrame(this.animate.bind(this));
    this.renderer.render(this.scene, this.camera);
    this.controls.update();
    // this.cube.rotation.x += 0.01;
    // this.cube.rotation.y += 0.01;
    this.stats.update();
  }
}

export default jiananMap;
