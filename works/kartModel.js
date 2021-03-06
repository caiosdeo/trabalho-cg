// Global texture Loader and textures
const textureLoader = new THREE.TextureLoader();
// Orange Wing Texture
let orangeWingTexture = textureLoader.load('../works/assets/textures/orangeWing.jpg');
orangeWingTexture.wrapS = THREE.RepeatWrapping;
orangeWingTexture.wrapT = THREE.RepeatWrapping;
orangeWingTexture.repeat.set(1,30);
// Rubber Wheel Texture
let wheelTexture = textureLoader.load('../works/assets/textures/tire.jpeg');
wheelTexture.wrapS = THREE.RepeatWrapping;
wheelTexture.wrapT = THREE.RepeatWrapping;
wheelTexture.repeat.set(4,1);
// Blue Wing Texture
let blueWingTexture = textureLoader.load('../works/assets/textures/blueWing.jpg');
blueWingTexture.wrapS = THREE.RepeatWrapping;
blueWingTexture.wrapT = THREE.RepeatWrapping;
blueWingTexture.repeat.set(7,4.3);
// Number Texture
let numberTexture = textureLoader.load('../works/assets/textures/number.png');
let numberGeometry = new THREE.CircleGeometry(1.5,25);
let numberMaterial = new THREE.MeshPhongMaterial({map:numberTexture, side: THREE.DoubleSide});
// Flash texture
let flashTexture = textureLoader.load('../works/assets/textures/Flash_and_circle.svg');
let flashGeometry = new THREE.PlaneGeometry(2,2,0);
let flashMaterial = new THREE.MeshPhongMaterial({ color:'rgb(255,154,0)',map:flashTexture });

// Global materials
blueWingMaterial = new THREE.MeshPhongMaterial({side:THREE.DoubleSide, map:blueWingTexture});
orangeWingMaterial = new THREE.MeshPhongMaterial({side:THREE.DoubleSide, map:orangeWingTexture}); 

function createWheelAxis(){
    let wheelAxisGeometry = new THREE.CylinderGeometry(0.5, 0.5, 10.5, 25);
    let wheelAxisMaterial = new THREE.MeshPhongMaterial( {color:'rgb(50,50,50)'} );
    let wheelAxis = new THREE.Mesh(wheelAxisGeometry, wheelAxisMaterial);

    return wheelAxis;
}

function createWheel(){

    //create a wheel
    let wheelGeometry = new THREE.CylinderGeometry(2.5, 2.5, 2.0, 25);
    // Maps the wheels material previously defined
    let wheelMaterial = new THREE.MeshPhongMaterial({side:THREE.DoubleSide, map:wheelTexture});
    let wheel = new THREE.Mesh(wheelGeometry, wheelMaterial);

    return wheel;
}

/**
 * Class of a kart
 */
class kartModel {
    
    constructor() {

        this.frontWheelsAngle = 0;
        this.floorAngle = 0;
        this.speedRate = 0.025;
        this.speed = 0;

        // create base floor
        let floorGeometry = new THREE.BoxGeometry(10, 10, 0);
        let floorMaterial = new THREE.MeshPhongMaterial({ color: 'rgb(125,0,0)' });
        this.floor = new THREE.Mesh(floorGeometry, floorMaterial);
        this.floor.position.set(0.0, 0.0, 1.5);

        // create chassi
        let chassiGeometry = new THREE.BoxGeometry(1, 8, 3);
        let chassiMaterial = new THREE.MeshPhongMaterial({ color: 'rgb(150,0,0)' });
        this.back = new THREE.Mesh(chassiGeometry, chassiMaterial);
        this.fore = new THREE.Mesh(chassiGeometry, chassiMaterial);
        this.back.position.set(-4.5, 0.0, 1.0);
        this.fore.position.set(4.5, 0.0, 1.0);

        // kart sides
        let sideGeometry = new THREE.BoxGeometry(10, 1, 3);
        let sideMaterial = new THREE.MeshPhongMaterial({ color: 'rgb(150,0,0)' });
        this.right = new THREE.Mesh(sideGeometry, sideMaterial);
        this.left = new THREE.Mesh(sideGeometry, sideMaterial);
        this.right.position.set(0, -4.5, 1.0);
        this.left.position.set(0, 4.5, 1.0);

        // ? front side
        // create kart's front
        let frontGeometry = new THREE.BoxGeometry(8, 2, 3);
        // Sets orangeWingMaterial to kart's front
        let frontMaterial = orangeWingMaterial; 
        this.front = new THREE.Mesh(frontGeometry, frontMaterial);
        this.front.position.set(9.0, 0.0, 1.0);

        //create a wing
        let frontWingGeometry = new THREE.BoxGeometry(2, 8, 3);
        let frontWingMaterial = orangeWingMaterial;
        // Sets orangeWingMaterial to kart's wing
        this.frontWing = new THREE.Mesh(frontWingGeometry, frontWingMaterial);
        this.frontWing.position.set(5.0, 0.0, 0.0);

        //create a wheelAxis
        this.frontAxis = createWheelAxis();
        this.frontAxis.position.set(0.0, 0.0, 0.0);
        this.frontWheelLeft = createWheel();
        this.frontWheelLeft.position.set(0.0, 5.5, 0.0);
        this.frontWheelRight = createWheel();
        this.frontWheelRight.position.set(0.0, -5.5, 0.0);

        // ? rear side
        // create a cube
        let rearGeometry = new THREE.BoxGeometry(6, 2, 3);
        // Sets orangeWingMaterial to kart's rear
        let rearMaterial = orangeWingMaterial;
        this.rear = new THREE.Mesh(rearGeometry, rearMaterial);
        this.rear.position.set(-8, 0.0, 1.0);

        //create a wing
        let rearWingGeometry = new THREE.BoxGeometry(2, 8, 1.5);
        // Sets orangeWingMaterial to kart's rear wing
        let rearWingMaterial = orangeWingMaterial;
        this.rearWing = new THREE.Mesh(rearWingGeometry, rearWingMaterial);
        this.rearWing.position.set(-2.0, 0.0, 1.5);

        //create a wing
        let spoilerSupportGeometry = new THREE.BoxGeometry(2, 0.3, 1.5);
        // Sets orangeWingMaterial to kart's spoilerSupports
        let spoilerSupportMaterial = orangeWingMaterial;
        this.spoilerSupportRight = new THREE.Mesh(spoilerSupportGeometry, spoilerSupportMaterial);
        this.spoilerSupportLeft = new THREE.Mesh(spoilerSupportGeometry, spoilerSupportMaterial);
        // position the cube
        this.spoilerSupportRight.position.set(0, -1.5, 1.5);
        this.spoilerSupportLeft.position.set(0, 1.5, 1.5);
        let spoilerGeometry = new THREE.BoxGeometry(3, 10, 0.5);
        let spoilerMaterial = orangeWingMaterial;
        this.spoiler = new THREE.Mesh(spoilerGeometry, spoilerMaterial);
        this.spoiler.position.set(0, 0, 2.5);

        // create a wheelAxis
        this.rearAxis = createWheelAxis();
        this.rearAxis.position.set(0.0, 0.0, 0.0);

        // create wheels
        this.rearWheelLeft = createWheel();
        this.rearWheelRight = createWheel();
        this.rearWheelLeft.position.set(0.0, 5.5, 0.0);
        this.rearWheelRight.position.set(0.0, -5.5, 0.0);

        // create seat
        let seatGeometry = new THREE.BoxGeometry(5, 5, 0.5);
        // Sets blueWingMaterial to kart's seat
        let seatMaterial = blueWingMaterial;
        this.seat = new THREE.Mesh(seatGeometry, seatMaterial);
        this.seat.position.set(0.0, 0.0, 0.75);

        // create seat back
        let seatBackGeometry = new THREE.BoxGeometry(0.5, 5, 4);
        // Sets blueWingMaterial to kart's seat back
        let seatBackMaterial = blueWingMaterial;
        this.seatBack = new THREE.Mesh(seatBackGeometry, seatBackMaterial);
        this.seatBack.position.set(-2.5, 0, 1.75);

        // create adhesives
        // Right and left for the kart's number
        // Right
        this.adhesiveRight = new THREE.Mesh(numberGeometry,numberMaterial);
        this.adhesiveRight.position.set(0,-.51,0);
        this.adhesiveRight.rotateX(degreesToRadians(90));
        // Left
        this.adhesiveLeft = new THREE.Mesh(numberGeometry,numberMaterial);
        this.adhesiveLeft.position.set(0,.51,0);
        this.adhesiveLeft.rotateX(degreesToRadians(270));
        // Flash image to kart's back
        // Back
        this.adhesiveBack = new THREE.Mesh(flashGeometry,flashMaterial);
        this.adhesiveBack.position.set(-3.1,0,-.48);
        this.adhesiveBack.rotateY(degreesToRadians(270));
        this.adhesiveBack.rotateZ(degreesToRadians(270));

        // Casts shadows
        this.floor.castShadow = true;
        this.back.castShadow = true;
        this.fore.castShadow = true;
        this.right.castShadow = true;
        this.left.castShadow = true;
        this.front.castShadow = true;
        this.frontWing.castShadow = true;
        this.frontAxis.castShadow = true;
        this.frontWheelLeft.castShadow = true;
        this.frontWheelRight.castShadow = true;
        this.rear.castShadow = true;
        this.rearWing.castShadow = true;
        this.spoilerSupportLeft.castShadow = true;
        this.spoilerSupportRight.castShadow = true;
        this.spoiler.castShadow = true;
        this.rearAxis.castShadow = true;
        this.rearWheelLeft.castShadow = true;
        this.rearWheelRight.castShadow = true;

    }

    // * Getters
    getFloor() { return this.floor};

    getFrontWing() {
        return this.frontWing;
    }

    getFrontWheelsAngle() { return this.frontWheelsAngle; }

    getFloorAngle() {return this.floorAngle;}

    getSpeed() {return this.speed};

    getSpeedRate() {return this.speedRate};

    // * Setters
    setSpeed(speed) {this.speed = speed};

    setFloorAngle(angle) {this.floorAngle += angle;}

    /**
     * Função para aplicar transformações geométricas nas rodas dianteiras, virando as para a esquerda
     */
    incrementFrontWheelsAngle(angle) { 

        if(this.frontWheelsAngle + angle < 25){

            this.frontWheelsAngle += angle;

            this.frontWheelLeft.matrixAutoUpdate = false;
            this.frontWheelRight.matrixAutoUpdate = false;

            var mat4 = new THREE.Matrix4();

            this.frontWheelLeft.matrix.identity();
            this.frontWheelRight.matrix.identity();

            this.frontWheelLeft.matrix.multiply(mat4.makeTranslation(0.0, -5.5, 0.0));
            this.frontWheelLeft.matrix.multiply(mat4.makeRotationZ(degreesToRadians(this.frontWheelsAngle))); 
            this.frontWheelRight.matrix.multiply(mat4.makeTranslation(0.0, 5.5, 0.0)); 
            this.frontWheelRight.matrix.multiply(mat4.makeRotationZ(degreesToRadians(this.frontWheelsAngle)));

        }
    }

    /**
     * Função para aplicar transformações geométricas nas rodas dianteiras, virando as para a direita
     */
    decrementFrontWheelsAngle(angle) { 

        if(this.frontWheelsAngle - angle > -25){

            this.frontWheelsAngle -= angle;
            this.frontWheelLeft.matrixAutoUpdate = false;
            this.frontWheelRight.matrixAutoUpdate = false;

            var mat4 = new THREE.Matrix4();

            this.frontWheelLeft.matrix.identity();
            this.frontWheelRight.matrix.identity();

            this.frontWheelLeft.matrix.multiply(mat4.makeTranslation(0.0, -5.5, 0.0));
            this.frontWheelLeft.matrix.multiply(mat4.makeRotationZ(degreesToRadians(this.frontWheelsAngle))); 
            this.frontWheelRight.matrix.multiply(mat4.makeTranslation(0.0, 5.5, 0.0)); 
            this.frontWheelRight.matrix.multiply(mat4.makeRotationZ(degreesToRadians(this.frontWheelsAngle)));

        }
    }

    /**
     * Função para aplicar transformações geométricas nas rodas dianteiras, corrigindo as para a direita
     */
    correctFrontWheelsLeft(){

        if(this.frontWheelsAngle < 0){
            this.frontWheelsAngle += 3;

            this.frontWheelLeft.matrixAutoUpdate = false;
            this.frontWheelRight.matrixAutoUpdate = false;

            var mat4 = new THREE.Matrix4();

            this.frontWheelLeft.matrix.identity();
            this.frontWheelRight.matrix.identity();

            this.frontWheelLeft.matrix.multiply(mat4.makeTranslation(0.0, -5.5, 0.0));
            this.frontWheelLeft.matrix.multiply(mat4.makeRotationZ(degreesToRadians(this.frontWheelsAngle))); 
            this.frontWheelRight.matrix.multiply(mat4.makeTranslation(0.0, 5.5, 0.0)); 
            this.frontWheelRight.matrix.multiply(mat4.makeRotationZ(degreesToRadians(this.frontWheelsAngle)));
        }
    }

    /**
     * Função para aplicar transformações geométricas nas rodas dianteiras, corrigindo as para a esquerda
     */
    correctFrontWheelsRight(){

        if(this.frontWheelsAngle > 0){
            this.frontWheelsAngle -= 3;

            this.frontWheelLeft.matrixAutoUpdate = false;
            this.frontWheelRight.matrixAutoUpdate = false;

            var mat4 = new THREE.Matrix4();

            this.frontWheelLeft.matrix.identity();
            this.frontWheelRight.matrix.identity();

            this.frontWheelLeft.matrix.multiply(mat4.makeTranslation(0.0, -5.5, 0.0));
            this.frontWheelLeft.matrix.multiply(mat4.makeRotationZ(degreesToRadians(this.frontWheelsAngle))); 
            this.frontWheelRight.matrix.multiply(mat4.makeTranslation(0.0, 5.5, 0.0)); 
            this.frontWheelRight.matrix.multiply(mat4.makeRotationZ(degreesToRadians(this.frontWheelsAngle)));
        }
    }

    /**
     * Functions to spin the wheels when speed and reverse speed != 0
     */
    spinWheels(kartSpinCounter){

        // Calcs spin angle
        let spinAngle = kartSpinCounter*(1+Math.abs(this.frontWheelsAngle));

        // Matrix auto update set to false
        this.frontWheelLeft.matrixAutoUpdate = false;
        this.frontWheelRight.matrixAutoUpdate = false;
        this.rearWheelLeft.matrixAutoUpdate = false;
        this.rearWheelRight.matrixAutoUpdate = false;

        // New matrix
        var mat4 = new THREE.Matrix4();

        // Sets to identity
        this.frontWheelLeft.matrix.identity();
        this.frontWheelRight.matrix.identity();
        this.rearWheelLeft.matrix.identity();
        this.rearWheelRight.matrix.identity();

        // Operations to frontWheelLeft
        this.frontWheelLeft.matrix.multiply(mat4.makeTranslation(0.0, -5.5, 0.0));
        this.frontWheelLeft.matrix.multiply(mat4.makeRotationZ(degreesToRadians(this.frontWheelsAngle))); // z-spin
        this.frontWheelLeft.matrix.multiply(mat4.makeRotationY(degreesToRadians(spinAngle))); // y-spin
        // Operations to frontWheelRight
        this.frontWheelRight.matrix.multiply(mat4.makeTranslation(0.0, 5.5, 0.0)); 
        this.frontWheelRight.matrix.multiply(mat4.makeRotationZ(degreesToRadians(this.frontWheelsAngle))); // z-spin
        this.frontWheelRight.matrix.multiply(mat4.makeRotationY(degreesToRadians(spinAngle))); // y-spin
        // Operations to rear Wheels
        this.rearWheelLeft.matrix.multiply(mat4.makeTranslation(0.0, -5.5, 0.0));
        this.rearWheelLeft.matrix.multiply(mat4.makeRotationY(degreesToRadians(spinAngle))); // y-spin
        this.rearWheelRight.matrix.multiply(mat4.makeTranslation(0.0, 5.5, 0.0)); 
        this.rearWheelRight.matrix.multiply(mat4.makeRotationY(degreesToRadians(spinAngle))); // y-spin

    }

    /**
     * Função para montar o kart com as peças criadas no construtor
     */
    assembleKart() { 
        
        this.floor.add(this.back);
        this.floor.add(this.fore);
        this.floor.add(this.right);
        this.floor.add(this.left);

        this.floor.add(this.front);
        this.front.add(this.frontWing);
        this.front.add(this.frontAxis);
        this.frontAxis.add(this.frontWheelLeft);
        this.frontAxis.add(this.frontWheelRight);

        this.floor.add(this.rear);
        this.rear.add(this.rearWing);
        this.rearWing.add(this.spoilerSupportRight);
        this.rearWing.add(this.spoilerSupportLeft);
        this.rearWing.add(this.spoiler);
        this.rear.add(this.rearAxis);
        this.rearAxis.add(this.rearWheelLeft);
        this.rearAxis.add(this.rearWheelRight);

        this.floor.add(this.seat);
        this.seat.add(this.seatBack);

        this.right.add(this.adhesiveRight);
        this.left.add(this.adhesiveLeft);
        this.rear.add(this.adhesiveBack);

        return this.floor;
    
    }

}
