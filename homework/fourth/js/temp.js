var drawScene = function () {
  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);
  camera.position.z = 5;

  renderer = new THREE.WebGLRenderer({antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);
};

var drawCube = function () {
  var geometry = new THREE.BoxGeometry(1, 1, 1);
  var material = new THREE.MeshLambertMaterial({color: 0x00ff00});
  cube = new THREE.Mesh(geometry, material);
  scene.add(cube);
};

var lightsOn = function () {
  var light = new THREE.PointLight(0xffffff);
  light.position.set(-100,200,1000);
  scene.add(light);
};

var createParticleSystem = function () {
  var particleCount = 1800,
      particles = new THREE.Geometry(),
      pMaterial = new THREE.PointsMaterial({
        color: 0xFFFFFF,
        size: 1.2,
        blending: THREE.AdditiveBlending,
        transparent: true,
        map: THREE.TextureLoader(
          "images/particle.png"
        ),
      });

  //Individual Particles
  for (var p = 0; p < particleCount; p++) {
    var pX = Math.random() * 500 - 250,
        pY = Math.random() * 500 - 250,
        pZ = Math.random() * 500 - 250,
        particle =new THREE.Vector3(pX, pY, pZ);
    particles.vertices.push(particle);
  }

  //Creates the particle system
  particleSystem = new THREE.Points(
      particles,
      pMaterial);
 particleSystem.sortParticles = true;

  scene.add(particleSystem);
};

var render = function () {
  requestAnimationFrame(render);
  particleSystem.rotation.y += 0.001;

  cube.rotation.x += 0.01;
  cube.rotation.y += 0.01;

  renderer.render(scene, camera);
};

drawScene();
drawCube();
lightsOn();
createParticleSystem();
render();
