function SceneEntities(){


	var ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
	scene.add(ambientLight);
		
	var sunPositionX = 0;
	var sunPositionY = 500;
	var sunPositionZ = 825;	
		
	var light = new THREE.DirectionalLight( 0xFEFFF3, 0.5  );
	light.position.set( sunPositionX, sunPositionY, sunPositionZ );
	scene.add( light );

	var spotLight = new THREE.SpotLight( 0xffcccc, 1.27);
	spotLight.position.set(175 , 30, 787.5 );
	spotLight.target.position.set(70, 40, 787.5);
	scene.add(spotLight.target);

    var sunGeometry = new THREE.SphereGeometry(30, 10, 10, 0);
	sunMaterial = new THREE.MeshBasicMaterial({color: 0xffffff});
	sun	= new THREE.Mesh(sunGeometry, sunMaterial);
	light.add(sun);

	var sunGeometryWire = new THREE.SphereGeometry(30, 10, 10, 0);
	var sunMaterialWire = new THREE.MeshBasicMaterial({color: 0x000000, wireframe: true });
	var sunWire			= new THREE.Mesh(sunGeometryWire, sunMaterialWire);
	//light.add(sunWire);


	var floorGeometry = new THREE.PlaneGeometry(600, 1200, 1, 1);
	var floorMaterial = new THREE.MeshLambertMaterial({	color: 0x8DDB7D/*0xBAFFA0*/      //0xE0FFD4
														//emissive: 0xffffff,
														//emissiveIntensity: 0
														});

	floor = new THREE.Mesh(floorGeometry, floorMaterial);
	floor.receiveShadow = true;
	scene.add(floor);
	floor.position.z = 600;
	floor.position.x = 300;
	floor.rotation.x = 1.5 * Math.PI;
	floor.rotation.z = -1 * Math.PI;

	var playerDummyGeometry = new THREE.SphereGeometry(radius);
	var playerDummyMaterial = new THREE.MeshLambertMaterial({color: 0x000000});
		playerDummy			= new THREE.Mesh(playerDummyGeometry, playerDummyMaterial);
	scene.add(playerDummy);

	playerDummy.add(topCamera);

	var bushes00Geometry = new THREE.BoxGeometry(6, 6, 12);
	var bushes00Material = new THREE.MeshBasicMaterial({color: 0x0000ff});
	var bushes00		 = new THREE.Mesh(bushes00Geometry, bushes00Material);
	scene.add(bushes00);
	bushes00.position.set(318, 5, 230);

	var papillon00Geometry = new THREE.BoxGeometry(1, 1, 1);
	var papillon00Material = new THREE.MeshBasicMaterial({color: 0xFF0000});
	var papillon00		   = new THREE.Mesh(papillon00Geometry, papillon00Material);
	scene.add(papillon00);
	papillon00.position.set(313, 5, 230);

	var mesh01Geometry 	= new THREE.SphereGeometry(90, 32, 32, 0);
	var mesh01Material 	= new THREE.MeshBasicMaterial({wireframe: true, color: 0xFF0000});
	mesh01			= new THREE.Mesh(mesh01Geometry, mesh01Material);
	scene.add(mesh01);
	mesh01.position.set(400, 30, 750);

	var halfExtentsTrigger00 = new CANNON.Vec3(15,25,15);
	var trigger00Shape = new CANNON.Box(halfExtentsTrigger00);
		trigger00Body = new CANNON.Body({ mass: 0 });
	trigger00Body.addShape(trigger00Shape);
	world.addBody(trigger00Body);



	trigger00Body.position.set(305,-24,515);		

	var trigger00Geometry = new THREE.BoxGeometry(30, 50, 30, 6, 6, 6);
	var trigger00Material = new THREE.MeshLambertMaterial({color: 0xFF00FF, transparent: true, opacity: 1});
		trigger00 		  = new THREE.Mesh(trigger00Geometry, trigger00Material);
	cubeBBox = new THREE.Box3(new THREE.Vector3(), new THREE.Vector3());
	scene.add(trigger00);
	trigger00.position.set(305, -24, 515);

	var trigger02Geometry = new THREE.BoxGeometry( 6, 30, 4, 1, 1 ); 
	var trigger02Material = new THREE.MeshLambertMaterial({color: 0xFF00FF, transparent: true, opacity: 0.2});
		trigger02 		  =	new THREE.Mesh(trigger02Geometry, trigger02Material);
		AABBtrigger02 	  = new THREE.Box3(new THREE.Vector3(), new THREE.Vector3());
	scene.add(trigger02);
	trigger02.position.set(175, -16, 787.5);

	var trigger03Geometry = new THREE.BoxGeometry( 40, 30, 4, 1, 1 );
	var trigger03Material = new THREE.MeshLambertMaterial({color: 0xFF00FF, transparent: true, opacity: 0});
		trigger03 		  =	new THREE.Mesh(trigger03Geometry, trigger03Material);
		AABBtrigger03 	  = new THREE.Box3(new THREE.Vector3(), new THREE.Vector3());
	scene.add(trigger03);
	trigger03.position.set(117, 0, 787.5);
	trigger03.rotation.x = - Math.PI;
	trigger03.rotation.y = .5 * Math.PI;
	trigger03.rotation.z =  Math.PI;



	//SphereGeometry(radius, widthSegments, heightSegments, phiStart, phiLength, thetaStart, thetaLength)
	var greatSphereGeometry = new THREE.SphereGeometry(75, 24, 24, 0);
	var greatSphereMaterial = new THREE.MeshBasicMaterial({color: 0x0000FF, side: THREE.DoubleSide});
	greatSphere 			= new THREE.Mesh(greatSphereGeometry, greatSphereMaterial);
	scene.add(greatSphere);
	greatSphere.position.set(112.5, 30, 787.5);

	var greatSphereGeometry = new THREE.SphereGeometry(75.08, 24, 24, 0);
	var greatSphereMaterial = new THREE.MeshBasicMaterial({color: 0x00000f, wireframe: true});
	greatSphere2 			= new THREE.Mesh(greatSphereGeometry, greatSphereMaterial);
	scene.add(greatSphere2);
	greatSphere2.position.set(112.5, 30, 787.5);


	var greatSphereShape = new CANNON.Sphere(75);
	greatSphereBody 	 = new CANNON.Body({ mass: 0 });
	greatSphereBody.addShape(greatSphereShape);
	world.addBody(greatSphereBody);
	greatSphereBody.position.set(112.5,30,787.5);	

	var arc00Geometry = new THREE.BoxGeometry(150, 50, 10);
	var arc00Material = new THREE.MeshLambertMaterial({color: 0xFFFFFF, side: THREE.DoubleSide});
	var arc00		  = new THREE.Mesh(arc00Geometry, arc00Material);
	scene.add(arc00);
	arc00.position.set(377, 25, 400);



	var halfExtents00 = new CANNON.Vec3(75,25,5);
	var arc00Shape = new CANNON.Box(halfExtents00);
	var arc00Body = new CANNON.Body({ mass: 0 });
	arc00Body.addShape(arc00Shape);
	world.addBody(arc00Body);
	arc00Body.position.set(377,25,400);	

	var arc01Geometry = new THREE.BoxGeometry(150, 50, 10);
	var arc01Material = new THREE.MeshLambertMaterial({color: 0xFFFFFF, side: THREE.DoubleSide});
	var arc01		  = new THREE.Mesh(arc01Geometry, arc01Material);
	scene.add(arc01);
	arc01.position.set(210, 25, 400);

	var halfExtents01 = new CANNON.Vec3(75,25,5);
	var arc01Shape = new CANNON.Box(halfExtents01);
	var arc01Body = new CANNON.Body({ mass: 0 });
	arc01Body.addShape(arc01Shape);
	world.addBody(arc01Body);
	arc01Body.position.set(210,25,400);	

	var arc02Geometry = new THREE.BoxGeometry(30, 35, 10);
	var arc02Material = new THREE.MeshLambertMaterial({color: 0xFFFFFF, side: THREE.DoubleSide});
	var arc02		  = new THREE.Mesh(arc02Geometry, arc02Material);
	scene.add(arc02);
	arc02.position.set(295, 32.5, 400);



	var dotGeometry = new THREE.PlaneGeometry(.01, .01, 1, 1);
	var dotMaterial = new THREE.MeshLambertMaterial({color: 0x000000});
	var dot 		= new THREE.Mesh(dotGeometry, dotMaterial);
	dot.position.set(0,0,-2);
	camera.add(dot);



}