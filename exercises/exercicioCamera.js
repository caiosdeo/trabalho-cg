// Global variables
// Camera's position
var cameraX = 0
var cameraZ = 10
// Camera's lookAt
var cameraLookAtX = 0
var cameraLookAtZ = 0
// Camera's Up Vector
let angulo = 0
var cameraUpVecX = 0
var cameraUpVecZ = 1

function changeCamera(newPosition, newLookAt, newUpVec) {
  
  var position = (newPosition !== undefined) ? newPosition : new THREE.Vector3(0, -30, 10);
  var camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
  var lookAt = (newLookAt !== undefined) ? newLookAt : new THREE.Vector3(0, 0, 0);
  var upVec = (newUpVec !== undefined) ? newUpVec : new THREE.Vector3(0, 0, 1);
  
  camera.position.copy(position);
  camera.up = upVec;
  camera.lookAt(lookAt);
  
  return camera;
}

function main()
{
  var stats = initStats();          // To show FPS information
  var scene = new THREE.Scene();    // Create main scene
  var renderer = initRenderer();    // View function in util/utils
  var camera = changeCamera(); // Init camera in this position
  var clock = new THREE.Clock();

  // Show text information onscreen
  showInformation();
  // showVariables();

  // To use the keyboard
  var keyboard = new KeyboardState();

  // Enable mouse rotation, pan, zoom etc.
  var trackballControls = new THREE.TrackballControls(camera, renderer.domElement );

  // Show axes (parameter is size of each axis)
  var axesHelper = new THREE.AxesHelper( 12 );
  scene.add( axesHelper );

  // create the ground plane
  var planeGeometry = new THREE.PlaneGeometry(20, 20);
  planeGeometry.translate(0.0, 0.0, -0.02); // To avoid conflict with the axeshelper
  var planeMaterial = new THREE.MeshBasicMaterial({
      color: "rgb(150, 150, 150)",
      side: THREE.DoubleSide
  });
  var plane = new THREE.Mesh(planeGeometry, planeMaterial);
  // add the plane to the scene
  scene.add(plane);

  // create a cube
  var cubeGeometry = new THREE.BoxGeometry(4, 4, 4);
  var cubeMaterial = new THREE.MeshNormalMaterial();
  var cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
  // position the cube
  cube.position.set(0.0, 0.0, 2.0);
  // add the cube to the scene
  scene.add(cube);

  // Listen window size changes
  window.addEventListener( 'resize', function(){onWindowResize(camera, renderer)}, false );

  render();

  function keyboardUpdate() {

    keyboard.update();

  	if ( keyboard.pressed("left") )   cameraX--;
  	if ( keyboard.pressed("right") )  cameraX++;
    if ( keyboard.pressed("up") )   cameraZ++;
  	if ( keyboard.pressed("down") )   cameraZ--;

  	if ( keyboard.pressed("A") )  cameraLookAtX--;
  	if ( keyboard.pressed("D") )  cameraLookAtX++;
    if ( keyboard.pressed("W") )  cameraLookAtZ++;
  	if ( keyboard.pressed("S") )  cameraLookAtZ--;

    if ( keyboard.pressed("Q") ) {
      
      cameraUpVecX += 0.1;
      cameraUpVecZ -= 0.1;
      
    }
    if ( keyboard.pressed("E") ){
    
      cameraUpVecX -= 0.1;
      cameraUpVecZ += 0.1;
  
    }

    camera = changeCamera(new THREE.Vector3(cameraX, -30, cameraZ), new THREE.Vector3(cameraLookAtX, 0, cameraLookAtZ), new THREE.Vector3(cameraUpVecX, 0, cameraUpVecZ));

  }

  function showInformation()
  {
    // Use this to show information onscreen
    controls = new InfoBox();
      controls.add("Camera");
      controls.addParagraph();
      controls.add("Press WASD keys to change where the camera look at");
      controls.add("Press arrow keys to move the camera");
      controls.add("Press Q or E to change the camera up vector");
      controls.show();

  }

  function render()
  {
    stats.update(); // Update FPS
    requestAnimationFrame(render); // Show events
    trackballControls.update();
    keyboardUpdate();
    renderer.render(scene, camera) // Render scene
  }

}
