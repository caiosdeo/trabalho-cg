function newLightSphere(post, radius, widthSegments, heightSegments, color){

    var geometry = new THREE.SphereGeometry(radius, widthSegments, heightSegments, 0, Math.PI * 2, 0, Math.PI);
    var material = new THREE.MeshBasicMaterial({color: color});
    var object = new THREE.Mesh(geometry, material);
    object.visible = true;
    post.add(object);

    return object;
}

function createLightPole(scene, position, poleLight, rotate){

    // * Lightpost
    // Bars
    let barGeometry = new THREE.CylinderGeometry(1.75, 1.75, 40, 25);
    let barMaterial = new THREE.MeshPhongMaterial({color:"rgb(50,50,50)"});
    let bar = new THREE.Mesh(barGeometry, barMaterial);
    scene.add(bar);
    // * Posição vai ser passada por parametro
    bar.translateY(position.y).translateX(position.x).translateZ(20).rotateX(degreesToRadians(270));
    bar.rotateY(degreesToRadians(rotate));

    // Crossbars
    let crossbarGeometry = new THREE.CylinderGeometry(1.75, 1.75, 15, 25);
    let crossbar = new THREE.Mesh(crossbarGeometry, barMaterial);
    bar.add(crossbar);
    crossbar.rotateX(degreesToRadians(90)).translateY(4.5).translateZ(17.5);

    //---------------------------------------------------------
    // Sphere to represent the light
    let lightSphere = newLightSphere(crossbar, 1.75, 10, 10, "rgb(255,255,0)");
    lightSphere.translateZ(-1.5).translateY(5.5);
    
    // Default light position, color, ambient color and intensity
    // * A posição da luz vai ser referente a posição do poste ou a posição no mundo da esfera da luz
    scene.updateMatrixWorld();
    let lightPosition = new THREE.Vector3();
    lightSphere.getWorldPosition(lightPosition);
    //---------------------------------------------------------
    // Create and set all lights
    // var spotLight = new THREE.PointLight("rgb(255,255,255)");

    setPointLight(scene, lightPosition, poleLight);

    bar.castShadow = true;
    crossbar.castShadow = true;

    // Set PointLight
    // More info here: https://threejs.org/docs/#api/en/lights/SpotLight
    function setPointLight(scene, lightPosition, pointLight){
        pointLight.position.copy(lightPosition);
        pointLight.shadow.mapSize.width = 1024; // default
        pointLight.shadow.mapSize.height = 1024; // default
        // spotLight.shadow.camera.fov = 90; // default
        // spotLight.shadow.camera.aspect = 1;
        pointLight.shadow.camera.near = 0.5; // default
        pointLight.shadow.camera.far = 150;
        pointLight.intensity = 2;
        pointLight.power = 10;
        pointLight.castShadow = true;
        pointLight.decay = 2;
        pointLight.distance = 150;

        pointLight.translateZ(-3);

        scene.add(pointLight);  
        
    }

}

function createSun(scene, sun){

    sun.shadow.mapSize.width = 2048;
    sun.shadow.mapSize.height = 2048;
    sun.shadow.camera.fov = degreesToRadians(20);

    sun.position.set(0,0,300);
    sun.castShadow = true;
    // sun.decay = 2;
    // sun.penumbra = 0.05;
    sun.name = "Sun Light"
    // sun.shadowCameraVisible = true;

    scene.add(sun);
}