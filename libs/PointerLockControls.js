/**
 * @author mrdoob / http://mrdoob.com/
 * @author schteppe / https://github.com/schteppe
 */

 
 var PointerLockControls = function ( camera, cannonBody, playerDummy ) {

	var prevTime = performance.now();
    var eyeYPos = 2; // eyes are 2 meters above the ground
    var velocityFactor = 0.2;
    var jumpVelocity = 15;
    var scope = this;
	var speed = 25.0;
	var mouseSpeed = 0.002;
	
    var pitchObject = new THREE.Object3D();
    pitchObject.add( camera );

	var Player = new THREE.Object3D();
    Player.add( playerDummy );
	
    var yawObject = new THREE.Object3D();
    yawObject.position.y = 2;
    yawObject.add( pitchObject );

    var quat = new THREE.Quaternion();

    var moveForward = false;
    var moveBackward = false;
    var moveLeft = false;
    var moveRight = false;
	var moveFast = false;

    var canJump = false;

    var contactNormal = new CANNON.Vec3(); // Normal in the contact, pointing *out* of whatever the player touched
    var upAxis = new CANNON.Vec3(0,1,0);
    cannonBody.addEventListener("collide",function(e){
        var contact = e.contact;

        // contact.bi and contact.bj are the colliding bodies, and contact.ni is the collision normal.
        // We do not yet know which one is which! Let's check.
        if(contact.bi.id == cannonBody.id)  // bi is the player body, flip the contact normal
            contact.ni.negate(contactNormal);
        else
            contactNormal.copy(contact.ni); // bi is something else. Keep the normal as it is

        // If contactNormal.dot(upAxis) is between 0 and 1, we know that the contact normal is somewhat in the up direction.
        if(contactNormal.dot(upAxis) > 0.5) // Use a "good" threshold value between 0 and 1 here!
            canJump = true;
    });

    var velocity = cannonBody.position;
	var realVelocity = cannonBody.velocity;

    var PI_2 = Math.PI / 2;

    var onMouseMove = function ( event ) {

        if ( scope.enabled === false ) return;

        var movementX = event.movementX || event.mozMovementX || event.webkitMovementX || 0;
        var movementY = event.movementY || event.mozMovementY || event.webkitMovementY || 0;

		if(gameplayCamera){
        yawObject.rotation.y -= movementX * mouseSpeed;
        pitchObject.rotation.x -= movementY * mouseSpeed;

        pitchObject.rotation.x = Math.max( - PI_2, Math.min( PI_2, pitchObject.rotation.x ) );
		}else{
			
			yawObject.rotation.y -= movementX * mouseSpeed;
			pitchObject.rotation.x -= movementY * mouseSpeed;
			pitchObject.rotation.x = Math.max( - PI_2, Math.min( PI_2, pitchObject.rotation.x ) );
			
		}
		
    };
	
	var onKeyDown = function ( event ) {

        switch ( event.keyCode ) {

            case 38: // up
            case 87: // w
                moveForward = true;
                break;

            //case 37: // left
            case 65: // a
                moveLeft = true; break;

            case 40: // down
            case 83: // s
                moveBackward = true;
                break;

            //case 39: // right
            case 68: // d
                moveRight = true;
                break;

            case 32: // space
                if ( canJump === true ){
                    realVelocity.y += jumpVelocity;
                }
                canJump = false;
                break;
			
			case 81: //q
				moveFast = true;
				break;
			
			case 49: //1
				gameplayCamera = true;
				break;
				
			case 50: //2
				gameplayCamera = false;
				break;
				
			case 39: // right
				turnCameraRight = true;
				break;
				
			case 37: // left
				turnCameraLeft = true;
				break;
        }

    };

    var onKeyUp = function ( event ) {

        switch( event.keyCode ) {

            case 38: // up
            case 87: // w
                moveForward = false;
                break;

            //case 37: // left
            case 65: // a
                moveLeft = false;
                break;

            case 40: // down
            case 83: // a
                moveBackward = false;
                break;

            //case 39: // right
            case 68: // d
                moveRight = false;
                break;
				
			case 81: //q
				moveFast = false;
				break;
				
			case 39: //right
				turnCameraRight = false;
				break;
				
			case 37: //left
				turnCameraLeft = false;

        }

    };
	
	

    document.addEventListener( 'mousemove', onMouseMove, false );
    document.addEventListener( 'keydown', onKeyDown, false );
    document.addEventListener( 'keyup', onKeyUp, false );

    this.enabled = false;

    this.getObject = function () {
		
        return yawObject;
    };

    this.getDirection = function(targetVec){
        targetVec.set(0,0,-1);
        quat.multiplyVector3(targetVec);
    }

    // Moves the camera to the Cannon.js object position and adds velocity to the object if the run key is down
    var inputVelocity = new THREE.Vector3();
    var euler = new THREE.Euler();
    this.update = function ( delta ) {

        if ( scope.enabled === false ) return;

		
		var time = performance.now();
		var delta = ( time - prevTime ) / 1000;
        //delta *= 0.1;

        inputVelocity.set(0,0,0);
		
		inputVelocity.z -= inputVelocity.z * 10.0 * delta;
		inputVelocity.x -= inputVelocity.x * 10.0 * delta;

		if(controlsEnabled){
        if ( moveForward ){
			
			inputVelocity.z -= speed * delta;
           // inputVelocity.z = -velocityFactor * delta;
        }
        if ( moveBackward ){
			inputVelocity.z += speed * delta;
            //inputVelocity.z = velocityFactor * delta;
        }

        if ( moveLeft ){
			inputVelocity.x -= speed * delta;
            //inputVelocity.x = -velocityFactor * delta;
        }
        if ( moveRight ){
			inputVelocity.x += speed * delta;
            //inputVelocity.x = velocityFactor * delta;
        }
		if ( moveFast ){
			inputVelocity.z -= 80.0 * delta;
            //inputVelocity.x = velocityFactor * delta;
        }
		

		
        // Convert velocity to world coordinates
        euler.x = pitchObject.rotation.x;
        euler.y = yawObject.rotation.y;
        euler.order = "XYZ";
        quat.setFromEuler(euler);
        inputVelocity.applyQuaternion(quat);
        //quat.multiplyVector3(inputVelocity);

		
		
        // Add to the object
        velocity.x += inputVelocity.x;
        velocity.z += inputVelocity.z;
		
		
		
		playerDummy.position.copy( cannonBody.position );
        yawObject.position.copy(cannonBody.position);
		
		if(collisionDetected02){
			speed = 0.01;
			mouseSpeed = 0.0001
			cannonBody.position.x -= 0.03;
		}
		
		if(collisionDetected03){
			cannonBody.position.set(165, 26.5, 787.5);
			mouseSpeed = 0.002;
		}
		
		if(turnCameraRight == true){
			controls.getObject().rotation.y += .01;
		}
		if(turnCameraLeft == true){
			controls.getObject().rotation.y -= .01;
		}
		
		}
		
		prevTime = time;
		
    };
};
