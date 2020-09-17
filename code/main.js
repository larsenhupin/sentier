var blocker = document.getElementById( 'blocker' );
var instructions = document.getElementById( 'instructions' );
var havePointerLock = 'pointerLockElement' in document || 'mozPointerLockElement' in document || 'webkitPointerLockElement' in document;

if ( havePointerLock ) {
	var element = document.body;

	var pointerlockchange = function ( event ) {
		if ( document.pointerLockElement === element || document.mozPointerLockElement === element || document.webkitPointerLockElement === element ) {
			controlsEnabled = true;
			controls.enabled = true;
			blocker.style.display = 'none';
		} else {
		controls.enabled = false;
		blocker.style.display = '-webkit-box';
		blocker.style.display = '-moz-box';
		blocker.style.display = 'box';
		instructions.style.display = '';
	}
}

	var pointerlockerror = function ( event ) {
		instructions.style.display = '';
	}

	document.addEventListener( 'pointerlockchange', pointerlockchange, false );
	document.addEventListener( 'mozpointerlockchange', pointerlockchange, false );
	document.addEventListener( 'webkitpointerlockchange', pointerlockchange, false );	
	document.addEventListener( 'pointerlockerror', pointerlockerror, false );
	document.addEventListener( 'mozpointerlockerror', pointerlockerror, false );
	document.addEventListener( 'webkitpointerlockerror', pointerlockerror, false );

	instructions.addEventListener( 'click', function ( event ) {
		instructions.style.display = 'none';
		element.requestPointerLock = element.requestPointerLock || element.mozRequestPointerLock || element.webkitRequestPointerLock;

		if ( /Firefox/i.test( navigator.userAgent ) ) {

			var fullscreenchange = function ( event ) {
				if ( document.fullscreenElement === element || document.mozFullscreenElement === element || document.mozFullScreenElement === element ) {
					document.removeEventListener( 'fullscreenchange', fullscreenchange );
					document.removeEventListener( 'mozfullscreenchange', fullscreenchange );
					element.requestPointerLock();
				}
			}
			
			document.addEventListener( 'fullscreenchange', fullscreenchange, false );
			document.addEventListener( 'mozfullscreenchange', fullscreenchange, false );

			element.requestFullscreen = element.requestFullscreen || element.mozRequestFullscreen || element.mozRequestFullScreen || element.webkitRequestFullscreen;
			element.requestFullscreen();	
		}
		else {
				element.requestPointerLock();
			}
		}, false);
		} else {
			instructions.innerHTML = 'Your browser doesn\'t seem to support Pointer Lock API';
	}

THREE.Sphere.__closest = new THREE.Vector3();

THREE.Sphere.prototype.intersectsBox = function (box) {
	THREE.Sphere.__closest.set(this.center.x, this.center.y, this.center.z);
	THREE.Sphere.__closest.clamp(box.min, box.max);
	var distance =  this.center.distanceToSquared(THREE.Sphere.__closest);

	return distance < (this.radius * this.radius);
};

var sphereShape, sphereBody, world, physicsMaterial, walls=[], balls=[], ballMeshes=[], boxes=[], boxMeshes=[];
var camera, topCamera, gameplayCamera;
var turnCameraRight;
var turnCameraLeft;
var playerDummy;
var scene, renderer;
var geometry, material, mesh;
var floor;
var controlsEnabled = false;
var controls, time = Date.now();
var clock;

	
var count01 = 1, count02 = 1,
	count03 = 1;

var jsonLoader;
var loadingManager;
var loadingComplete;
var radius = 3.5;
var collisionDetected, collisionDetected02, collisionDetected03;
var trigger00, trigger00Body;
var cubeBBox;
var sphereBBox;
var greatSphereBody;
var greatSphere2;
var mesh01;

initCannon();
init();
se = new SceneEntities();
animate();

function init() {
	loadingManager = new THREE.LoadingManager();
	textureLoader = new THREE.TextureLoader(loadingManager);

	loadingManager.onLoad = function ( ) {
		loadingComplete = true;
	};
			
	gameplayCamera = true;
	topCamera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, .1, 1000 );
	topCamera.position.z = 50;
	topCamera.position.y = 10;

	//camera chase
	camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, .1, 1000 );
	container = document.createElement( 'div' );
	document.body.appendChild( container );
	scene = new THREE.Scene();
	scene.fog = new THREE.Fog( 0xffffff, 0, 500 );


	listener = new THREE.AudioListener();
	camera.add(listener);	
	sound = new THREE.Audio(listener);
	audioLoader = new THREE.AudioLoader();

	var spherePlayerGeometry = new THREE.SphereGeometry(radius);
	var spherePlayerMaterial = new THREE.MeshBasicMaterial({ color: 0x000000 
															 //side: THREE.DoubleSide, 
															 //wireframe: true
															 //transparent: true, 
															 //opacity: .5 
															 });

	var player = new THREE.Mesh(spherePlayerGeometry, spherePlayerMaterial);
	player.geometry.computeBoundingSphere();

	sphereBBox = new THREE.Sphere(player.position,
							player.geometry.boundingSphere.radius);
	scene.add(player);

	material = new THREE.MeshLambertMaterial( { color: 0xdddddd } );

	var bluesky = 0xE9F6F6
	var blacksky = 0x000000

	renderer = new THREE.WebGLRenderer({antialias: true});
	renderer.shadowMap.enabled = true;
	renderer.shadowMapSoft = true;
	renderer.setSize( window.innerWidth, window.innerHeight );
	renderer.setClearColor( blacksky, 1 );

	controls = new PointerLockControls( camera, sphereBody, player);
	scene.add( controls.getObject() );		
	controls.getObject().position.set(300, 5, 187.5); 
	controls.getObject().rotation.y =  Math.PI

	document.body.appendChild( renderer.domElement );
	window.addEventListener( 'resize', onWindowResize, false );

	var size = 240;
	var divisions = 10;
	var gridHelper = new THREE.GridHelper( 1000, 100 );

	axisHelper = new THREE.AxisHelper( 50 );
	scene.add( axisHelper );

	jsonLoader = new THREE.JSONLoader(loadingManager);
	jsonLoader.load('../assets/models/mount.json',
	
	function(geometry, materials) {
		mount = new THREE.Mesh(	geometry, new THREE.MeshPhongMaterial({ }));
			
		mount.position.set( 700, -10, 187.5 );
		scene.add(mount);
				
		var mount2 = mount.clone();
		mount2.position.set( -125, -10, 187.5 );
		scene.add(mount2);
		
		var mount3 = mount.clone();				
		mount3.position.set( 284, -10, -400);
		scene.add(mount3);

		var mount4 = mount.clone();	
		mount4.position.set( 700, -10, 600);
		scene.add(mount4);
		
		var mount5 = mount.clone();	
		mount5.position.set( -250, -10, 830);
		scene.add(mount5);
		
	});

	// Add linked boxes
	var size = 1.3;
	var he = new CANNON.Vec3(size,size,size*0.1);
	var boxShape = new CANNON.Box(he);
	var mass = 0;
	var space = 0.1 * size;
	var N = 5, last;
	var boxGeometry = new THREE.BoxGeometry(he.x*2,he.y*2,he.z*2);
	for(var i=0; i<N; i++){
		var boxbody = new CANNON.Body({ mass: mass });
		boxbody.addShape(boxShape);
		var boxMesh = new THREE.Mesh(boxGeometry, material);
		boxbody.position.set(300,((N-i)*(size*2+2*space) + size*2+space) -3.8 , 400);
		boxbody.linearDamping = 0.01;
		boxbody.angularDamping = 0.01;
		boxMesh.receiveShadow = true;
		world.addBody(boxbody);
		scene.add(boxMesh);
		boxes.push(boxbody);
		boxMeshes.push(boxMesh);

		if(i!=0){
			var c1 = new CANNON.PointToPointConstraint(boxbody,new CANNON.Vec3(-size,size+space,0),last,new CANNON.Vec3(-size,-size-space,0));
			var c2 = new CANNON.PointToPointConstraint(boxbody,new CANNON.Vec3(size,size+space,0),last,new CANNON.Vec3(size,-size-space,0));
			world.addConstraint(c1);
			world.addConstraint(c2);
		} else {
			mass=0.3;
		}
		last = boxbody;
	}
	
	var size = 1.3;
	var he = new CANNON.Vec3(size,size,size*0.1);
	var boxShape = new CANNON.Box(he);
	var mass = 0;
	var space = 0.1 * size;
	var N = 5, last;
	var boxGeometry = new THREE.BoxGeometry(he.x*2,he.y*2,he.z*2);
	for(var i=0; i<N; i++){
		var boxbody = new CANNON.Body({ mass: mass });
		boxbody.addShape(boxShape);
		var boxMesh = new THREE.Mesh(boxGeometry, material);
		boxbody.position.set(297,((N-i)*(size*2+2*space) + size*2+space) -3.8 , 401);
		boxbody.linearDamping = 0.01;
		boxbody.angularDamping = 0.01;
		boxMesh.receiveShadow = true;
		world.addBody(boxbody);
		scene.add(boxMesh);
		boxes.push(boxbody);
		boxMeshes.push(boxMesh);

		if(i!=0){
			var c1 = new CANNON.PointToPointConstraint(boxbody,new CANNON.Vec3(-size,size+space,0),last,new CANNON.Vec3(-size,-size-space,0));
			var c2 = new CANNON.PointToPointConstraint(boxbody,new CANNON.Vec3(size,size+space,0),last,new CANNON.Vec3(size,-size-space,0));
			world.addConstraint(c1);
			world.addConstraint(c2);
		} else {
			mass=0.3;
		}
		last = boxbody;
	}
	
	var size = 1.3;
	var he = new CANNON.Vec3(size,size,size*0.1);
	var boxShape = new CANNON.Box(he);
	var mass = 0;
	var space = 0.1 * size;
	var N = 5, last;
	var boxGeometry = new THREE.BoxGeometry(he.x*2,he.y*2,he.z*2);
	for(var i=0; i<N; i++){
		var boxbody = new CANNON.Body({ mass: mass });
		boxbody.addShape(boxShape);
		var boxMesh = new THREE.Mesh(boxGeometry, material);
		boxbody.position.set(293.5,((N-i)*(size*2+2*space) + size*2+space) -3.8 , 400);
		boxbody.linearDamping = 0.01;
		boxbody.angularDamping = 0.01;
		boxMesh.receiveShadow = true;
		world.addBody(boxbody);
		scene.add(boxMesh);
		boxes.push(boxbody);
		boxMeshes.push(boxMesh);

		if(i!=0){
			var c1 = new CANNON.PointToPointConstraint(boxbody,new CANNON.Vec3(-size,size+space,0),last,new CANNON.Vec3(-size,-size-space,0));
			var c2 = new CANNON.PointToPointConstraint(boxbody,new CANNON.Vec3(size,size+space,0),last,new CANNON.Vec3(size,-size-space,0));
			world.addConstraint(c1);
			world.addConstraint(c2);
		} else {
			mass=0.3;
		}
		last = boxbody;
	}
	
	var size = 1.3;
	var he = new CANNON.Vec3(size,size,size*0.1);
	var boxShape = new CANNON.Box(he);
	var mass = 0;
	var space = 0.1 * size;
	var N = 5, last;
	var boxGeometry = new THREE.BoxGeometry(he.x*2,he.y*2,he.z*2);
	for(var i=0; i<N; i++){
		var boxbody = new CANNON.Body({ mass: mass });
		boxbody.addShape(boxShape);
		var boxMesh = new THREE.Mesh(boxGeometry, material);
		boxbody.position.set(290,((N-i)*(size*2+2*space) + size*2+space) -3.8 , 400);
		boxbody.linearDamping = 0.01;
		boxbody.angularDamping = 0.01;
		boxMesh.receiveShadow = true;
		world.addBody(boxbody);
		scene.add(boxMesh);
		boxes.push(boxbody);
		boxMeshes.push(boxMesh);

		if(i!=0){
			var c1 = new CANNON.PointToPointConstraint(boxbody,new CANNON.Vec3(-size,size+space,0),last,new CANNON.Vec3(-size,-size-space,0));
			var c2 = new CANNON.PointToPointConstraint(boxbody,new CANNON.Vec3(size,size+space,0),last,new CANNON.Vec3(size,-size-space,0));
			world.addConstraint(c1);
			world.addConstraint(c2);
		} else {
			mass=0.3;
		}
		last = boxbody;
	}
	
	var size = 1.3;
	var he = new CANNON.Vec3(size,size,size*0.1);
	var boxShape = new CANNON.Box(he);
	var mass = 0;
	var space = 0.1 * size;
	var N = 5, last;
	var boxGeometry = new THREE.BoxGeometry(he.x*2,he.y*2,he.z*2);
	for(var i=0; i<N; i++){
		var boxbody = new CANNON.Body({ mass: mass });
		boxbody.addShape(boxShape);
		var boxMesh = new THREE.Mesh(boxGeometry, material);
		boxbody.position.set(287.5,((N-i)*(size*2+2*space) + size*2+space) -3.8 , 400);
		boxbody.linearDamping = 0.01;
		boxbody.angularDamping = 0.01;
		boxMesh.receiveShadow = true;
		world.addBody(boxbody);
		scene.add(boxMesh);
		boxes.push(boxbody);
		boxMeshes.push(boxMesh);

		if(i!=0){
			var c1 = new CANNON.PointToPointConstraint(boxbody,new CANNON.Vec3(-size,size+space,0),last,new CANNON.Vec3(-size,-size-space,0));
			var c2 = new CANNON.PointToPointConstraint(boxbody,new CANNON.Vec3(size,size+space,0),last,new CANNON.Vec3(size,-size-space,0));
			world.addConstraint(c1);
			world.addConstraint(c2);
		} else {
			mass=0.3;
		}
		last = boxbody;
	}
	
	clock = new THREE.Clock();
	
	raycaster = new THREE.Raycaster();
	mouse = new THREE.Vector2();
}

function onWindowResize() {
	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();
	renderer.setSize( window.innerWidth, window.innerHeight );
}

function animate(){
	setTimeout( function() {
	requestAnimationFrame( animate );
	}, 1000 / 60 );

	TWEEN.update();

	if(loadingComplete){
		render();
	}
}
	
function render() {
	var dt = 1/60;
	cubeBBox.setFromObject(trigger00);
			
	if(sphereBBox.intersectsBox(cubeBBox)  ){
		collisionDetected = true;
	}			

	if(collisionDetected){
		mesh01.rotation.y += .001;			
		new TWEEN.Tween(trigger00.position).to({
				x: 305,
				y: 20,
				z: 515
			}, 4000)
			.easing(TWEEN.Easing.Linear.None).start();
						
		new TWEEN.Tween(trigger00Body.position).to({
				x: 305,
				y: 20,
				z: 515
			}, 4000)
			.easing(TWEEN.Easing.Linear.None).start();
			
		new TWEEN.Tween(trigger02.position).to({
			   x: 185,
			   y: 0,
			   z: 787.5
			}, 4000)
			.easing(TWEEN.Easing.Linear.None).start();	
	}
			
	AABBtrigger02.setFromObject(trigger02);
	if(sphereBBox.intersectsBox(AABBtrigger02)){
		collisionDetected02 = true;
	}
		
	if(collisionDetected02){
		world.removeBody(greatSphereBody);
		setTimeout( function() {
		}, 4000);
		
		setTimeout( function() {
			floor.material = new THREE.MeshLambertMaterial({color: 0X000000 });
			}, 4000);
	}
	
	AABBtrigger03.setFromObject(trigger03);
	if(sphereBBox.intersectsBox(AABBtrigger03)){			
		collisionDetected03 = true;
	}
						   
	if(controls.enabled){
		world.step(dt);
		// Update ball positions
		for(var i=0; i<balls.length; i++){
			ballMeshes[i].position.copy(balls[i].position);
			ballMeshes[i].quaternion.copy(balls[i].quaternion);
		}
		// Update box positions
		for(var i=0; i<boxes.length; i++){
			boxMeshes[i].position.copy(boxes[i].position);
			boxMeshes[i].quaternion.copy(boxes[i].quaternion);
		}
	}

	controls.update( (Date.now() - time) * 8 );
	
	if(gameplayCamera){
		renderer.render( scene, camera );
	}
	else{
		renderer.render(scene, topCamera);
	}
	time = Date.now();
}