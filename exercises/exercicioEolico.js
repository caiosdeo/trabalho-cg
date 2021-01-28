function initCamera() {
    var position = new THREE.Vector3(10, 5, 20);
	var camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
	var lookAt = new THREE.Vector3(0, 0, 7);
	var upVec = new THREE.Vector3(0, 0, 1);
	
	camera.position.copy(position);
	camera.up = upVec;
	camera.lookAt(lookAt);
	
    return camera;
}

function newBlade(){

	var bladeMaterial = new THREE.MeshPhongMaterial({color:"rgb(0,0,139)"});
    bladeMaterial.side =  THREE.DoubleSide;
	var points = generatePoints();
	// Set the main properties of the surface
	var segments = 20;
	var phiStart = 0;
	var phiLength = Math.PI;
	var bladeGeometry = new THREE.LatheGeometry(points, segments, phiStart, phiLength);
	var blade = new THREE.Mesh(bladeGeometry, bladeMaterial);
	blade.castShadow = true;
	blade.scale.set(0.5,0.5,0.5);

	function generatePoints(){
		var points = [];
		var numberOfPoints = 7;
		for (var i = 0; i < numberOfPoints; i++) {
			points.push(new THREE.Vector2(Math.sin(i*8 / 16.17), i));
		}
		return points;
	}

	return blade;
}

function newMotor(){

	var motorMaterial = new THREE.MeshPhongMaterial({color:"rgb(0,0,0)"});
    motorMaterial.side =  THREE.DoubleSide;
	var points = generatePoints();
	// Set the main properties of the surface
	var segments = 100;
	var phiStart = 0;
	var phiLength = 2*Math.PI;
	var motorGeometry = new THREE.LatheGeometry(points, segments, phiStart, phiLength);
	var motor = new THREE.Mesh(motorGeometry, motorMaterial);
	motor.castShadow = true;
	
	function generatePoints(){
		var points = [];
		var numberOfPoints = 5;
		for (var i = 0; i < numberOfPoints; i++) {
			points.push(new THREE.Vector2(Math.cos(i*5 / 1.3), i));
		}
		return points;
	}

	return motor;
}

function main(){

	var stats = initStats();          // To show FPS information
	var scene = new THREE.Scene();    // Create main scene
	var renderer = initRenderer();    // View function in util/utils
	var camera = initCamera(); // Init camera in this position
	var light  = initDefaultLighting(scene, new THREE.Vector3(0, 0, 15));
	var trackballControls = new THREE.TrackballControls( camera, renderer.domElement );

	// Set angles of rotation
	var angle = 0;
	var speed = 0.05;
	var animationOn = true; // control if animation is on or of

	// Show world axes
	var axesHelper = new THREE.AxesHelper( 12 );
	scene.add( axesHelper );

    // create the ground plane
    var planeGeometry = new THREE.PlaneGeometry(25, 25);
    var planeMaterial = new THREE.MeshPhongMaterial({
        color: "rgba(150, 150, 150)",
        side: THREE.DoubleSide,
    });
    var plane = new THREE.Mesh(planeGeometry, planeMaterial);
    // add the plane to the scene
	scene.add(plane);
	
	var baseGeometry = new THREE.BoxGeometry(2.5, 2.5, 0.25);
	var baseMaterial = new THREE.MeshPhongMaterial( {color:'rgb(150,150,200)'} );
	var base = new THREE.Mesh( baseGeometry, baseMaterial );
	scene.add(base);
	base.translateZ(0.125);

	// More information about cylinderGeometry here --> https://threejs.org/docs/#api/en/geometries/CylinderGeometry
	var poleGeometry = new THREE.CylinderGeometry(0.1, 0.5, 7.0, 25);
	var poleMaterial = new THREE.MeshPhongMaterial( {color:'rgb(255,255,255)'} );
	var pole = new THREE.Mesh( poleGeometry, poleMaterial );
	scene.add(pole);
	pole.rotateX(degreesToRadians(90)).translateY(3.75);

	let motor = newMotor();
	pole.add(motor);
	motor.rotateX(degreesToRadians(90)).rotateZ(degreesToRadians(90)).translateZ(-3.5).translateY(-2.5);

	// More information about cylinderGeometry here --> https://threejs.org/docs/#api/en/geometries/CylinderGeometry
	var rotorGeometry = new THREE.CylinderGeometry(0.4, 0.3, 0.8, 6);
	var rotorMaterial = new THREE.MeshPhongMaterial( {color:'rgb(112,128,144)'} );
	var rotor = new THREE.Mesh( rotorGeometry, rotorMaterial );
	motor.add(rotor);
	// rotor.rotateX(degreesToRadians(90)).rotateZ(degreesToRadians(90)).translateY(-3.5);
	// rotor.translateY(0.5);

	let blade1 = newBlade();
	blade1.rotateZ(degreesToRadians(90)).rotateY(degreesToRadians(180)).rotateX(degreesToRadians(0));
	rotor.add(blade1);
	let blade2 = newBlade();
	blade2.rotateZ(degreesToRadians(90)).rotateY(degreesToRadians(180)).rotateX(degreesToRadians(120));
	rotor.add(blade2);
	let blade3 = newBlade();
	blade3.rotateZ(degreesToRadians(90)).rotateY(degreesToRadians(180)).rotateX(degreesToRadians(240));
	rotor.add(blade3);

	// Listen window size changes
	window.addEventListener( 'resize', function(){onWindowResize(camera, renderer)}, false );

	buildInterface();
	render();

	function rotateCylinder(){
		// More info:
		// https://threejs.org/docs/#manual/en/introduction/Matrix-transformations
		rotor.matrixAutoUpdate = false;

		// Set angle's animation speed
		if(animationOn){
			angle+=speed;
			
			var mat4 = new THREE.Matrix4();
			rotor.matrix.identity();

			rotor.matrix.multiply(mat4.makeRotationY(-angle));
			rotor.matrix.multiply(mat4.makeTranslation(0.0, 0.5, 0.0));
			
		}
	}

	function buildInterface(){
		var controls = new function (){

			this.onChangeAnimation = function(){
				animationOn = !animationOn;
			};
			this.speed = 0.05;

			this.changeSpeed = function(){
				speed = this.speed;
			};
		};

		// GUI interface
		var gui = new dat.GUI();
		gui.add(controls, 'onChangeAnimation',true).name("Animation On/Off");
		gui.add(controls, 'speed', 0.05, 0.5).onChange(function(e) { controls.changeSpeed() }).name("Change Speed");
	}

	function render(){
		stats.update(); // Update FPS
		trackballControls.target.z = 5;
		trackballControls.target.y = 0;
		trackballControls.target.x = 0;
		trackballControls.update();
		rotateCylinder();
		lightFollowingCamera(light, camera);
		requestAnimationFrame(render);
		renderer.render(scene, camera) // Render scene
	}
}

// var points = generatePoints();
// // Set the main properties of the surface
// var segments = 20;
// var phiStart = 0;
// var phiLength = 2 * Math.PI;
// var latheGeometry = new THREE.LatheGeometry(points, segments, phiStart, phiLength);
// var object = new THREE.Mesh(latheGeometry, objectMaterial);
// object.castShadow = true;
// scene.add(object);

// function generatePoints(){
// 	var points = [];
// 	var numberOfPoints = 12;
// 	for (var i = 0; i < numberOfPoints; i++) {
// 		points.push(new THREE.Vector2(Math.sin(i*2 / 4.17), i));
// 	}
// 	// material for all points
// 	var material = new THREE.MeshPhongMaterial({color:"rgb(255,255,0)"});

// 	spGroup = new THREE.Object3D();
// 	points.forEach(function (point) {
// 	var spGeom = new THREE.SphereGeometry(0.2);
// 	var spMesh = new THREE.Mesh(spGeom, material);
// 	spMesh.position.set(point.x, point.y, 0);
// 	spGroup.add(spMesh);
// 	});
// 	// add the points as a group to the scene
// 	scene.add(spGroup);
// 	return points;
// }