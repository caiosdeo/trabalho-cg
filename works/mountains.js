const mountainColor = "rgb(100, 70, 20)";
const mountainOpacity = 1.0;
const numPoints = 20;
// Object Material
const mountainMaterial = new THREE.MeshPhongMaterial({
    color: mountainColor,
    opacity: mountainOpacity,
    transparent: true});

function generatePoints(numberOfPoints=20, layers=5, mountainFactor=1.5, factorDiscount=2,heightFactor=3,pertubationFactor=0.11){

    var points = [];
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

    return points;
}

function createMountOne(desiredPosition, desiredScale){

    // First, create the point vector to be used by the convex hull algorithm
    var localPoints1 = generatePoints(numPoints);
    var localPoints2 = generatePoints(numberOfPoints=numPoints,heightFactor=4);
    var localPoints3 = generatePoints(numberOfPoints=numPoints,heightFactor=3);

    // Then, build the convex geometry with the generated points
    convexGeometry1 = new THREE.ConvexBufferGeometry(localPoints1);
    convexGeometry2 = new THREE.ConvexBufferGeometry(localPoints2);
    convexGeometry3 = new THREE.ConvexBufferGeometry(localPoints3);

    object1 = new THREE.Mesh(convexGeometry1, mountainMaterial);
    object1.castShadow = true;
    object1.visible = true;

    object2 = new THREE.Mesh(convexGeometry2, mountainMaterial);
    object2.castShadow = true;
    object2.visible = true;
    object1.add(object2);
    object2.translateY(5);

    object3 = new THREE.Mesh(convexGeometry3, mountainMaterial);
    object3.castShadow = true;
    object3.visible = true;
    object1.add(object3);
    object3.translateX(4).translateY(3);

    // Uncomment to view debug information of the renderer
    //console.log(renderer.info);

    object1.position.copy(desiredPosition)
    object1.scale.set(desiredScale,desiredScale,desiredScale);

    return object1;
}

function createMountTwo(desiredPosition, desiredScale){

    // First, create the point vector to be used by the convex hull algorithm
    var localPoints1 = generatePoints(numberOfPoints=numPoints,heightFactor=3);
    var localPoints2 = generatePoints(numberOfPoints=numPoints,heightFactor=2.5);

    // Then, build the convex geometry with the generated points
    convexGeometry1 = new THREE.ConvexBufferGeometry(localPoints1);
    convexGeometry2 = new THREE.ConvexBufferGeometry(localPoints2);

    object1 = new THREE.Mesh(convexGeometry1, mountainMaterial);
    object1.castShadow = true;
    object1.visible = true;

    object2 = new THREE.Mesh(convexGeometry2, mountainMaterial);
    object2.castShadow = true;
    object2.visible = true;
    object1.add(object2);
    object2.translateY(5);

    // Uncomment to view debug information of the renderer
    //console.log(renderer.info);

    object1.position.copy(desiredPosition)
    object1.scale.set(desiredScale,desiredScale,desiredScale);
    
    return object1;
}
