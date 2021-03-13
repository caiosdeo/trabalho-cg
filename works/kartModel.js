// Global texture Loader and textures
const textureLoader = new THREE.TextureLoader();
let orangeWingTexture = textureLoader.load('../works/assets/textures/orangeWing.jpg');
let wheelTexture = textureLoader.load('../works/assets/textures/tire.png');
let blueWingTexture = textureLoader.load('../works/assets/textures/blueWing.jpg');

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
    let wheelMaterial = new THREE.MeshPhongMaterial({side:THREE.DoubleSide, map:wheelTexture});
    // let wheelMaterial = new THREE.MeshPhongMaterial( {color:'rgb(10,10,10)'} );
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
        let frontMaterial = orangeWingMaterial;
        // let frontMaterial = new THREE.MeshPhongMaterial({ color: 'rgb(150,150,0)' });
        this.front = new THREE.Mesh(frontGeometry, frontMaterial);
        this.front.position.set(9.0, 0.0, 1.0);

        //create a wing
        let frontWingGeometry = new THREE.BoxGeometry(2, 8, 3);
        let frontWingMaterial = orangeWingMaterial;
        // let frontWingMaterial = new THREE.MeshPhongMaterial({ color: 'rgb(150,0,0)' });
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
        let rearMaterial = orangeWingMaterial;
        // let rearMaterial = new THREE.MeshPhongMaterial({ color: 'rgb(150,150,0)' });
        this.rear = new THREE.Mesh(rearGeometry, rearMaterial);
        this.rear.position.set(-8, 0.0, 1.0);

        //create a wing
        let rearWingGeometry = new THREE.BoxGeometry(2, 8, 1.5);
        let rearWingMaterial = orangeWingMaterial;
        // let rearWingMaterial = new THREE.MeshPhongMaterial({ color: 'rgb(150,150,0)' });
        this.rearWing = new THREE.Mesh(rearWingGeometry, rearWingMaterial);
        this.rearWing.position.set(-2.0, 0.0, 1.5);

        //create a wing
        let spoilerSupportGeometry = new THREE.BoxGeometry(2, 0.3, 1.5);
        let spoilerSupportMaterial = orangeWingMaterial;
        // let spoilerSupportMaterial = new THREE.MeshPhongMaterial({ color: 'rgb(150,0,0)' });
        this.spoilerSupportRight = new THREE.Mesh(spoilerSupportGeometry, spoilerSupportMaterial);
        this.spoilerSupportLeft = new THREE.Mesh(spoilerSupportGeometry, spoilerSupportMaterial);
        // position the cube
        this.spoilerSupportRight.position.set(0, -1.5, 1.5);
        this.spoilerSupportLeft.position.set(0, 1.5, 1.5);

        let spoilerGeometry = new THREE.BoxGeometry(3, 10, 0.5);
        let spoilerMaterial = orangeWingMaterial;
        // let spoilerMaterial = new THREE.MeshPhongMaterial({ color: 'rgb(150,0,0)' });
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

        // ? seat
        // create base floor
        let seatGeometry = new THREE.BoxGeometry(5, 5, 0.5);
        let seatMaterial = blueWingMaterial;
        // let seatMaterial = new THREE.MeshPhongMaterial({ color: 'rgb(255,255,255)' });
        this.seat = new THREE.Mesh(seatGeometry, seatMaterial);
        this.seat.position.set(0.0, 0.0, 0.75);

        // create seat back
        let seatBackGeometry = new THREE.BoxGeometry(0.5, 5, 4);
        let seatBackMaterial = blueWingMaterial;
        // let seatBackMaterial = new THREE.MeshPhongMaterial({ color: 'rgb(125,125,125)' });
        this.seatBack = new THREE.Mesh(seatBackGeometry, seatBackMaterial);
        this.seatBack.position.set(-2.5, 0, 1.75);

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

        return this.floor;
    
    }

}
