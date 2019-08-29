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
// get box closest point to sphere center by clamping
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

//var ambientLight, spotLight;


// ** Audio ** //
var listener, sound, audioLoader, play;

var geometry, material, mesh;
var floor;
var controlsEnabled = false;
var controls, time = Date.now();
var objects = [];
var action = {}, action2 = {};
var mixer, mixer2;
var clock, delta2;

var object01 = [], object02 = [],
	object03 = [];
	
var count01 = 1, count02 = 1,
	count03 = 1;

var jsonLoader;
var enveloppe;
var feuille;
var enveloppeCatcher;


var loadingManager;
var loadingComplete;

var radius = 3.5;

var collisionDetected, collisionDetected02, collisionDetected03;

var trigger00, trigger00Body;
var cubeBBox;
var sphereBBox;
var greatSphereBody;
var greatSphere2;

//var trigger02, trigger03, AABBtrigger02, AABBtrigger03;

var mesh01;

initCannon();
init();
se = new SceneEntities();
animate();
			
function Stars(lookatobject){
	var geom = new THREE.Geometry(); 
	var v1 = new THREE.Vector3(0,0,0);
	var v2 = new THREE.Vector3(0,500,0);
	var v3 = new THREE.Vector3(0,500,500);

	geom.vertices.push(v1);
	geom.vertices.push(v2);
	geom.vertices.push(v3);

	//geom.id=0;


	geom.faces.push( new THREE.Face3( 0, 1, 2 ) );
	geom.computeFaceNormals();

	//geom.lookAt(new THREE.Vector3(0,0,0));
	geom.lookAt(lookatobject);

	var star = new THREE.Mesh( geom, new THREE.MeshBasicMaterial() );
	//star.

	star.position.set(300, 5, 187.5)
	star.rotation.y = -Math.PI * .5;//triangle is pointing in depth, rotate it -90 degrees on Y

	scene.add(star);
}

function init() {
			
	///// L O A D I N G   M A N A G E R /////
	loadingManager = new THREE.LoadingManager();
	textureLoader = new THREE.TextureLoader(loadingManager);

	loadingManager.onLoad = function ( ) {
		loadingComplete = true;
		console.log( 'Loading complete!');
	};
			
	// CAMERA
	gameplayCamera = true;
	//top camera

	topCamera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, .1, 1000 );
	topCamera.position.z = 50;
	topCamera.position.y = 10;

	//camera chase
	camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, .1, 1000 );

	container = document.createElement( 'div' );
	document.body.appendChild( container );

	scene = new THREE.Scene();
	scene.fog = new THREE.Fog( 0xffffff, 0, 500 );

	// ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
	// scene.add(ambientLight);
		
	// var sunPositionX = 0;
	// var sunPositionY = 500;
	// var sunPositionZ = 825;	
		
	// light = new THREE.DirectionalLight( 0xFEFFF3, 0.5  );
	// light.position.set( sunPositionX, sunPositionY, sunPositionZ );
	// scene.add( light );

	// spotLight = new THREE.SpotLight( 0xffcccc, 1.27);
	// spotLight.position.set(175 , 30, 787.5 );
	// spotLight.target.position.set(70, 40, 787.5);
	// scene.add(spotLight.target);
	// scene.add(spotLight);

	function sky(){
		this.polar = new THREE.HemisphereLight(0xFF5632, 0x080820, .5);
		this.polar.position.set(70,40, 10000)
		//scene.add(this.polar);
	}

	listener = new THREE.AudioListener();
	camera.add(listener);	
	sound = new THREE.Audio(listener);
	audioLoader = new THREE.AudioLoader();

	//Load a sound and set it as the Audio object's buffer
	audioLoader.load( '../assets/sound/The_Monolith_On_The_Moon.ogg', function( buffer ) {
		sound.setBuffer( buffer );
		sound.setLoop(true);
		sound.setVolume(.9);
		//sound.play();
	});	

	var spherePlayerGeometry = new THREE.SphereGeometry(radius);
	var spherePlayerMaterial = new THREE.MeshBasicMaterial({ color: 0x000000 
															 //side: THREE.DoubleSide, 
															 //wireframe: true
															 //transparent: true, 
															 //opacity: .5 
															 });

	var player		 = new THREE.Mesh(spherePlayerGeometry, spherePlayerMaterial);
	player.geometry.computeBoundingSphere();

	sphereBBox = new THREE.Sphere(player.position,
							player.geometry.boundingSphere.radius);
	scene.add(player);

	var moncieletoile = new Stars(player.position);

	material = new THREE.MeshLambertMaterial( { color: 0xdddddd } );

	var bluesky = 0xE9F6F6
	var blacksky = 0x000000

	renderer = new THREE.WebGLRenderer(/*{antialias: true}*/);
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
	//scene.add( gridHelper );

	axisHelper = new THREE.AxisHelper( 50 );
	scene.add( axisHelper );

	//document.getElementById("WebGL-output").appendChild(renderer.domElement);

	jsonLoader = new THREE.JSONLoader(loadingManager);
	jsonLoader.load('../assets/models/enveloppe.json',

	function(geometry, materials) {
		enveloppe = new THREE.SkinnedMesh(	geometry,
											new THREE.MeshPhongMaterial({
											normalScale: new THREE.Vector2(1, 2),
											specular: 0x2A2926,
											map: textureLoader.load('../assets/images/Enveloppe_Diffuse.jpg'),
											normalMap: textureLoader.load('../assets/images/Enveloppe_NormalMap.jpg'),
											specularMap: textureLoader.load('../assets/images/Enveloppe_SpecularMap.jpg'),
											skinning: true
										}));

		enveloppe.geometry.computeVertexNormals();

		mixer = new THREE.AnimationMixer(enveloppe);

		action.idle = mixer.clipAction(geometry.animations[0]);
		action.intro = mixer.clipAction(geometry.animations[1]);
		action.ouverture = mixer.clipAction(geometry.animations[2]);

		action.idle.setEffectiveWeight(1);
		action.ouverture.setEffectiveWeight(1);

		action.ouverture.setLoop(THREE.LoopOnce, 0);
		action.ouverture.clampWhenFinished = true;

		action.intro.setLoop(THREE.LoopOnce, 0);
		action.intro.clampWhenFinished = true;

		action.idle.enabled = true;
		action.ouverture.enabled = true;

		var position = {
			x: 70,
			y: 40,
			z: 787.5
		};
		enveloppe.position.x = position.x;
		enveloppe.position.y = position.y;
		enveloppe.position.z = position.z;


		//enveloppe.rotation.y = 2 * Math.PI;
		enveloppe.rotation.x =  -  Math.PI ;
		enveloppe.rotation.y = .5 * Math.PI;
		enveloppe.rotation.z = Math.PI;

		enveloppe.scale.set(4.5,4.5,4.5);
		//action.idle.play();
		scene.add(enveloppe);
	});
		
		
	jsonLoader.load('../assets/models/feuille.json',
		function(geometry, materials) {
			feuille = new THREE.SkinnedMesh(geometry,
				new THREE.MeshPhongMaterial({
					map: textureLoader.load('../assets/images/brave_diffuse.jpg'),
					normalMap: textureLoader.load('../assets/images/Feuille_NormalMap.jpg'),
					normalScale: new THREE.Vector2(.75, .75),
					specularMap: textureLoader.load('../assets/images/Feuille_SpecularMap.jpg'),
					specular: 0x2A2926,
					shininess: 3,
					skinning: true
				}));

			feuille.geometry.computeVertexNormals();

			mixer2 = new THREE.AnimationMixer(feuille);

			action2.idle2 = mixer2.clipAction(geometry.animations[0]);
			action2.intro2 = mixer2.clipAction(geometry.animations[1]);
			action2.ouverture2 = mixer2.clipAction(geometry.animations[2]);

			action2.idle2.setEffectiveWeight(1);
			action2.ouverture2.setEffectiveWeight(1);

			action2.ouverture2.setLoop(THREE.LoopOnce, 0);
			action2.ouverture2.clampWhenFinished = true;

			action2.intro2.setLoop(THREE.LoopOnce, 0);
			action2.intro2.clampWhenFinished = true;

			action2.idle2.enabled = true;
			action2.ouverture2.enabled = true;


			var position2 = {
				x: 70,
				y: 40,
				z: 787.5
			};

			feuille.position.x = position2.x;
			feuille.position.y = position2.y;
			feuille.position.z = position2.z;
			
			feuille.rotation.x = - Math.PI;
			feuille.rotation.y = .5 * Math.PI;
			feuille.rotation.z = Math.PI;
			
			feuille.scale.set(4.5,4.5,4.5);
			//action2.idle2.play();
			scene.add(feuille);
		});
		
			
	var enveloppeCatcherGeometry = new THREE.PlaneGeometry(30, 20, 1, 1);
	var enveloppeCatcherMaterial = new THREE.MeshLambertMaterial({color: 0xFF0000, wireframe: true /*, transparent: true, opacity: 0 */});
	enveloppeCatcher = new THREE.Mesh(enveloppeCatcherGeometry, enveloppeCatcherMaterial);
	
	enveloppeCatcher.position.set(20, 30, 800);
	
	enveloppeCatcher.rotation.x = - Math.PI;
	enveloppeCatcher.rotation.z = .4 * Math.PI;
	enveloppeCatcher.rotation.y = Math.PI;
	scene.add(enveloppeCatcher);
	object03.push(enveloppeCatcher);
	
	
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
	
	// Add boxes
	var halfExtents = new CANNON.Vec3(1,1,1);
	var boxShape = new CANNON.Box(halfExtents);
	var boxGeometry = new THREE.BoxGeometry(halfExtents.x*2,halfExtents.y*2,halfExtents.z*2);
	for(var i=0; i<7; i++){
		var x = ((Math.random()-0.5)*20) - 120 ;
		var y = 1 + (Math.random()-0.5)*1;
		var z = ((Math.random()-0.5)*20);
		var boxBody = new CANNON.Body({ mass: 5 });
		boxBody.addShape(boxShape);
		var boxMesh = new THREE.Mesh( boxGeometry, material );
		world.addBody(boxBody);
		scene.add(boxMesh);
		boxBody.position.set(x,y,z);
		boxMesh.position.set(x,y,z);
		boxMesh.castShadow = true;
		boxMesh.receiveShadow = true;
		boxes.push(boxBody);
		boxMeshes.push(boxMesh);
	}


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
		// boxMesh.castShadow = true;
		boxMesh.receiveShadow = true;
		world.addBody(boxbody);
		scene.add(boxMesh);
		boxes.push(boxbody);
		boxMeshes.push(boxMesh);

		if(i!=0){
			// Connect this body to the last one
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
		// boxMesh.castShadow = true;
		boxMesh.receiveShadow = true;
		world.addBody(boxbody);
		scene.add(boxMesh);
		boxes.push(boxbody);
		boxMeshes.push(boxMesh);

		if(i!=0){
			// Connect this body to the last one
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
		// boxMesh.castShadow = true;
		boxMesh.receiveShadow = true;
		world.addBody(boxbody);
		scene.add(boxMesh);
		boxes.push(boxbody);
		boxMeshes.push(boxMesh);

		if(i!=0){
			// Connect this body to the last one
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
		// boxMesh.castShadow = true;
		boxMesh.receiveShadow = true;
		world.addBody(boxbody);
		scene.add(boxMesh);
		boxes.push(boxbody);
		boxMeshes.push(boxMesh);

		if(i!=0){
			// Connect this body to the last one
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
		// boxMesh.castShadow = true;
		boxMesh.receiveShadow = true;
		world.addBody(boxbody);
		scene.add(boxMesh);
		boxes.push(boxbody);
		boxMeshes.push(boxMesh);

		if(i!=0){
			// Connect this body to the last one
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
	//raycaster.set( camera.getWorldPosition(), camera.getWorldDirection() );
	mouse = new THREE.Vector2();
	// add the output of the renderer to the html element
	//document.getElementById("WebGL-output").appendChild(renderer.domElement);
	document.addEventListener('mousedown', onDocumentMouseDown, false);
}
	
	
	
function onDocumentMouseDown(event) { 

	raycaster.setFromCamera( new THREE.Vector2(), camera)

	var intersects = raycaster.intersectObjects(scene.children);

	var intersects01 = raycaster.intersectObjects(object01);

	if (intersects01.length > 0) {
		count01++;
		
		if(count01 % 2 == 0){
			rotation01 = true;
		}
		else{
			rotation01 = false;
		}
	}
	var intersects02 = raycaster.intersectObjects(object02);

	if (intersects02.length > 0) {              		
		count02++;
			
		if(count02 % 2 == 0){
			rotation02 = true;
		}
		else{
			rotation02 = false;
		}
	}

	//** Enveloppe trigger **//
	var intersects03 = raycaster.intersectObjects(object03);

	if (intersects03.length > 0) {              		
		count03++;
			
		if(count03 % 2 == 0){
			action.idle.stop();
			action.ouverture.play();
			action2.idle2.stop();
			action2.ouverture2.play();
		}
		else{
			rotation03 = false;
		}
	}		
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
			scene.remove(ambientLight);
		}, 4000);
		
		setTimeout( function() {
			floor.material = new THREE.MeshLambertMaterial({color: 0X000000 });
			}, 4000);
		
		scene.add(spotLight);
		sound.play();
		action.idle.play();
		action2.idle2.play();
	}
	
	AABBtrigger03.setFromObject(trigger03);
	if(sphereBBox.intersectsBox(AABBtrigger03)){			
		collisionDetected03 = true;
	}
		
	if(collisionDetected03){
		spotLight.color.setHex(0xffffff);
		spotLight.intensity = 0.9;
		sound.stop();
		action.idle.stop();
		action2.idle2.stop();
		action.ouverture.play();
		action2.ouverture2.play();
		
	}
				
	mixer.update(dt);
	mixer2.update(dt);
						   
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
	
	if(turnCameraRight == true){
		//playerDummy.rotation.y += .02;
		//cannonBody.rotation.y  += .02;
	}
	
	if(turnCameraLeft == true){
		//playerDummy.rotation.y -= .02;
	}
	
	if(gameplayCamera){
		renderer.render( scene, camera );
	}
	else{
		renderer.render(scene, topCamera);
	}

	time = Date.now();
}