function lightFollowCamera(scene, camera, light, target){

  let cameraPos = new THREE.Vector3();

  camera.getWorldPosition(cameraPos);

  light.position.copy(cameraPos);
  light.decay = 2;
  light.penumbra = 0.05;
  light.name = "Camera Light"

  light.target = target;
  scene.add( light.target );  
  light.target.updateMatrixWorld();

}

function behindKartCamera(camera, kart, kartX, kartY) {
  
  var upVec = new THREE.Vector3(0, 0, 1);
  let lookAt = new THREE.Vector3(kartX, kartY, 1.5);
  
  var relativeCameraOffset = new THREE.Vector3(-40, 0, 12.5);
  var cameraOffset = relativeCameraOffset.applyMatrix4(kart.matrixWorld);
  camera.position.x = cameraOffset.x;
  camera.position.y = cameraOffset.y;
  camera.position.z = cameraOffset.z;

  camera.up = upVec;
  camera.lookAt(lookAt);
  
}

function cockpitCamera(camera, wing, wingX, wingY) {

  var upVec = new THREE.Vector3(0, 0, 1);
  let lookAt = new THREE.Vector3(wingX, wingY, 4);
  
  var relativeCameraOffset = new THREE.Vector3(-22, 0, 5.5);
  var cameraOffset = relativeCameraOffset.applyMatrix4(wing.matrixWorld);
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
    const pathStrings = sides.map(side => {
      return baseFilename + "_" + side + fileType;
    });
    return pathStrings;
  }

  function createMaterialArray(filename) {
    const skyboxImagepaths = createPathStrings(filename);
    const materialArray = skyboxImagepaths.map(image => {
      let texture = textureLoader.load(image);
      return new THREE.MeshBasicMaterial({ map: texture, side: THREE.DoubleSide });
    });
    return materialArray;
  }

  // Create skybox
  const skyboxImage = "Daylight Box"
  const skyboxMaterialArray = createMaterialArray(skyboxImage);

  // Skybox planes
  const skyboxPlaneGeometry = new THREE.PlaneGeometry(2000, 2000, 10, 10);
  let skyboxFront = new THREE.Mesh(skyboxPlaneGeometry, skyboxMaterialArray[0]);
  scene.add(skyboxFront);
  skyboxFront.translateX(1000).rotateY(degreesToRadians(270)).rotateZ(degreesToRadians(270));
  let skyboxBack = new THREE.Mesh(skyboxPlaneGeometry, skyboxMaterialArray[1]);
  scene.add(skyboxBack);
  skyboxBack.translateX(-1000).rotateY(degreesToRadians(90)).rotateZ(degreesToRadians(90));
  let skyboxTop = new THREE.Mesh(skyboxPlaneGeometry, skyboxMaterialArray[2]);
  scene.add(skyboxTop);
  skyboxTop.translateY(-1000).rotateX(degreesToRadians(90)).rotateY(degreesToRadians(180));
  let skyboxBottom = new THREE.Mesh(skyboxPlaneGeometry, skyboxMaterialArray[3]);
  scene.add(skyboxBottom);
  skyboxBottom.rotateX(degreesToRadians(90)).rotateZ(degreesToRadians(0)).translateZ(-1000);
  let skyboxLeft = new THREE.Mesh(skyboxPlaneGeometry, skyboxMaterialArray[4]);
  scene.add(skyboxLeft);
  skyboxLeft.translateZ(1000).rotateZ(degreesToRadians(180)).rotateY(degreesToRadians(180));
  let skyboxRight = new THREE.Mesh(skyboxPlaneGeometry, skyboxMaterialArray[5]);
  scene.add(skyboxRight);
  skyboxRight.translateZ(-1000);


  // * Coloca o Kart na cena
  let kart = new kartModel();
  let kartFloor = kart.assembleKart(); // * monta o kart
  let kartSpeedRate = kart.getSpeedRate();
  let kartSpeed = 0;
  let kartReverseSpeed = 0;
  let kartSpinCounter = 0;

  // * behind 0, cockpit 1, inspect 2, heaven 3
  let activeCamera = 1;

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
  sand.repeat.set( 7, 7 );
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
  const initialPosition = new THREE.Vector3(-390,255,0);//new THREE.Vector3(0,-350, 1.5);
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

   // Plane
  const planePos = new THREE.Vector3(-325,275,0);
  loadOBJFile(scene, 'assets/objects/','Plane',true,80, planePos);
  let planeObj;

  // Columns
  const goldColumn1Pos = new THREE.Vector3(77,-380,10)
  const goldColumn2Pos = new THREE.Vector3(77,-277,10)
  let columnTexture = textureLoader.load('../works/assets/textures/golden_column_0.jpg');
  loadOBJFile(scene, 'assets/objects/','golden_column',true,80, goldColumn1Pos, columnTexture, 'coluna1');
  loadOBJFile(scene, 'assets/objects/','golden_column',true,80, goldColumn2Pos, columnTexture, 'coluna2');
  let col1;
  let col2;
  setTimeout(() => { 
    col1 = scene.getObjectByName("coluna1", true);
    col1.translateZ(22).rotateX(degreesToRadians(90));
    col2 = scene.getObjectByName("coluna2", true);
    col2.translateZ(22).rotateX(degreesToRadians(90));
    planeObj = scene.getObjectByName("Plane",true);
    planeObj.rotateZ(degreesToRadians(90));
  }, 10000);

  // create the finish line plane
  const finishlinePos = new THREE.Vector3(80,-329,0.1)
  let finishline = textureLoader.load('../works/assets/textures/finishline.png');
  var finishGeometry = new THREE.PlaneGeometry(99, 10, 10, 10);
  var finishMaterial = new THREE.MeshPhongMaterial({side:THREE.DoubleSide, map:finishline});
  var finishlinePlane = new THREE.Mesh(finishGeometry, finishMaterial);
  finishlinePlane.receiveShadow = true;
  scene.add(finishlinePlane);
  finishlinePlane.rotateZ(degreesToRadians(90));
  finishlinePlane.position.copy(finishlinePos);

  // Mountains
  let mountOne = createMountOne(new THREE.Vector3(-22,-15, 0), 11);
  scene.add(mountOne);
  let mountTwo = createMountTwo(new THREE.Vector3(435,120, 0), 10);
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

      if (activeCamera < 2){
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
        else{
          kartSpeed = 0;
        }
      }else{ // * Inercia do Kart - diminui a velocidade do kart até parar
        if(kartSpeed > 0){
          kartSpeed -= kartSpeedRate*2
          kartFloor.translateX(kartSpeed);
        }
        else{
          kartSpeed = 0;
        }
      }

      // Spins the wheels
      if(kartSpeed + kartReverseSpeed != 0)
        kart.spinWheels(kartSpinCounter);

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

      // Reverse car movement
      // Reverse movement only if kartSpeed is 0
      if(kartSpeed == 0){
        // Down for reverse movement
        if(keyboard.pressed("down")){
          if(kartReverseSpeed > -2)
            kartReverseSpeed -= kartSpeedRate;
        }
        else{ // * inertia for reverse movement (increments instead decrements)
          if(kartReverseSpeed < 0){
            kartReverseSpeed += kartSpeedRate*2
          }
          else{
            kartReverseSpeed = 0;
          }
        }
        kartFloor.translateX(kartReverseSpeed); // Translates with reverse speed
        if (keyboard.pressed("right")){ // * Wheels to right
          kart.decrementFrontWheelsAngle(3);
          if(kartReverseSpeed < 0){ // * condition for reverseSpeed
            // angles signs reversed
            kartFloor.rotateOnAxis(new THREE.Vector3(0,0,1), rotateAngle); 
            targetObject.rotateOnAxis(new THREE.Vector3(0,0,1), rotateAngle);
          }
        }else{
          kart.correctFrontWheelsLeft();
        }
        if (keyboard.pressed("left")){ // * Wheels to left
          kart.incrementFrontWheelsAngle(3);
          if(kartReverseSpeed < 0){ // * condition for reverseSpeed
            // angles signs reversed
            kartFloor.rotateOnAxis(new THREE.Vector3(0,0,1), -rotateAngle);
            targetObject.rotateOnAxis(new THREE.Vector3(0,0,1), -rotateAngle);
          }
        }else{
          kart.correctFrontWheelsRight();
        }
      }

      // Correct speed values and the kartSpinCounter
      if(kartSpeed > 0){
        kartReverseSpeed = 0;
        kartSpinCounter += 1 + Math.floor(kartSpeed*3); 
      }
      if(kartReverseSpeed < 0){
        kartSpeed = 0;
        kartSpinCounter += Math.floor(kartReverseSpeed*2); 
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
    if(activeCamera == 0){behindKartCamera(camera, kartFloor, kartFloor.position.x, kartFloor.position.y);}
    if(activeCamera == 1){cockpitCamera(camera, targetObject, cockpitTarget.x, cockpitTarget.y)}
    if(activeCamera == 3){heavenCamera(camera)}
  }

  
  function updateCamera(){
    switch (activeCamera) {
      case 0:
        behindKartCamera(camera, kartFloor, kartFloor.position.x, kartFloor.position.y);
        break;
      case 1:
        cockpitCamera(camera, targetObject, cockpitTarget.x, cockpitTarget.y);
        break;
      case 2:
        inspectCamera(camera, kartFloor, kartFloor.position.x, kartFloor.position.y);
        break;
      case 3:
        heavenCamera(camera);
        break;
    }
  }

  function removeScenario(){
    scene.remove(trackPlane);
    scene.remove(sandPlane);
    scene.remove(mountOne);
    scene.remove(mountTwo);
    scene.remove(col1);
    scene.remove(col2);
    scene.remove(finishlinePlane);
    for (i = 0; i < polesPosition.length; i++){
      scene.remove(poles[i]);
    }
  }

  function addScenario(){
    scene.add(trackPlane);
    scene.add(sandPlane);
    scene.add(mountOne);
    scene.add(mountTwo);
    if(col1 != undefined && col2 != undefined){
      scene.add(col1);
      scene.add(col2);
    }
    scene.add(finishlinePlane);
    for (i = 0; i < poles.length; i++){
      scene.add(poles[i]);
    }
  }

  function render(){

    stats.update(); // Update FPS

    if(activeCamera == 2){
      trackballControls.target = kartFloor.position;
      trackballControls.update(); // Enable mouse movements
      lightFollowCamera(scene, camera, cameraLight, kartFloor);
      removeScenario();
    } else {
      addScenario();
    }
    
    if(activeCamera == 0){

      behindKartCamera(camera, kartFloor, cockpitTarget.x, cockpitTarget.y)
      lightFollowCamera(scene, camera, cameraLight, kartFloor);
    }
    if(activeCamera == 1){
      cockpitCamera(camera, targetObject, cockpitTarget.x, cockpitTarget.y)
      lightFollowCamera(scene, camera, cameraLight, targetObject);
    }

    requestAnimationFrame(render);
    keyboardUpdate();
    renderer.render(scene, camera) // Render scene
  }
}
