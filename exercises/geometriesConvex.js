function main()
{
  var scene = new THREE.Scene();    // Create main scene
  var clock = new THREE.Clock();
  var stats = initStats();          // To show FPS information
  var light = initDefaultLighting(scene, new THREE.Vector3(25, 30, 20)); // Use default light
  var renderer = initRenderer();    // View function in util/utils
    renderer.setClearColor("rgb(30, 30, 30)");
  var camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.lookAt(0, 0, 0);
    camera.position.set(5,15,40);
    camera.up.set( 0, 1, 0 );

  var followCamera = false; // Controls if light will follow camera

  // Enable mouse rotation, pan, zoom etc.
  var trackballControls = new THREE.TrackballControls( camera, renderer.domElement );

  // Listen window size changes
  window.addEventListener( 'resize', function(){onWindowResize(camera, renderer)}, false );

  var groundPlane = createGroundPlane(40, 35); // width and height
    // groundPlane.rotateX(degreesToRadians(-90));
  scene.add(groundPlane);

  // Show axes (parameter is size of each axis)
  var axesHelper = new THREE.AxesHelper( 20 );
    axesHelper.visible = true;
    axesHelper.translateY(0.1);
  scene.add( axesHelper );

  var objColor = "rgb(100, 70, 20)";
  var objOpacity = 1.0;

  // Object Material
  var objectMaterial = new THREE.MeshPhongMaterial({
    color: objColor,
  	opacity: objOpacity,
  	transparent: true});

  //----------------------------------
  // Create Convex Geometry
  //----------------------------------
  var numPoints = 20;

  var sphereGeom = new THREE.SphereGeometry(0.2); // Sphere to represent points
  var sphereMaterial = new THREE.MeshPhongMaterial({color:"rgb(255,255,0)"});

  // Global variables to be removed from memory each interaction
  var pointCloud = null;
  var spGroup = null;
  var points = null;
  var objectSize = 10;
  var convexGeometry = null;
  var object = null;
  var pointCloudVisibility = true;
  var objectVisibility = true;
  var castShadow = true;

  // Create convex object the first time
  updateConvexObject();

  buildInterface();
  render();

  function generatePoints(numberOfPoints=20, layers=5, mountainFactor=1.5, factorDiscount=2,heightFactor=3,pertubationFactor=0.11)
  {
    var points = [];
    var maxSize = objectSize;
    const pi = Math.PI;
    const euler = Math.E;
    const aurea = (1 + Math.sqrt(5) / 2);
    let x, y, z;
    let xBool = false;
    let yBool = false;
    let zBool = false;
    var varAuxPoints = [
                        [5,0,0],
                        [4.25,1,0],[4.75,1.75,0],[3.75,4,0],[2.75,4.85,0],[1,4.55,0],
                        [0,5,0],
                        [-2,4.55,0],[-3.25,4.55,0],[-4.75,1.75],
                        [-5,0,0],
                        [-4.75,-1.75,0],[-4.75,-3.25,0],[-3.25,-4.55,0],[-2,-3.25,0],[-0.80,-4.95,0],
                        [0,-5,0],
                        [1.55,-4.85,0],[3.15,-2.85,0],[4.60,-1.02,0]
                    ];

    for(let j = 1; j <= layers; j++){

      for(let i = 0; i < numberOfPoints; i++){

        x = varAuxPoints[i][0]*mountainFactor + xBool*pertubationFactor*pi;
        y = varAuxPoints[i][1]*mountainFactor+ yBool*pertubationFactor*euler;
        z = (j-1)*heightFactor + zBool*pertubationFactor*aurea;
        points.push(new THREE.Vector3(x, y, z));
        xBool = i % 2 == 0 ? !xBool : xBool;
        yBool = i % 2 != 0 ? !yBool : yBool;
        zBool = !zBool;

      }

      mountainFactor /= factorDiscount;

    }
    if(spGroup) spGroup.dispose();

    spGroup = new THREE.Geometry();
    spMesh = new THREE.Mesh(sphereGeom);
    points.forEach(function (point) {
      spMesh.position.set(point.x, point.y, point.z);
      spMesh.updateMatrix();
      spGroup.merge(spMesh.geometry, spMesh.matrix);
    });

    pointCloud = new THREE.Mesh(spGroup, sphereMaterial);
      pointCloud.castShadow = castShadow;
      pointCloud.visible = pointCloudVisibility;
    scene.add(pointCloud);

    return points;
  }

  function updateConvexObject( )
  {
    // As the object is updated when changing number of Points
    // it's useful to remove the previous object from memory (if it exists)
    if(object) scene.remove(object);
    if(pointCloud) scene.remove(pointCloud);
    if(convexGeometry) convexGeometry.dispose();

    // First, create the point vector to be used by the convex hull algorithm
    var localPoints1 = generatePoints(numPoints);
    var localPoints2 = generatePoints(numberOfPoints=numPoints,heightFactor=4);
    var localPoints3 = generatePoints(numberOfPoints=numPoints,heightFactor=3);

    // Then, build the convex geometry with the generated points
    convexGeometry1 = new THREE.ConvexBufferGeometry(localPoints1);
    convexGeometry2 = new THREE.ConvexBufferGeometry(localPoints2);
    convexGeometry3 = new THREE.ConvexBufferGeometry(localPoints3);

    object1 = new THREE.Mesh(convexGeometry1, objectMaterial);
       object1.castShadow = castShadow;
       object1.visible = objectVisibility;
    scene.add(object1);

    object2 = new THREE.Mesh(convexGeometry2, objectMaterial);
       object2.castShadow = castShadow;
       object2.visible = objectVisibility;
    object1.add(object2);
    object2.translateY(5);

    object3 = new THREE.Mesh(convexGeometry3, objectMaterial);
       object3.castShadow = castShadow;
       object3.visible = objectVisibility;
    object1.add(object3);
    object3.translateX(4).translateY(3);

    // Uncomment to view debug information of the renderer
    //console.log(renderer.info);
  }

  function buildInterface()
  {
    var controls = new function ()
    {
      this.viewObject = true;
      this.viewAxes = false;
      this.viewPoints = true;
      this.lightFollowCamera = false;
      this.color = objColor;
      this.opacity = objOpacity;
      this.numPoints = numPoints;
      this.objectSize = objectSize;
      this.castShadow = castShadow

      this.onViewObject = function(){
        object.visible = this.viewObject;
        objectVisibility = this.viewObject;
      };
      this.onViewPoints = function(){
        pointCloud.visible = this.viewPoints;
        pointCloudVisibility = this.viewPoints;
      };
      this.onViewAxes = function(){
        axesHelper.visible = this.viewAxes;
      };
      this.updateColor = function(){
        objectMaterial.color.set(this.color);
      };
      this.updateOpacity = function(){
        objectMaterial.opacity = this.opacity;
      };
      this.updateLight = function(){
        followCamera = this.lightFollowCamera;
      };
      this.onCastShadow = function(){
        object.castShadow = this.castShadow;
        pointCloud.castShadow = this.castShadow;
        castShadow = this.castShadow;
      };
      this.rebuildGeometry = function(){
        numPoints = this.numPoints;
        objectSize = this.objectSize;
        updateConvexObject();
      };
    };

    var gui = new dat.GUI();
    gui.add(controls, 'viewObject', true)
      .name("View Object")
      .onChange(function(e) { controls.onViewObject() });
    gui.add(controls, 'viewPoints', false)
      .name("View Points")
      .onChange(function(e) { controls.onViewPoints() });
    gui.add(controls, 'viewAxes', false)
      .name("View Axes")
      .onChange(function(e) { controls.onViewAxes() });
    gui.add(controls, 'lightFollowCamera', false)
      .name("LightFollowCam")
      .onChange(function(e) { controls.updateLight() });
    gui.add(controls, 'castShadow', castShadow)
      .name("Shadows")
      .onChange(function(e) { controls.onCastShadow() });
    gui.addColor(controls, 'color')
      .name("Object Color")
      .onChange(function(e) { controls.updateColor();});
    gui.add(controls, 'opacity', 0, 1)
      .name("Opacity")
      .onChange(function(e) { controls.updateOpacity();});
    gui.add(controls, 'objectSize', 2, 20)
      .name("Object Max Size")
      .onChange(function(e) { controls.rebuildGeometry();});
    gui.add(controls, 'numPoints', 10, 50)
      .name("Number Of Points")
      .onChange(function(e) { controls.rebuildGeometry();});
  }

  function render()
  {
    stats.update();
    trackballControls.update();
    if(followCamera)
        lightFollowingCamera(light, camera) // Makes light follow the camera
    else
        light.position.set(5,15,40);
    requestAnimationFrame(render);
    renderer.render(scene, camera)
  }
}
