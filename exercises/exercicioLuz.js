function newLightSphere(scene, radius, widthSegments, heightSegments, position, color){

    var geometry = new THREE.SphereGeometry(radius, widthSegments, heightSegments, 0, Math.PI * 2, 0, Math.PI);
    var material = new THREE.MeshBasicMaterial({color: color});
    var object = new THREE.Mesh(geometry, material);
    object.visible = true;
    object.position.copy(position);
    scene.add(object);

    return object;
}

function main(){

    var scene = new THREE.Scene();    // Create main scene
    var stats = initStats();          // To show FPS information

    var renderer = initRenderer();    // View function in util/utils
    renderer.setClearColor("rgb(30, 30, 42)");
    var camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.lookAt(0, 0, 0);
    camera.position.set(0, 4, 6);
    camera.up.set( 0, 1, 0 );

    var animationOn = true; // control if animation is on or of
    var angle = 0;

    // To use the keyboard
    var keyboard = new KeyboardState();

    // Enable mouse rotation, pan, zoom etc.
    var trackballControls = new THREE.TrackballControls( camera, renderer.domElement );

    // Listen window size changes
    window.addEventListener( 'resize', function(){onWindowResize(camera, renderer)}, false );

    var groundPlane = createGroundPlane(3.0, 3.0); // width and height
    groundPlane.rotateX(degreesToRadians(-90));
    scene.add(groundPlane);

    // Show text information onscreen
    showInformation();

    var infoBox = new SecondaryBox("");

    // Teapot
    var geometry = new THREE.TeapotBufferGeometry(0.5);
    var material = new THREE.MeshPhongMaterial({color:"rgb(255,255,255)"});
    material.side = THREE.DoubleSide;
    var teapot = new THREE.Mesh(geometry, material);
    // obj.castShadow = true;
    scene.add(teapot);

    // * Cage
    // Bars
    let barGeometry = new THREE.CylinderGeometry(0.02, 0.02, 2, 25);
    let barMaterial = new THREE.MeshPhongMaterial({color:"rgb(50,50,50)"});
    let bar1 = new THREE.Mesh(barGeometry, barMaterial);
    scene.add(bar1);
    bar1.translateX(1.5).translateZ(1.5).translateY(1.0);

    let bar2 = new THREE.Mesh(barGeometry, barMaterial);
    scene.add(bar2);
    bar2.translateX(1.5).translateZ(-1.5).translateY(1.0);

    let bar3 = new THREE.Mesh(barGeometry, barMaterial);
    scene.add(bar3);
    bar3.translateX(-1.5).translateZ(-1.5).translateY(1.0);

    let bar4 = new THREE.Mesh(barGeometry, barMaterial);
    scene.add(bar4);
    bar4.translateX(-1.5).translateZ(1.5).translateY(1.0);

    // Crossbars
    let crossbarGeometry = new THREE.CylinderGeometry(0.02, 0.02, 3, 25);
    let crossbar1 = new THREE.Mesh(crossbarGeometry, barMaterial);
    bar1.add(crossbar1);
    crossbar1.rotateX(degreesToRadians(90)).translateZ(-1.0).translateY(-1.5);

    let crossbar2 = new THREE.Mesh(crossbarGeometry, barMaterial);
    bar4.add(crossbar2);
    crossbar2.rotateX(degreesToRadians(90)).translateZ(-1.0).translateY(-1.5);

    let crossbar3 = new THREE.Mesh(crossbarGeometry, barMaterial);
    bar1.add(crossbar3);
    crossbar3.rotateX(degreesToRadians(90)).rotateZ(degreesToRadians(270)).translateZ(-1.0).translateY(-1.5);
    //----------------------------------------------------------------------------

    //---------------------------------------------------------
    // Default light position, color, ambient color and intensity
    var greenLightPosition = new THREE.Vector3(0, 2, 1.5);
    let redLightPosition = new THREE.Vector3(1.5,2,0);
    let blueLightPosition = new THREE.Vector3(-1.5,2,0);

    // Sphere to represent the light
    let greenLightSphere = newLightSphere(scene, 0.05, 10, 10, greenLightPosition, "rgb(0,255,0)");
    let redLightSphere = newLightSphere(scene, 0.05, 10, 10, redLightPosition, "rgb(255,0,0)");
    let blueLightSphere = newLightSphere(scene, 0.05, 10, 10, blueLightPosition, "rgb(0,0,255)");

    //---------------------------------------------------------
    // Create and set all lights
    var greenSpotLight = new THREE.SpotLight("rgb(0,255,0)");
    setSpotLight(greenLightPosition, greenSpotLight);
    var redSpotLight = new THREE.SpotLight("rgb(255,0,0)");
    setSpotLight(redLightPosition, redSpotLight);
    var blueSpotLight = new THREE.SpotLight("rgb(0,0,255)");
    setSpotLight(blueLightPosition, blueSpotLight);


    buildInterface();
    render();

    // Set Spotlight
    // More info here: https://threejs.org/docs/#api/en/lights/SpotLight
    function setSpotLight(position, spotLight){
        spotLight.position.copy(position);
        spotLight.shadow.mapSize.width = 2048;
        spotLight.shadow.mapSize.height = 2048;
        spotLight.shadow.camera.fov = degreesToRadians(20);
        spotLight.castShadow = true;
        spotLight.decay = 2;
        spotLight.penumbra = 0.05;
        spotLight.name = "Spot Light"

        scene.add(spotLight);
    }

    // Update light position of the current light
    function updateLightPosition(spotlight, lightSphere, lightPosition, color){

        spotlight.position.copy(lightPosition);
        lightSphere.position.copy(lightPosition);
        infoBox.changeMessage(color + " Light Position: " + lightPosition.x.toFixed(2) + ", " +
                                lightPosition.y.toFixed(2) + ", " + lightPosition.z.toFixed(2));
    }

	function rotateTeapot(){
		// More info:
		// https://threejs.org/docs/#manual/en/introduction/Matrix-transformations
		teapot.matrixAutoUpdate = false;

		// Set angle's animation speed
		if(animationOn){
			angle+=0.05;
			
			var mat4 = new THREE.Matrix4();
			teapot.matrix.identity();

			teapot.matrix.multiply(mat4.makeRotationY(angle));
			teapot.matrix.multiply(mat4.makeTranslation(0.0, 0.5, 0.0));
			
		}
	}

    function buildInterface(){
        //------------------------------------------------------------
        // Interface
        var controls = new function (){

            this.greenLightOn = true;
            this.redLightOn = true;
            this.blueLightOn = true;

            this.onSwitchGreenLight = function(){

                this.greenLightOn = !this.greenLightOn;

                if(this.greenLightOn){
                    scene.add(greenSpotLight);
                }else{
                    scene.remove(greenSpotLight);
                }
            };

            this.onSwitchRedLight = function(){

                this.redLightOn = !this.redLightOn;

                if(this.redLightOn){
                    scene.add(redSpotLight);
                }else{
                    scene.remove(redSpotLight);
                }
            };

            this.onSwitchBlueLight = function(){

                this.blueLightOn = !this.blueLightOn;

                if(this.blueLightOn){
                    scene.add(blueSpotLight);
                }else{
                    scene.remove(blueSpotLight);
                }
            };

            this.onChangeAnimation = function(){
                animationOn = !animationOn;
            };

        };

        var gui = new dat.GUI();
        gui.add(controls, 'onChangeAnimation',true).name("Animation On/Off");
        gui.add(controls, 'onSwitchBlueLight', false)
            .name("Blue Light")
        gui.add(controls, 'onSwitchGreenLight', false)
            .name("Green Light")
        gui.add(controls, 'onSwitchRedLight', false)
            .name("Red Light")
    }

    function keyboardUpdate(){

        keyboard.update();
        if ( keyboard.pressed("D") ){

            if(greenLightPosition.x < 1.45){
                greenLightPosition.x += 0.05;
                updateLightPosition(greenSpotLight, greenLightSphere, greenLightPosition, "Green");
            }
        }
        if ( keyboard.pressed("A") ){

            if(greenLightPosition.x > -1.45){
                greenLightPosition.x -= 0.05;
                updateLightPosition(greenSpotLight, greenLightSphere, greenLightPosition, "Green");
            }
        }
        if ( keyboard.pressed("W") ){

            if(redLightPosition.z > -1.45){
                redLightPosition.z -= 0.05;
                updateLightPosition(redSpotLight, redLightSphere, redLightPosition, "Red");
            }
        }
        if ( keyboard.pressed("S") ){
            if(redLightPosition.z < 1.45){
                redLightPosition.z += 0.05;
                updateLightPosition(redSpotLight, redLightSphere, redLightPosition, "Red");
            }
        }
        if ( keyboard.pressed("E") ){

            if(blueLightPosition.z > -1.45){
                blueLightPosition.z -= 0.05;
                updateLightPosition(blueSpotLight, blueLightSphere, blueLightPosition, "Blue");
            }
        }
        if ( keyboard.pressed("Q") ){

            if(blueLightPosition.z < 1.45){
                blueLightPosition.z += 0.05;
                updateLightPosition(blueSpotLight, blueLightSphere, blueLightPosition, "Blue");
            }
        }
    }

    function showInformation(){

    // Use this to show information onscreen
    controls = new InfoBox();
        controls.add("Lighting - Types of Lights");
        controls.addParagraph();
        controls.add("Use the WS to control the red light");
        controls.add("Use the AD to control the green light");
        controls.add("Use the QE to control the blue light");
        controls.show();
    }

    function render(){

        stats.update();
        trackballControls.update();
        rotateTeapot();
        keyboardUpdate();
        requestAnimationFrame(render);
        renderer.render(scene, camera)
    }
}
