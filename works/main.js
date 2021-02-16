function behindKartCamera(scene, camera, light, kart, kartY, kartX) {
  
  var upVec = new THREE.Vector3(0, 0, 1);
  let lookAt = new THREE.Vector3(kartY, kartX, 1.5);
  
  var relativeCameraOffset = new THREE.Vector3(-40, 0, 12.5);
  var cameraOffset = relativeCameraOffset.applyMatrix4(kart.matrixWorld);
  camera.position.x = cameraOffset.x;
  camera.position.y = cameraOffset.y;
  camera.position.z = cameraOffset.z;

  camera.up = upVec;
  camera.lookAt(lookAt);

  // Camera Light
  light.position.copy(camera.position);
  light.decay = 2;
  light.penumbra = 0.05;
  light.name = "Camera Light"

  light.target = kart;
  scene.add( light.target );  
  light.target.updateMatrixWorld();
  
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

function heavenCamera(camera) {
  
  var upVec = new THREE.Vector3(0, 0, 1);
  let lookAt = new THREE.Vector3(0, 0, 0);
  camera.position.x = 0;
  camera.position.y = 0;
  camera.position.z = 1000;
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

  // let light  = initDefaultLighting(scene, kartFloor.position);
  let camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000); // Init camera in this position
  let cameraLight = new THREE.SpotLight("rgb(255,255,255)");

  let heaven = false;
  if(heaven){
    heavenCamera(camera);
  }else{
    behindKartCamera(scene, camera, cameraLight, kartFloor, kartFloor.position.x, kartFloor.position.y);
  }
  scene.add(cameraLight);

  // To use the keyboard
  var keyboard = new KeyboardState();

  // Enable mouse rotation, pan, zoom etc.
  var trackballControls = new THREE.TrackballControls( camera, renderer.domElement );

  //---------------------------------------------------------------------------------------
  // create the ground plane
  let groundPlane = createGroundPlane(1000.0, 1000.0, "#bfaa3f"); // width and height
  scene.add(groundPlane);

  // Listen window size changes
  window.addEventListener( 'resize', function(){onWindowResize(camera, renderer)}, false );

  // Add Kart to the scene
  scene.add(kartFloor);
  const initialPosition = new THREE.Vector3(0,-275, 1.5);
  kartFloor.position.copy(initialPosition);

  // Add sun
  let sun = new THREE.DirectionalLight("#FFFFFF");
  createSun(scene, sun);

  // Create the poles
  let polesPosition = [
    new THREE.Vector3(-350,-350,10), new THREE.Vector3(-150,-350,10), 
    new THREE.Vector3(50,-350,10), new THREE.Vector3(250,-350,10),
    new THREE.Vector3(360,400,10), new THREE.Vector3(175,150,10),
    new THREE.Vector3(-200,200,10), new THREE.Vector3(-400,400,10)
  ];
  let polesRotate = [
    0,0,
    0,0,
    270,90,
    90,90
  ]
  let polesLight = [
    new THREE.PointLight("rgb(255,255,255)"), new THREE.PointLight("rgb(255,255,255)"), 
    new THREE.PointLight("rgb(255,255,255)"), new THREE.PointLight("rgb(255,255,255)"),
    new THREE.PointLight("rgb(255,255,255)"), new THREE.PointLight("rgb(255,255,255)"),
    new THREE.PointLight("rgb(255,255,255)"), new THREE.PointLight("rgb(255,255,255)")
  ];
  let poles = [];
  for(i = 0; i < polesPosition.length; i++){
    poles[i] = createLightPole(scene, polesPosition[i], polesLight[i], polesRotate[i]);
  }

  // Statue
  const statuePos = new THREE.Vector3(-325,275,0);
  loadPLYFile(scene, 'assets/','Thai_Female_Sandstone_V2.2',true,80, statuePos);
  // let statue = scene.getElementByName("Thai_Female_Sandstone_V2.2");
  // alert(scene.getObjectByName("Thai_Female_Sandstone_V2.2"));
  // Mountains
  let mountOne = createMountOne(new THREE.Vector3(0,175, 0), 12);
  scene.add(mountOne);
  let mountTwo = createMountTwo(new THREE.Vector3(390,50, 0), 10);
  scene.add(mountTwo);
  
  buildInterface();
  render();

  function buildInterface(){
    //------------------------------------------------------------
    // Interface
    var controls = new function (){

      this.sunLightOn = true;
      this.polesLightOn = true;
      this.cameraLightOn = true;

      this.viewSunLight = function(){
        sun.visible = this.sunLightOn;
      };

      this.viewPolesLight = function(){
        for (i = 0; i < polesLight.length; i++)
          polesLight[i].visible = this.polesLightOn;
      };

      this.viewCameraLight = function(){
        cameraLight.visible = this.cameraLightOn;
      };

    };

    var gui = new dat.GUI();
    let lightUI = gui.addFolder('Lights');
    lightUI.add(controls, 'sunLightOn', false)
        .name("Sun")
        .onChange(function(e) { controls.viewSunLight() });
        lightUI.add(controls, 'polesLightOn', false)
        .name("Poles Light")
        .onChange(function(e) { controls.viewPolesLight() });
        lightUI.add(controls, 'cameraLightOn', false)
        .name("Camera Light")
        .onChange(function(e) { controls.viewCameraLight() });

  }

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
        behindKartCamera(scene, camera, cameraLight, kartFloor, kartFloor.position.x, kartFloor.position.y);
      }

    }

    if(!cameraMode){
      // Control the kart
      let rotateAngle = Math.PI / 2 * kartSpeedRate; // pi/2 radians (90 deg) per sec

      if (keyboard.pressed("up")){ // * Aceleração do Kart
        if(kartSpeed < 5){ // Aceleração máxima em x
          kartSpeed += kartSpeedRate
        } 
        kartFloor.translateX(kartSpeed);
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

      if(!heaven){behindKartCamera(scene, camera, cameraLight, kartFloor, kartFloor.position.x, kartFloor.position.y);}

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
      scene.remove(groundPlane);
      scene.remove(mountOne);
      scene.remove(mountTwo);
      for (i = 0; i < polesPosition.length; i++){
        scene.remove(poles[i]);
      }
      scene.background = new THREE.Color( "rgb(20, 30, 110)" );;
    }
    if (!cameraMode){
      scene.add(groundPlane);
      scene.add(mountOne);
      scene.add(mountTwo);
      for (i = 0; i < poles.length; i++){
        scene.add(poles[i]);
      }
      scene.background = new THREE.Color( "rgb(0, 0, 0)" );;
    }
    requestAnimationFrame(render);
    keyboardUpdate();
    renderer.render(scene, camera) // Render scene
  }
}
