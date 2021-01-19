function createWheelAxis(){
    let wheelAxisGeometry = new THREE.CylinderGeometry(0.5, 0.5, 10.5, 25);
    let wheelAxisMaterial = new THREE.MeshPhongMaterial( {color:'rgb(50,50,50)'} );
    let wheelAxis = new THREE.Mesh(wheelAxisGeometry, wheelAxisMaterial);

    return wheelAxis;
}

function createWheel(){

    //create a wheel
    let wheelGeometry = new THREE.CylinderGeometry(2.5, 2.5, 2.0, 25);
    let wheelMaterial = new THREE.MeshPhongMaterial( {color:'rgb(0,0,0)'} );
    let wheel = new THREE.Mesh(wheelGeometry, wheelMaterial);

    return wheel;
}

/**
 * Class of a kart
 */
class kartModel {
    
    constructor() {

        this.frontWheelsAngle = 0;

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
        let frontMaterial = new THREE.MeshPhongMaterial({ color: 'rgb(150,150,0)' });
        this.front = new THREE.Mesh(frontGeometry, frontMaterial);
        this.front.position.set(9.0, 0.0, 1.0);

        //create a wing
        let frontWingGeometry = new THREE.BoxGeometry(2, 8, 3);
        let frontWingMaterial = new THREE.MeshPhongMaterial({ color: 'rgb(150,0,0)' });
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
        let rearMaterial = new THREE.MeshPhongMaterial({ color: 'rgb(150,150,0)' });
        this.rear = new THREE.Mesh(rearGeometry, rearMaterial);
        this.rear.position.set(-8, 0.0, 1.0);

        //create a wing
        let rearWingGeometry = new THREE.BoxGeometry(2, 8, 1.5);
        let rearWingMaterial = new THREE.MeshPhongMaterial({ color: 'rgb(150,150,0)' });
        this.rearWing = new THREE.Mesh(rearWingGeometry, rearWingMaterial);
        this.rearWing.position.set(-2.0, 0.0, 1.5);

        //create a wing
        let spoilerSupportGeometry = new THREE.BoxGeometry(2, 0.3, 1.5);
        let spoilerSupportMaterial = new THREE.MeshPhongMaterial({ color: 'rgb(150,0,0)' });
        this.spoilerSupportRight = new THREE.Mesh(spoilerSupportGeometry, spoilerSupportMaterial);
        this.spoilerSupportLeft = new THREE.Mesh(spoilerSupportGeometry, spoilerSupportMaterial);
        // position the cube
        this.spoilerSupportRight.position.set(0, -1.5, 1.5);
        this.spoilerSupportLeft.position.set(0, 1.5, 1.5);

        let spoilerGeometry = new THREE.BoxGeometry(3, 10, 0.5);
        let spoilerMaterial = new THREE.MeshPhongMaterial({ color: 'rgb(150,0,0)' });
        this.spoiler = new THREE.Mesh(spoilerGeometry, spoilerMaterial);
        this.spoiler.position.set(0, 0, 2.5);

        //create a wheelAxis
        this.rearAxis = createWheelAxis();
        this.rearAxis.position.set(0.0, 0.0, 0.0);

        this.rearWheelLeft = createWheel();
        this.rearWheelRight = createWheel();
        this.rearWheelLeft.position.set(0.0, 5.5, 0.0);
        this.rearWheelRight.position.set(0.0, -5.5, 0.0);

        // ? seat
        // create base floor
        let seatGeometry = new THREE.BoxGeometry(5, 5, 0.5);
        let seatMaterial = new THREE.MeshPhongMaterial({ color: 'rgb(255,255,255)' });
        this.seat = new THREE.Mesh(seatGeometry, seatMaterial);
        this.seat.position.set(0.0, 0.0, 0.75);

        // create seat back
        let seatBackGeometry = new THREE.BoxGeometry(0.5, 5, 4);
        let seatBackMaterial = new THREE.MeshPhongMaterial({ color: 'rgb(125,125,125)' });
        this.seatBack = new THREE.Mesh(seatBackGeometry, seatBackMaterial);
        this.seatBack.position.set(-2.5, 0, 1.75);

    }

    getFloor() { return this.floor};

    getFrontWheelsAngle() { return this.frontWheelsAngle; }

    incrementFrontWheelsAngle(angle) { 

        if(this.frontWheelsAngle < 0.5){
            this.frontWheelsAngle = this.frontWheelsAngle + angle;
            this.frontWheelLeft.rotateZ(this.frontWheelsAngle);
            this.frontWheelRight.rotateZ(this.frontWheelsAngle);
        }
    }

    decrementFrontWheelsAngle(angle) { 
        if(this.frontWheelsAngle > -0.5){
            this.frontWheelsAngle = this.frontWheelsAngle - angle;
            this.frontWheelLeft.rotateZ(this.frontWheelsAngle);
            this.frontWheelRight.rotateZ(this.frontWheelsAngle);
        }
    }

    turnRight(){
        this.floor.rotateZ(this.frontWheelsAngle)
    }

    turnLeft(){
        this.floor.rotateZ(this.frontWheelsAngle)
    }

    moveFoward(){ this.floor.position.x += 3; }

    moveBackward(){ this.floor.position.x -= 3;}
    
    getKart() { 
        
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

    // printKart(scene) {

    //     // create base floor
    //     let floorGeometry = new THREE.BoxGeometry(10, 10, 0);
    //     let floorMaterial = new THREE.MeshPhongMaterial({ color: 'rgb(125,0,0)' });
    //     let floor = new THREE.Mesh(floorGeometry, floorMaterial);
    //     // position the cube
    //     floor.position.set(0.0, 0.0, 1.5);
    //     // add the cube to the scene
    //     scene.add(floor);

    //     //create a wing
    //     let chassiGeometry = new THREE.BoxGeometry(1, 8, 3);
    //     let chassiMaterial = new THREE.MeshPhongMaterial({ color: 'rgb(150,0,0)' });
    //     let back = new THREE.Mesh(chassiGeometry, chassiMaterial);
    //     let fore = new THREE.Mesh(chassiGeometry, chassiMaterial);
    //     // position the cube
    //     back.position.set(-4.5, 0.0, 1.0);
    //     fore.position.set(4.5, 0.0, 1.0);
    //     floor.add(back);
    //     floor.add(fore);

    //     //create a sides
    //     let sideGeometry = new THREE.BoxGeometry(10, 1, 3);
    //     let sideMaterial = new THREE.MeshPhongMaterial({ color: 'rgb(150,0,0)' });
    //     let right = new THREE.Mesh(sideGeometry, sideMaterial);
    //     let left = new THREE.Mesh(sideGeometry, sideMaterial);
    //     // position the cube
    //     right.position.set(0, -4.5, 1.0);
    //     left.position.set(0, 4.5, 1.0);
    //     floor.add(right);
    //     floor.add(left);

    //     // ? dianteira
    //     // create a cube
    //     let frontGeometry = new THREE.BoxGeometry(8, 2, 3);
    //     let frontMaterial = new THREE.MeshPhongMaterial({ color: 'rgb(150,150,0)' });
    //     let front = new THREE.Mesh(frontGeometry, frontMaterial);
    //     // position the cube
    //     front.position.set(9.0, 0.0, 1.0);
    //     // add the cube to the scene
    //     floor.add(front);

    //     //create a wing
    //     let frontWingGeometry = new THREE.BoxGeometry(2, 8, 3);
    //     let frontWingMaterial = new THREE.MeshPhongMaterial({ color: 'rgb(150,0,0)' });
    //     let frontWing = new THREE.Mesh(frontWingGeometry, frontWingMaterial);
    //     // position the cube
    //     frontWing.position.set(5.0, 0.0, 0.0);
    //     // add the cube to the scene
    //     front.add(frontWing);
    //     //create a wheelAxis
    //     frontAxis = createWheelAxis();
    //     // position the cube
    //     frontAxis.position.set(0.0, 0.0, 0.0);
    //     // add the cube to the scene
    //     front.add(frontAxis);

    //     frontWheelLeft = createWheel();
    //     // position the cube
    //     frontWheelLeft.position.set(0.0, 5.5, 0.0);
    //     frontWheelRight = createWheel();
    //     // position the cube
    //     frontWheelRight.position.set(0.0, -5.5, 0.0);
    //     // add the cube to the scene
    //     frontAxis.add(frontWheelLeft);
    //     frontAxis.add(frontWheelRight);

    //     // ? traseira
    //     // create a cube
    //     let rearGeometry = new THREE.BoxGeometry(6, 2, 3);
    //     let rearMaterial = new THREE.MeshPhongMaterial({ color: 'rgb(150,150,0)' });
    //     let rear = new THREE.Mesh(rearGeometry, rearMaterial);
    //     // position the cube
    //     rear.position.set(-8, 0.0, 1.0);
    //     // add the cube to the scene
    //     floor.add(rear);

    //     //create a wing
    //     let rearWingGeometry = new THREE.BoxGeometry(2, 8, 3);
    //     let rearWingMaterial = new THREE.MeshPhongMaterial({ color: 'rgb(150,150,0)' });
    //     let rearWing = new THREE.Mesh(rearWingGeometry, rearWingMaterial);
    //     // position the cube
    //     rearWing.position.set(-3, 0.0, 0.0);
    //     // add the cube to the scene
    //     rear.add(rearWing);

    //     //create a wing
    //     let spoilerSupportGeometry = new THREE.BoxGeometry(2, 0.3, 1.5);
    //     let spoilerSupportMaterial = new THREE.MeshPhongMaterial({ color: 'rgb(150,0,0)' });
    //     let spoilerSupportRight = new THREE.Mesh(spoilerSupportGeometry, spoilerSupportMaterial);
    //     let spoilerSupportLeft = new THREE.Mesh(spoilerSupportGeometry, spoilerSupportMaterial);
    //     // position the cube
    //     spoilerSupportRight.position.set(0, -1.5, 2);
    //     spoilerSupportLeft.position.set(0, 1.5, 2);
    //     // add the cube to the scene
    //     rearWing.add(spoilerSupportRight);
    //     rearWing.add(spoilerSupportLeft);

    //     let spoilerGeometry = new THREE.BoxGeometry(2, 10, 1);
    //     let spoilerMaterial = new THREE.MeshPhongMaterial({ color: 'rgb(150,0,0)' });
    //     let spoiler = new THREE.Mesh(spoilerGeometry, spoilerMaterial);
    //     // position the cube
    //     spoiler.position.set(0, 0, 3);
    //     // add the cube to the scene
    //     rearWing.add(spoiler);

    //     //create a wheelAxis
    //     rearAxis = createWheelAxis();
    //     // position the cube
    //     rearAxis.position.set(0.0, 0.0, 0.0);
    //     // add the cube to the scene
    //     rear.add(rearAxis);

    //     rearWheelLeft = createWheel();
    //     // position the cube
    //     rearWheelLeft.position.set(0.0, 5.5, 0.0);
    //     rearWheelRight = createWheel();
    //     // position the cube
    //     rearWheelRight.position.set(0.0, -5.5, 0.0);
    //     // add the cube to the scene
    //     rearAxis.add(rearWheelLeft);
    //     rearAxis.add(rearWheelRight);

    //     // ? seat
    //     // create base floor
    //     let seatGeometry = new THREE.BoxGeometry(5, 5, 0.5);
    //     let seatMaterial = new THREE.MeshPhongMaterial({ color: 'rgb(255,255,255)' });
    //     let seat = new THREE.Mesh(seatGeometry, seatMaterial);
    //     // position the cube
    //     seat.position.set(0.0, 0.0, 0.75);
    //     // add the cube to the scene
    //     floor.add(seat);

    //     // create base floor
    //     let seatBackGeometry = new THREE.BoxGeometry(0.5, 5, 4);
    //     let seatBackMaterial = new THREE.MeshPhongMaterial({ color: 'rgb(125,125,125)' });
    //     let seatBack = new THREE.Mesh(seatBackGeometry, seatBackMaterial);
    //     // position the cube
    //     seatBack.position.set(-2.5, 0, 1.75);
    //     // add the cube to the scene
    //     seat.add(seatBack);

    // }
}
