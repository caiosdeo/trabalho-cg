function behindKartCamera(camera, kart) {
  
  var position = (kart !== undefined) ? new THREE.Vector3(kart.position.x - 30, kart.position.y, 15) : new THREE.Vector3(-50, 0, 20);
  var upVec = new THREE.Vector3(0, 0, 1);
  let lookAt = new THREE.Vector3(kart.position.x, kart.position.y, kart.position.z);

  camera.position.copy(position);
  camera.up = upVec;
  camera.lookAt(lookAt);
  
}

function inspectCamera(camera, kart) {
  
  var position = new THREE.Vector3(40 + kart.position.x, 15, 20);
  var upVec = new THREE.Vector3(0, 0, 1);
  let lookAt = new THREE.Vector3(kart.position.x, kart.position.y, kart.position.z);

  camera.position.copy(position);
  camera.up = upVec;
  camera.lookAt(lookAt);
}

function main(){

  var stats = initStats();          // To show FPS information
  var scene = new THREE.Scene();    // Create main scene
  var renderer = initRenderer();    // View function in util/utils
  
  // * Coloca o Kart na cena
  let kart = new kartModel();
  let kartFloor = kart.getKart();
  let cameraMode;

  let light  = initDefaultLighting(scene, kartFloor.position);
  let camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000); // Init camera in this position

  behindKartCamera(camera, kartFloor);
  // inspectCamera(camera, kartFloor);

  // To use the keyboard
  var keyboard = new KeyboardState();
  let inspect = false;
  let behindKart = true; 

  // Enable mouse rotation, pan, zoom etc.
  var trackballControls = new THREE.TrackballControls( camera, renderer.domElement );

  // Show axes (parameter is size of each axis)
  var axesHelper = new THREE.AxesHelper( 100 );
  scene.add( axesHelper );

  //---------------------------------------------------------------------------------------
  // create the ground plane with wireframe
  var planeGeometry = new THREE.PlaneGeometry(7000, 7000, 40, 40);
  planeGeometry.translate(0.0, 0.0, -0.02); // To avoid conflict with the axeshelper
  var planeMaterial = new THREE.MeshBasicMaterial({
      color: "rgba(20, 30, 110)",
      side: THREE.DoubleSide,
      polygonOffset: true,
      polygonOffsetFactor: 1, // positive value pushes polygon further away
      polygonOffsetUnits: 1
  });
  var plane = new THREE.Mesh(planeGeometry, planeMaterial);
  // scene.add(plane);

  var wireframe = new THREE.WireframeGeometry( planeGeometry );
  var line = new THREE.LineSegments( wireframe );
  line.material.color.setStyle( "rgb(180, 180, 180)" );  
  // scene.add(line);

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

  // Listen window size changes
  window.addEventListener( 'resize', function(){onWindowResize(camera, renderer)}, false );

  scene.add(kartFloor);
  render();

  function keyboardUpdate() {

    keyboard.update();

    // Change camera
    if ( keyboard.down("space") ){ 

      inspect = !inspect;
      behindKart = !behindKart;
      cameraMode = (inspect && !behindKart) ? true : false;

      if(cameraMode){

        inspectCamera(camera, kartFloor);
  
      } else {
  
        behindKartCamera(camera, kartFloor)
      }

    }

    if(!cameraMode){
      // Control the kart
      if (keyboard.pressed("up")){
        kart.accelerate();
      }
      else{
        kart.inercia();
      }
      if (keyboard.pressed("down")){
        kart.break();
      }

      if (keyboard.pressed("right")){
        kart.incrementFrontWheelsAngle(2);
        kartFloor.matrixAutoUpdate = false;
        kartFloor.matrix.identity();

        let mat4 = new THREE.Matrix4();

        kartFloor.matrix.multiply(mat4.makeRotationZ(degreesToRadians(kart.getFrontWheelsAngle())));
      }else{
        kart.correctFrontWheelsLeft();
      }

      if (keyboard.pressed("left")){
        kart.decrementFrontWheelsAngle(2);
        kartFloor.matrixAutoUpdate = true;
        kartFloor.matrix.identity();

        let mat4 = new THREE.Matrix4();

        kartFloor.matrix.multiply(mat4.makeRotationZ(degreesToRadians(kart.getFrontWheelsAngle())));
      }else{
        kart.correctFrontWheelsRight();
      }

      behindKartCamera(camera, kartFloor);

    }
  }

  function render(){

    stats.update(); // Update FPS
    if(inspect){
      trackballControls.target = kartFloor.position;
      trackballControls.update(); // Enable mouse movements
      scene.remove(plane);
      scene.remove(line);
    }
    if (!cameraMode){
      scene.add(plane);
      scene.add(line); 
    }
    lightFollowingCamera(light, camera);
    requestAnimationFrame(render);
    keyboardUpdate();
    renderer.render(scene, camera) // Render scene
  }
}
