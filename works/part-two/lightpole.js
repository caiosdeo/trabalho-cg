function newLightSphere(post, radius, widthSegments, heightSegments, color){

    var geometry = new THREE.SphereGeometry(radius, widthSegments, heightSegments, 0, Math.PI * 2, 0, Math.PI);
    var material = new THREE.MeshBasicMaterial({color: color});
    var object = new THREE.Mesh(geometry, material);
    object.visible = true;
    post.add(object);

    return object;
}

function createLightPole(scene, position){

    // * Lightpost
    // Bars
    let barGeometry = new THREE.CylinderGeometry(0.1, 0.1, 7, 25);
    let barMaterial = new THREE.MeshPhongMaterial({color:"rgb(50,50,50)"});
    let bar = new THREE.Mesh(barGeometry, barMaterial);
    scene.add(bar);
    // * Posição vai ser passada por parametro
    bar.translateY(position.y).translateX(position.x).translateZ(position.z);
    // bar.position.copy(position);
    // Crossbars
    let crossbarGeometry = new THREE.CylinderGeometry(0.1, 0.1, 3, 25);
    let crossbar = new THREE.Mesh(crossbarGeometry, barMaterial);
    bar.add(crossbar);
    crossbar.rotateX(degreesToRadians(90)).translateZ(-3.5).translateY(-1.25);

    //---------------------------------------------------------
    // Sphere to represent the light
    let lightSphere = newLightSphere(crossbar, 0.25, 10, 10, "rgb(255,255,0)");
    lightSphere.translateY(-1.25).translateZ(0.25);
    
    // Default light position, color, ambient color and intensity
    // * A posição da luz vai ser referente a posição do poste ou a posição no mundo da esfera da luz
    scene.updateMatrixWorld();
    let lightPosition = new THREE.Vector3();
    lightSphere.getWorldPosition(lightPosition);
    //---------------------------------------------------------
    // Create and set all lights
    var spotLight = new THREE.SpotLight("rgb(255,255,255)");

    setSpotLight(scene, lightPosition, spotLight);

    // Set PointLight
    // More info here: https://threejs.org/docs/#api/en/lights/SpotLight
    function setSpotLight(scene, lightPosition, spotLight){
        spotLight.position.copy(lightPosition);
        spotLight.shadow.mapSize.width = 2048;
        spotLight.shadow.mapSize.height = 2048;
        spotLight.shadow.camera.fov = degreesToRadians(20);
        spotLight.castShadow = true;
        spotLight.decay = 2;
        spotLight.penumbra = 0.05;
        spotLight.name = "Post Light"

        const targetObject = new THREE.Object3D();
        scene.add(targetObject);
        targetObject.position.copy(lightPosition);
        targetObject.translateY(-9);
        spotLight.target = targetObject;
        scene.add( spotLight.target );  
        spotLight.target.updateMatrixWorld();

        scene.add(spotLight);  
        
        let lightHelp = new THREE.SpotLightHelper(spotLight);
        scene.add(lightHelp);
    }

}

function createSun(scene){
    let sun = new THREE.SpotLight("#FFFFFF");
    sun.position.set(0,30,0);
    sun.shadow.mapSize.width = 2048;
    sun.shadow.mapSize.height = 2048;
    sun.shadow.camera.fov = degreesToRadians(20);
    sun.castShadow = true;
    sun.decay = 2;
    sun.penumbra = 0.05;
    sun.name = "Sun Light"
    scene.add(sun);
}

function main(){

    var scene = new THREE.Scene();    // Create main scene
    var stats = initStats();          // To show FPS information

    var renderer = initRenderer();    // View function in util/utils
    renderer.setClearColor("rgb(30, 30, 42)");
    var camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(50, 100, 0);
    camera.up = new THREE.Vector3(0,1,0);
    camera.lookAt(new THREE.Vector3(0, 0, 0));

    // Enable mouse rotation, pan, zoom etc.
    var trackballControls = new THREE.TrackballControls( camera, renderer.domElement );

    // Listen window size changes
    window.addEventListener( 'resize', function(){onWindowResize(camera, renderer)}, false );

    var groundPlane = createGroundPlane(100.0, 100.0); // width and height
    groundPlane.rotateX(degreesToRadians(-90));
    scene.add(groundPlane);

    const geometry = new THREE.SphereGeometry( 3, 32, 32 );
    const material = new THREE.MeshPhongMaterial( {color: 0xff0000} );
    const sphere = new THREE.Mesh( geometry, material );
    scene.add( sphere );
    sphere.castShadow = true;
    sphere.translateY(7).translateZ(-20).translateX(7);

    createSun(scene);

    let polePos = new THREE.Vector3(10,3.5,-20);
    createLightPole(scene, polePos);

    let polePos2 = new THREE.Vector3(-10,3.5,20);
    createLightPole(scene, polePos2);

    render();

    function render(){

        stats.update();
        trackballControls.target.y = 5;
        trackballControls.target.x = 0;
        trackballControls.update();
        requestAnimationFrame(render);
        renderer.render(scene, camera)
    }
}
