function behindKartCamera(camera, kart, kartY, kartX) {
  
  var upVec = new THREE.Vector3(0, 0, 1);
  let lookAt = new THREE.Vector3(kartY, kartX, 1.5);
  
  var relativeCameraOffset = new THREE.Vector3(-30, 0, 15);
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
  let kartAngle = kart.getFloorAngle(); // * angulo do chão do kart
  let kartSpeedX = kart.getSpeedX(); 
  let kartSpeedY = kart.getSpeedY();
  let kartSpeedRate = kart.getSpeedRate();
  let dx = 0; // * variavel para controlar distancia no X
  let dy = 0; // * variavel para controlar distancia no Y
  let cameraMode; // * bool pra controlar a camera
  let inspect = false;
  let behindKart = true; 

  let light  = initDefaultLighting(scene, kartFloor.position);
  let camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000); // Init camera in this position
  
  behindKartCamera(camera, kartFloor, dx, dy);

  // To use the keyboard
  var keyboard = new KeyboardState();

  // Enable mouse rotation, pan, zoom etc.
  var trackballControls = new THREE.TrackballControls( camera, renderer.domElement );

  // Show axes (parameter is size of each axis)
  var axesHelper = new THREE.AxesHelper( 7000 );
  // scene.add( axesHelper );

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
        inspectCamera(camera, kartFloor, dx, dy);
      } else {
        behindKartCamera(camera, kartFloor, dx, dy);
      }

    }

    if(!cameraMode){
      // Control the kart
      kartAngle = kart.getFloorAngle();
      let teta = degreesToRadians(kartAngle);
      let sin = Math.sin(teta);
      let cos = Math.cos(teta);
      let turnFactor = 1;
      let distanceFactor = Math.abs(dx-dy) + 1;
      let breakFactor = 5;

      if (keyboard.pressed("up")){ // * Aceleração do Kart
        if(kartSpeedX < 100){ // Aceleração máxima em x
          kartSpeedX += kartSpeedRate; // Velocidade aumenta com a taxa kartSpeedRate
          dx += kartSpeedX*sin; // Espaço cresce de acordo com a taxa e o seno

        } 
        if(kartSpeedY < 100){ // Aceleração máxima em Y
          kartSpeedY += kartSpeedRate; // Acelera com taxa kartSpeedEate
          dy += kartSpeedY*cos; // Espaço cresce de acordo com a taxa e o cosseno
        }  
      }else{ // * Inercia do Kart - diminui a velocidade do kart até parar
        if(kartSpeedX > 0){
          kartSpeedX -= kartSpeedRate; // Diminui a velocidade de acordo com o speedRate
          dx += kartSpeedX*sin;
        }
        if(kartSpeedY > 0){
          kartSpeedY-= kartSpeedRate; // Diminui a velocidade de acordo com o speedRate
          dy += kartSpeedY*cos;
        }

      }
      if (keyboard.pressed("down")){ // * Frenagem do Kart - diminui "abruptamente" a velocidade do kart até parar

        if(kartSpeedX > 0){
          kartSpeedX -= kartSpeedRate*breakFactor; // Diminui a velocidade de acordo com o speedRate * factor de frenagem
          dx += (kartSpeedX*sin)/distanceFactor;
        }
        if(kartSpeedY > 0){
          kartSpeedY-= kartSpeedRate*breakFactor; // Diminui a velocidade de acordo com o speedRate * fator de frenagem
          dy += kartSpeedY*cos/distanceFactor;
        }

      }

      if (keyboard.pressed("right")){ // * Rodas do kart pra direita
        kart.decrementFrontWheelsAngle(1);
        if(kartSpeedX > 0){
          kartSpeedX -= kartSpeedRate*turnFactor; // Diminui a velocidade de acordo com o speedRate * factor de viragem
          dx += (kartSpeedX*sin)/distanceFactor;
        }
        if(kartSpeedY > 0){
          kartSpeedY-= kartSpeedRate*turnFactor; // Diminui a velocidade de acordo com o speedRate * fator de viragem
          dy += kartSpeedY*cos/distanceFactor;
        }
      }else{
        kart.correctFrontWheelsLeft();
      }
      if (keyboard.pressed("left")){ // * Rodas do kart pra esquerda
        kart.incrementFrontWheelsAngle(1);
        if(kartSpeedX > 0){
          kartSpeedX -= kartSpeedRate*turnFactor; // Diminui a velocidade de acordo com o speedRate * factor de viragem
          dx += (kartSpeedX*sin)/distanceFactor;
        }
        if(kartSpeedY > 0){
          kartSpeedY-= kartSpeedRate*turnFactor; // Diminui a velocidade de acordo com o speedRate * fator de viragem
          dy += kartSpeedY*cos/distanceFactor;
        }
      }else{
        kart.correctFrontWheelsRight();

      }

      if(kartSpeedX + kartSpeedY > 0){ // If para virar o Kart somente se houver velocidade em um dos eixos
        kart.setFloorAngle(kart.getFrontWheelsAngle()/10);
      }

      kartFloor.matrixAutoUpdate = false;
      kartFloor.matrix.identity();
      let mat4 = new THREE.Matrix4();
      kartFloor.matrix.multiply(mat4.makeTranslation(dy, dx, 1.5))
      kartFloor.matrix.multiply(mat4.makeRotationZ(degreesToRadians(kart.getFloorAngle())));

      behindKartCamera(camera, kartFloor, dy, dx);

    }
  }

  function render(){

    stats.update(); // Update FPS
    if(inspect){
      trackballControls.target.y = dx;
      trackballControls.target.x = dy;
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
    lightFollowingCamera(light, camera);
    requestAnimationFrame(render);
    keyboardUpdate();
    renderer.render(scene, camera) // Render scene
  }
}
