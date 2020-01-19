(function() {
  var scene = new THREE.Scene();
  var camera = new THREE.PerspectiveCamera(
    45,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );
  var webGLRenderer = new THREE.WebGLRenderer();
  webGLRenderer.setClearColor(new THREE.Color(0x000000, 1.0));
  webGLRenderer.setSize(window.innerWidth, window.innerHeight);
  webGLRenderer.shadowMapEnabled = true;
  camera.position.x = -30;
  camera.position.y = 40;
  camera.position.z = 50;
  camera.lookAt(new THREE.Vector3(10, 0, 0));
  webGLRenderer.domElement.classList.add("canvas");
  document.getElementById("render").append(webGLRenderer.domElement);

  var step = 0;
  var knot;
  var controls = new (function() {
    this.radius = 40;
    this.tube = 28.2;
    this.radialSegments = 600;
    this.tubularSegments = 12;
    this.p = 5;
    this.q = 4;
    this.heightScale = 6;
    this.asParticles = true;
    this.rotate = true;

    this.redraw = function() {
      if (knot) scene.remove(knot);
      var geom = new THREE.TorusKnotGeometry(
        controls.radius,
        controls.tube,
        Math.round(controls.radialSegments),
        Math.round(controls.tubularSegments),
        Math.round(controls.p),
        Math.round(controls.q),
        controls.heightScale
      );

      if (controls.asParticles) knot = createParticleSystem(geom);
      else knot = createMesh(geom);
      scene.add(knot);
    };
  })();

  controls.redraw();

  render();

  function generateSprite() {
    let canvas = document.createElement("canvas");
    canvas.width = 12;
    canvas.height = 12;

    let context = canvas.getContext("2d");
    let gradient = context.createRadialGradient(
      canvas.width / 2,
      canvas.height / 2,
      0,
      canvas.width / 2,
      canvas.height / 2,
      canvas.width / 2
    );
    gradient.addColorStop(0, "rgba(255,255,255,1)");
    gradient.addColorStop(0.2, "rgba(0,255,255,1)");
    gradient.addColorStop(0.4, "rgba(0,0,64,1)");
    gradient.addColorStop(1, "rgba(0,0,0,1)");

    context.fillStyle = gradient;
    context.fillRect(0, 0, canvas.width, canvas.height);

    let texture = new THREE.Texture(canvas);
    texture.needsUpdate = true;
    return texture;
  }

  function createParticleSystem(geom) {
    var material = new THREE.ParticleBasicMaterial({
      color: 0xffffff,
      size: 3,
      transparent: true,
      blending: THREE.AdditiveBlending,
      map: generateSprite()
    });

    var system = new THREE.ParticleSystem(geom, material);
    system.sortParticles = true;
    return system;
  }

  function createMesh(geom) {
    var meshMaterial = new THREE.MeshNormalMaterial({});
    meshMaterial.side = THREE.DoubleSide;
    var mesh = THREE.SceneUtils.createMultiMaterialObject(geom, [meshMaterial]);
    return mesh;
  }

  function render() {
    if (controls.rotate) {
      knot.rotation.y = step += 0.003;
    }
    requestAnimationFrame(render);
    webGLRenderer.render(scene, camera);
  }
})();
