function main()
{
  var stats = initStats();          // To show FPS information
  var scene = new THREE.Scene();    // Create main scene
  var renderer = initRenderer();    // View function in util/utils
  var camera = initCamera(new THREE.Vector3(0, -25, 15)); // Init camera in this position
  var light  = initDefaultLighting(scene, new THREE.Vector3(0, 0, 15));
  var trackballControls = new THREE.TrackballControls( camera, renderer.domElement );

  // variables to sliders controls
  var move = true; // control if animation is on or of
  let moveX = false;
  let moveY = false;
  let moveZ = false;
  let speed = 0.05;
  var targetX = 0;
  var targetY = 0;
  var targetZ = 1;
  let x = 0;
  let y = 0;
  let z = 1;

  // Base sphere
  var sphereGeometry = new THREE.SphereGeometry(1, 32, 32);
  var sphereMaterial = new THREE.MeshPhongMaterial( {color:'rgb(255,0,0)'} );
  var sphere = new THREE.Mesh( sphereGeometry, sphereMaterial );
  scene.add(sphere);

  // create the ground plane
  var planeGeometry = new THREE.PlaneGeometry(25, 25);
  var planeMaterial = new THREE.MeshPhongMaterial({
      color: "rgba(150, 150, 150)",
      side: THREE.DoubleSide,
  });
  var plane = new THREE.Mesh(planeGeometry, planeMaterial);
  // add the plane to the scene
  scene.add(plane);

  // Listen window size changes
  window.addEventListener( 'resize', function(){onWindowResize(camera, renderer)}, false );

  buildInterface();
  render();

  function moveSphere(){
    // More info:
    // https://threejs.org/docs/#manual/en/introduction/Matrix-transformations
    sphere.matrixAutoUpdate = false;

    // x = sphere.position.x;
    // y = sphere.position.y;
    // z = sphere.position.z;

    if(move){

      var mat4 = new THREE.Matrix4();
      sphere.matrix.identity();  // reset matrix

      // Movement in x-axis
      if(x > targetX && moveX){
        // alert("Estive aqui " + x);
        x -= speed;
        if(x <= targetX)
          moveX = false
      }
      if(x < targetX && moveX){
        // alert("Estive aqui " + x);
        x += speed;
        if(x >= targetX)
          moveX = false;
      }
      // Moviment in y-axis
      if(y > targetY && moveY){
        y -= speed;
        if(y <= targetY)
          moveY = false
      }
      if(y < targetY && moveY){
        y += speed;
        if(y >= targetY)
          moveY = false;
      }
      // Movement in z-axis
      if(z > targetZ && moveZ){
        z -= speed;
        if(z <= targetZ)
          moveZ = false
      }
      if(z < targetZ && moveZ){
        z += speed;
        if(z >= targetZ)
          moveZ = false;
      }

      // if(x > targetX){ x -= speed } else {x += speed };
      // if(y > targetY){ y -= speed } else {y += speed };
      // if(z > targetZ){ z -= speed } else {z += speed };
      
      sphere.matrix.multiply(mat4.makeTranslation(x, y, z));

      move = (moveX || moveY || moveZ) ? true : false;

    }

    // if(!move){
    //   moveX = false;
    //   moveY = false;
    //   moveZ = false;
    // }
    // move = false;
    
  }

  function buildInterface()
  {
    var controls = new function ()
    {

      this.x = 0;
      this.y = 0;
      this.z = 1;
      this.speed = 0.05;

      this.onChangeMove = function(){
        move = true;
      };

      this.changeSpeed = function(){
        speed = this.speed;
      };

      this.changePosX = function(){
        targetX = this.x;
        moveX = true;
      };

      this.changePosY = function(){
        targetY = this.y;
        moveY = true;
      };

      this.changePosZ = function(){
        targetZ = this.z;
        moveZ = true;
      };

    };

    // GUI interface
    var gui = new dat.GUI();
    gui.add(controls, 'x', -12, 12).onChange(function(e) { controls.changePosX() }).name("X");
    gui.add(controls, 'y', -12, 12).onChange(function(e) { controls.changePosY() }).name("Y");
    gui.add(controls, 'z', 0, 5).onChange(function(e) { controls.changePosZ() }).name("Z");
    // gui.add(controls, 'speed', 0.05, 0.5).onChange(function(e) { controls.changeSpeed() }).name("Change Speed");
    gui.add(controls, 'onChangeMove',true).name("Move");
  }

  function render()
  {
    stats.update(); // Update FPS
    trackballControls.update();
    moveSphere();
    lightFollowingCamera(light, camera);
    requestAnimationFrame(render);
    renderer.render(scene, camera) // Render scene
  }
}
