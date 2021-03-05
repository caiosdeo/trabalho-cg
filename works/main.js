function behindKartCamera(scene, camera, light, kart, kartX, kartY) {
  
  var upVec = new THREE.Vector3(0, 0, 1);
  let lookAt = new THREE.Vector3(kartX, kartY, 1.5);
  
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

function cockpitCamera(scene, camera, light, wing, wingX, wingY) {

  var upVec = new THREE.Vector3(0, 0, 1);
  let lookAt = new THREE.Vector3(wingX, wingY, 4);
  
  var relativeCameraOffset = new THREE.Vector3(-22, 0, 5.5);
  var cameraOffset = relativeCameraOffset.applyMatrix4(wing.matrixWorld);
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

  light.target = wing;
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
  const textureLoader = new THREE.TextureLoader();

  function createPathStrings(filename) {
    const basePath = "/works/assets/textures/";
    const baseFilename = basePath + filename;
    const fileType = ".bmp";
    const sides = ["Front", "Back", "Top", "Bottom", "Right", "Left"];
    const pathStings = sides.map(side => {
      return baseFilename + "_" + side + fileType;
    });
    return pathStings;
  }

  function createMaterialArray(filename) {
    const skyboxImagepaths = createPathStrings(filename);
    const materialArray = skyboxImagepaths.map(image => {
      let texture = textureLoader.load(image);
      return new THREE.MeshBasicMaterial({ map: texture, side: THREE.BackSide });
    });
    return materialArray;
  }

  // Create skybox
  const skyboxImage = "Daylight Box"
  const skyboxMaterialArray = createMaterialArray(skyboxImage);
  const skyboxGeo = new THREE.BoxGeometry(5000, 5000, 10000);
  let skybox = new THREE.Mesh(skyboxGeo,skyboxMaterialArray);
  scene.add(skybox);

  // * Coloca o Kart na cena
  let kart = new kartModel();
  let kartFloor = kart.assembleKart(); // * monta o kart
  let kartSpeedRate = kart.getSpeedRate();
  let kartSpeed = 0;

  // * behind 0, cockpit 1, inspect 2, heaven 3
  let activeCamera = 1;

  // let light  = initDefaultLighting(scene, kartFloor.position);
  let camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 10000); // Init camera in this position
  let cameraLight = new THREE.SpotLight("rgb(255,255,255)");
  scene.add(cameraLight);

  // To use the keyboard
  var keyboard = new KeyboardState();

  // Enable mouse rotation, pan, zoom etc.
  var trackballControls = new THREE.TrackballControls( camera, renderer.domElement );

  //---------------------------------------------------------------------------------------
  // create the ground plane
  let track = textureLoader.load('../works/assets/textures/pista.jpg');
  var trackPlaneGeometry = new THREE.PlaneGeometry(1000, 1000, 10, 10);
  var trackPlaneMaterial = new THREE.MeshPhongMaterial({side:THREE.DoubleSide, map:track});
  var trackPlane = new THREE.Mesh(trackPlaneGeometry, trackPlaneMaterial);
  trackPlane.receiveShadow = true;
  scene.add(trackPlane);
  // create sand plane 
  let sand = textureLoader.load('../works/assets/textures/sand.jpg');
  sand.wrapS = THREE.RepeatWrapping;
  sand.wrapT = THREE.RepeatWrapping;
  sand.repeat.set( 5.5, 5.5 );
  var sandPlaneGeometry = new THREE.PlaneGeometry(2000, 2000);
  var sandPlaneMaterial = new THREE.MeshPhongMaterial({side:THREE.DoubleSide, map:sand});
  var sandPlane = new THREE.Mesh(sandPlaneGeometry, sandPlaneMaterial);
  sandPlane.receiveShadow = true;
  sandPlane.translateZ(-0.1);
  scene.add(sandPlane);

  // Listen window size changes
  window.addEventListener( 'resize', function(){onWindowResize(camera, renderer)}, false );

  // Add Kart to the scene
  scene.add(kartFloor);
  const initialPosition = new THREE.Vector3(0,-500, 1.5);
  kartFloor.position.copy(initialPosition);

  // Cockpit Camera Target
  let frontWingGeometry = new THREE.BoxGeometry(2, 8, 3);
  let frontWingMaterial = new THREE.MeshPhongMaterial({ color: 'rgb(150,150,0)'});
  frontWing = new THREE.Mesh(frontWingGeometry, frontWingMaterial);
  frontWing.visible = false;
  frontWing.position.set(30.0, 0.0, 1.0);
  kartFloor.add(frontWing);

  scene.updateMatrixWorld();

  let cockpitTarget = new THREE.Vector3(); // create once an reuse it
  frontWing.getWorldPosition( cockpitTarget );
  const targetObject = new THREE.Object3D();
  scene.add(targetObject);
  targetObject.position.copy(cockpitTarget);

  // Add sun
  let sun = new THREE.DirectionalLight("#FFFFFF");
  createSun(scene, sun);

  // Create the poles
  let polesPosition = [
    new THREE.Vector3(-350,-375,10), new THREE.Vector3(-150,-385,10), 
    new THREE.Vector3(50,-385,10), new THREE.Vector3(250,-385,10),
    new THREE.Vector3(440,400,10), new THREE.Vector3(65,150,10),
    new THREE.Vector3(-160,200,10), new THREE.Vector3(-440,400,10)
  ];
  let polesRotate = [
    0,0,
    0,0,
    270,90,
    90,90
  ]
  let polesLight = [
    new THREE.SpotLight("rgb(255,255,255)"), new THREE.SpotLight("rgb(255,255,255)"), 
    new THREE.SpotLight("rgb(255,255,255)"), new THREE.SpotLight("rgb(255,255,255)"),
    new THREE.SpotLight("rgb(255,255,255)"), new THREE.SpotLight("rgb(255,255,255)"),
    new THREE.SpotLight("rgb(255,255,255)"), new THREE.SpotLight("rgb(255,255,255)")
  ];
  let poles = [];
  for(i = 0; i < polesPosition.length; i++){
    poles[i] = createLightPole(scene, polesPosition[i], polesLight[i], polesRotate[i]);
  }

  // Statue
  const statuePos = new THREE.Vector3(-325,275,0);
  loadPLYFile(scene, 'assets/','Thai_Female_Sandstone_V2.2',true,80, statuePos);

  // Mountains
  let mountOne = createMountOne(new THREE.Vector3(-22,-15, 0), 11);
  scene.add(mountOne);
  let mountTwo = createMountTwo(new THREE.Vector3(425,120, 0), 10);
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

      if (activeCamera < 3){
        activeCamera++;
      }else{
        activeCamera = 0;
      }

      updateCamera();
    }

    if(activeCamera == 0 || activeCamera == 1 || activeCamera == 3){
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
        kart.decrementFrontWheelsAngle(3);
        if(kartSpeed > 0){
          kartFloor.rotateOnAxis(new THREE.Vector3(0,0,1), -rotateAngle);
          targetObject.rotateOnAxis(new THREE.Vector3(0,0,1), -rotateAngle);
        }
      }else{
        kart.correctFrontWheelsLeft();
      }
      if (keyboard.pressed("left")){ // * Rodas do kart pra esquerda
        kart.incrementFrontWheelsAngle(3);
        if(kartSpeed > 0){
          kartFloor.rotateOnAxis(new THREE.Vector3(0,0,1), rotateAngle);
          targetObject.rotateOnAxis(new THREE.Vector3(0,0,1), rotateAngle);
        }
      }else{
        kart.correctFrontWheelsRight();
      }

    }

    if(activeCamera == 2){
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

    frontWing.getWorldPosition( cockpitTarget );
    targetObject.position.copy(cockpitTarget);
    if(activeCamera == 0){behindKartCamera(scene, camera, cameraLight, kartFloor, kartFloor.position.x, kartFloor.position.y);}
    if(activeCamera == 1){cockpitCamera(scene, camera, cameraLight, targetObject, cockpitTarget.x, cockpitTarget.y)}
    if(activeCamera == 3){heavenCamera(camera)}
  }

  
  function updateCamera(){
    switch (activeCamera) {
      case 0:
        behindKartCamera(scene, camera, cameraLight, kartFloor, kartFloor.position.x, kartFloor.position.y);
        break;
      case 1:
        cockpitCamera(scene, camera, cameraLight, targetObject, cockpitTarget.x, cockpitTarget.y);
        break;
      case 2:
        inspectCamera(camera, kartFloor, kartFloor.position.x, kartFloor.position.y);
        break;
      case 3:
        heavenCamera(camera);
        break;
    }
  }

  function render(){

    stats.update(); // Update FPS

    if(activeCamera == 2){
      trackballControls.target.y = kartFloor.position.y;
      trackballControls.target.x = kartFloor.position.x;
      trackballControls.update(); // Enable mouse movements
      scene.remove(trackPlane);
      scene.remove(sandPlane);
      scene.remove(mountOne);
      scene.remove(mountTwo);
      for (i = 0; i < polesPosition.length; i++){
        scene.remove(poles[i]);
      }
      // scene.background = new THREE.Color( "rgb(20, 30, 110)" );;
    }

    if (activeCamera != 2){
      scene.add(trackPlane);
      scene.add(sandPlane);
      scene.add(mountOne);
      scene.add(mountTwo);
      for (i = 0; i < poles.length; i++){
        scene.add(poles[i]);
      }
      // scene.background = new THREE.Color( "rgb(0, 0, 0)" );;
    }
    
    requestAnimationFrame(render);
    keyboardUpdate();
    renderer.render(scene, camera) // Render scene
  }
}
