let rotation = 0;

function behindKartCamera(kart) {
  
  var position = (kart !== undefined) ? new THREE.Vector3(kart.position.x - 40, 0, 15) : new THREE.Vector3(-50, 0, 20);
  var upVec = new THREE.Vector3(0, 0, 1);

  var camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);

  camera.position.copy(position);
  camera.up = upVec;
  camera.lookAt(kart.position);
  
  return camera;

}

function inspectCamera() {
  
  var position = (newPosition !== undefined) ? newPosition : new THREE.Vector3(25, 25, 20);
  var lookAt = (newLookAt !== undefined) ? newLookAt : new THREE.Vector3(0, 0, 0);
  var upVec = (newUpVec !== undefined) ? newUpVec : new THREE.Vector3(0, 0, 1);
  var camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);

  camera.position.copy(position);
  camera.up = upVec;
  camera.lookAt(lookAt);
  
  return camera;

}

function main(){

  var stats = initStats();          // To show FPS information
  var scene = new THREE.Scene();    // Create main scene
  var renderer = initRenderer();    // View function in util/utils
  var light  = initDefaultLighting(scene, new THREE.Vector3(0, 0, 15));

  // * Coloca o Kart na cena
  let kart = new kartModel();
  kartFloor = kart.getKart();

  let camera = behindKartCamera(kartFloor); // Init camera in this position

  // To use the keyboard
  var keyboard = new KeyboardState();
  let inspect = false; 

  // Enable mouse rotation, pan, zoom etc.
  var trackballControls = new THREE.TrackballControls( camera, renderer.domElement );

  // Show axes (parameter is size of each axis)
  var axesHelper = new THREE.AxesHelper( 12 );
  scene.add( axesHelper );

  // create the ground plane
  var planeGeometry = new THREE.PlaneGeometry(100, 100);
  planeGeometry.translate(0.0, 0.0, -0.02); // To avoid conflict with the axeshelper
  var planeMaterial = new THREE.MeshPhongMaterial({
      color: "rgba(150, 150, 150)",
      side: THREE.DoubleSide,
  });
  var plane = new THREE.Mesh(planeGeometry, planeMaterial);
  // add the plane to the scene
  scene.add(plane);

  function showInformation(){
    // Use this to show information onscreen
    controls = new InfoBox();
      controls.add("Inspeção");
      controls.addParagraph();
      controls.add("Use mouse to interact:");
      controls.add("* Left button to rotate");
      controls.add("* Right button to translate (pan)");
      controls.add("* Scroll to zoom in/out.");
      controls.show();
  }

  if (inspect) {
    // Show text information onscreen
    showInformation();
  }

  // Listen window size changes
  window.addEventListener( 'resize', function(){onWindowResize(camera, renderer)}, false );

  scene.add(kartFloor);

  render();

  function keyboardUpdate() {

    keyboard.update();

    if ( keyboard.down("space") ){ 

      camera = inspectCamera();
      
    }

  }

  function render(){

    stats.update(); // Update FPS
    if(inspect){
      trackballControls.update(); // Enable mouse movements
    }
    lightFollowingCamera(light, camera);
    requestAnimationFrame(render);
    keyboardUpdate();
    renderer.render(scene, camera) // Render scene
  }
}
