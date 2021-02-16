// General mountain properties
const mountainColor = "rgb(100, 70, 20)";
const mountainOpacity = 1.0;
const numPoints = 20;

// Object Material
const mountainMaterial = new THREE.MeshLambertMaterial({
    color: mountainColor,
    opacity: mountainOpacity,
    transparent: true});

// Function to generate the points that will be used to build the mountain
// numberOfPoints -> must be 20. This value is the number of points used to build de mountain model.
// The parameter was keeped just for reference and possible improvements.
// layers -> number os layers of the mountain
// mountainFactor -> responsible for the size of the diameter of the mountain's base
// factorDiscount -> factor that decreseas the diameter of the mountain in each iteration
// heightFactor -> control the height of the mountain
// pertubationFactor -> it's a factor to deviate the points
function generatePoints(numberOfPoints=20, layers=5, mountainFactor=1.5, factorDiscount=2,heightFactor=3,pertubationFactor=0.11){

    // required variables
    var points = [];
    const pi = Math.PI;
    const euler = Math.E;
    const aurea = (1 + Math.sqrt(5) / 2);
    let x, y, z;
    let xBool = false;
    let yBool = false;
    let zBool = false;
    // points choosed
    // If this points were draw in a plane, they will form a irregular base
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

    // For to the number of layers
    for(let j = 1; j <= layers; j++){
        // For to the number of points
        for(let i = 0; i < numberOfPoints; i++){

            x = varAuxPoints[i][0]*mountainFactor + xBool*pertubationFactor*pi; // pertubates points with pi when xBool is true
            y = varAuxPoints[i][1]*mountainFactor+ yBool*pertubationFactor*euler; // pertubates points with euler when yBool is true
            z = j-1 == 0 ? 0 : (j-1)*heightFactor + zBool*pertubationFactor*aurea; // pertubates points with aurea when zBool is true
            points.push(new THREE.Vector3(x, y, z)); // Push the points to the list
            xBool = i % 2 == 0 ? !xBool : xBool; // Updates the bool value when i is even
            yBool = i % 2 != 0 ? !yBool : yBool; // Updates the bool value when i is odd
            zBool = !zBool; // Updates bool value in each iteration

        }

        mountainFactor /= factorDiscount; // Discounts the mountain factor by factorDiscount

    }

    return points; // Return the generated points
}

// Creates fisrt mountain with the desired position and scale
function createMountOne(desiredPosition, desiredScale){

    // First, create the point vector to be used by the convex hull algorithm
    var localPoints1 = generatePoints(numPoints);
    var localPoints2 = generatePoints(numberOfPoints=numPoints,heightFactor=4);
    var localPoints3 = generatePoints(numberOfPoints=numPoints,heightFactor=3);

    // Then, build the convex geometry with the generated points
    convexGeometry1 = new THREE.ConvexBufferGeometry(localPoints1);
    convexGeometry2 = new THREE.ConvexBufferGeometry(localPoints2);
    convexGeometry3 = new THREE.ConvexBufferGeometry(localPoints3);

    // Instantiating three objects to compound the mountain
    // Object 1
    object1 = new THREE.Mesh(convexGeometry1, mountainMaterial);
    object1.castShadow = true;
    object1.visible = true;
    // Object 2
    object2 = new THREE.Mesh(convexGeometry2, mountainMaterial);
    object2.castShadow = true;
    object2.visible = true;
    object1.add(object2);
    object2.translateY(5);
    // Object 3
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

// Creates second mountain with the desired position and scale
function createMountTwo(desiredPosition, desiredScale){

    // First, create the point vector to be used by the convex hull algorithm
    var localPoints1 = generatePoints(numberOfPoints=numPoints,heightFactor=3);
    var localPoints2 = generatePoints(numberOfPoints=numPoints,heightFactor=2.5);

    // Then, build the convex geometry with the generated points
    convexGeometry1 = new THREE.ConvexBufferGeometry(localPoints1);
    convexGeometry2 = new THREE.ConvexBufferGeometry(localPoints2);

    // Instantiating two objects to compound the mountain
    // Object 1
    object1 = new THREE.Mesh(convexGeometry1, mountainMaterial);
    object1.castShadow = true;
    object1.visible = true;
    // Object 2
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
