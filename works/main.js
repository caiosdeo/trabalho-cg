function behindKartCamera(camera, kart, kartY, kartX) {
  
  var upVec = new THREE.Vector3(0, 0, 1);
  let lookAt = new THREE.Vector3(kartY, kartX, 1.5);
  
  var relativeCameraOffset = new THREE.Vector3(-40, 0, 12.5);
  var cameraOffset = relativeCameraOffset.applyMatrix4(kart.matrixWorld);
  camera.position.x = cameraOffset.x;
  camera.position.y = cameraOffset.y;
  camera.position.z = cameraOffset.z;

  camera.up = upVec;
  camera.lookAt(lookAt);
  
}

function inspectCamera(camera, kart, kartY, kartX) {
  
  var upVec = new THREE.Vector3(0, 0, 1);
  let lookAt = new THREE.Vector3(kartY, kartX, 1.5);

  var relativeCameraOffset = new THREE.Vector3(30, 10, 15);
  var cameraOffset = relativeCameraOffset.applyMatrix4(kart.matrixWorld);
  camera.position.x = cameraOffset.x;
  camera.position.y = cameraOffset.y;
  camera.position.z = cameraOffset.z;

  camera.up = upVec;
  camera.lookAt(lookAt);
}

function main(){

  var stats = initStats();          // To show FPS information
  var scene = new THREE.Scene();    // Create main scene
  var renderer = initRenderer();    // View function in util/utils
  
  // * Coloca o Kart na cena
  let kart = new kartModel();
  let kartFloor = kart.assembleKart(); // * monta o kart
  let kartSpeedRate = kart.getSpeedRate();
  let kartSpeed = 0;
  let cameraMode; // * bool pra controlar a camera
  let inspect = false;
  let behindKart = true; 

  let light  = initDefaultLighting(scene, kartFloor.position);
  let camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000); // Init camera in this position
  
  behindKartCamera(camera, kartFloor, kartFloor.position.x, kartFloor.position.y);

  // To use the keyboard
  var keyboard = new KeyboardState();

  // Enable mouse rotation, pan, zoom etc.
  var trackballControls = new THREE.TrackballControls( camera, renderer.domElement );

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

  var wireframe = new THREE.WireframeGeometry( planeGeometry );
  var line = new THREE.LineSegments( wireframe );
  line.material.color.setStyle( "rgb(180, 180, 180)" );  

  // Listen window size changes
  window.addEventListener( 'resize', function(){onWindowResize(camera, renderer)}, false );

  // Add Kart to the scene
  scene.add(kartFloor);

  // Add sun
  createSun(scene);

  // Add a pole
  let polePos = new THREE.Vector3(15,-15,10);
  createLightPole(scene, polePos);

  let polePos1 = new THREE.Vector3(135,-15,10);
  createLightPole(scene, polePos1);

  let polePos2 = new THREE.Vector3(255,-15,10);
  createLightPole(scene, polePos2);

  let polePos3 = new THREE.Vector3(375,-15,10);
  createLightPole(scene, polePos3);

  let polePos4 = new THREE.Vector3(500,-15,10);
  createLightPole(scene, polePos4);

  let polePos5 = new THREE.Vector3(620,-15,10);
  createLightPole(scene, polePos5);

  let polePos6 = new THREE.Vector3(740,-15,10);
  createLightPole(scene, polePos6);

  loadPLYFile(scene, 'objects/','Thai_Female_Sandstone_V2.2',true,100);

  render();

  function keyboardUpdate() {

    keyboard.update();

    // Change camera
    if ( keyboard.down("space") ){ 

      inspect = !inspect;
      behindKart = !behindKart;
      cameraMode = (inspect && !behindKart) ? true : false;

      if(cameraMode){
        inspectCamera(camera, kartFloor, kartFloor.position.x, kartFloor.position.y);
      } else {
        behindKartCamera(camera, kartFloor, kartFloor.position.x, kartFloor.position.y);
      }

    }

    if(!cameraMode){
      // Control the kart
      let rotateAngle = Math.PI / 2 * kartSpeedRate; // pi/2 radians (90 deg) per sec

      if (keyboard.pressed("up")){ // * Aceleração do Kart
        if(kartSpeed < 100){ // Aceleração máxima em x
          kartSpeed += kartSpeedRate
          kartFloor.translateX(kartSpeed);
        } 
      }else if (keyboard.pressed("down")){ // * Frenagem do Kart - diminui "abruptamente" a velocidade do kart até parar
        if(kartSpeed > 0){
          kartSpeed -= kartSpeedRate*8; // Diminui a velocidade de acordo com o speedRate * factor de frenagem
          kartFloor.translateX(kartSpeed);
        }
      }else{ // * Inercia do Kart - diminui a velocidade do kart até parar
        if(kartSpeed > 0){
          kartSpeed -= kartSpeedRate*2
          kartFloor.translateX(kartSpeed);
        }
      }

      if (keyboard.pressed("right")){ // * Rodas do kart pra direita
        kart.decrementFrontWheelsAngle(1);
        if(kartSpeed > 0){
          kartFloor.rotateOnAxis(new THREE.Vector3(0,0,1), -rotateAngle);
        }
      }else{
        kart.correctFrontWheelsLeft();
      }
      if (keyboard.pressed("left")){ // * Rodas do kart pra esquerda
        kart.incrementFrontWheelsAngle(1);
        if(kartSpeed > 0){
          kartFloor.rotateOnAxis(new THREE.Vector3(0,0,1), rotateAngle);
        }
      }else{
        kart.correctFrontWheelsRight();
      }

      behindKartCamera(camera, kartFloor, kartFloor.position.x, kartFloor.position.y);

    }

    if(cameraMode){
      if (keyboard.pressed("right")){ // * Rodas do kart pra direita
        kart.decrementFrontWheelsAngle(1);
      }else{
        kart.correctFrontWheelsLeft();
      }
      if (keyboard.pressed("left")){ // * Rodas do kart pra esquerda
        kart.incrementFrontWheelsAngle(1);
      }else{
        kart.correctFrontWheelsRight();
      }
    }

  }

  function render(){

    stats.update(); // Update FPS
    if(inspect){
      trackballControls.target.y = kartFloor.position.y;
      trackballControls.target.x = kartFloor.position.x;
      trackballControls.update(); // Enable mouse movements
      scene.remove(plane);
      scene.remove(line);
      scene.background = new THREE.Color( "rgb(20, 30, 110)" );;
    }
    if (!cameraMode){
      scene.add(plane);
      scene.add(line); 
      scene.background = new THREE.Color( "rgb(0, 0, 0)" );;
    }
    // lightFollowingCamera(light, camera);
    requestAnimationFrame(render);
    keyboardUpdate();
    renderer.render(scene, camera) // Render scene
  }
}
