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

    bar.castShadow = true;
    crossbar.castShadow = true;

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

    setSpotLight(scene, lightPosition, poleLight);

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

        if(rotate == 0){
            targetObject.translateZ(-9).translateY(2.5);
        }else if (rotate == 90){
            targetObject.translateZ(-9).translateX(2.5);
        }else if (rotate == 270){
            targetObject.translateZ(-9).translateX(-2.5);
        }

        spotLight.target = targetObject;
        scene.add( spotLight.target );  
        spotLight.target.updateMatrixWorld();

        scene.add(spotLight);  
        
        let lightHelp = new THREE.SpotLightHelper(spotLight);
        scene.add(lightHelp);
    }

    return bar;
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