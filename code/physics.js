function initCannon(){
		// Setup world
		world = new CANNON.World();
		world.quatNormalizeSkip = 0;
		world.quatNormalizeFast = false;

		var solver = new CANNON.GSSolver();
		
		world.defaultContactMaterial.contactEquationStiffness = 1e9;
		world.defaultContactMaterial.contactEquationRelaxation = 4;
		solver.iterations = 7;
		solver.tolerance = 0.1;
		var split = true;

		if(split){
			world.solver = new CANNON.SplitSolver(solver);
		}
		else{
			world.solver = solver;
		}

		world.gravity.set(0,-100,0);
		world.broadphase = new CANNON.NaiveBroadphase();

		physicsMaterial = new CANNON.Material("slipperyMaterial");
		var physicsContactMaterial = new CANNON.ContactMaterial(physicsMaterial,
																physicsMaterial,
																0.0, // friction coefficient
																0.3  // restitution
																);
		
		world.addContactMaterial(physicsContactMaterial);

		// Create a sphere
		var mass = 1;
		sphereShape = new CANNON.Sphere(radius);
		sphereBody = new CANNON.Body({ mass: mass });
		sphereBody.addShape(sphereShape);
		sphereBody.position.set(300, 5, 187.5);
		sphereBody.linearDamping = 0.9;
		world.addBody(sphereBody);

		// Create a floor
		var groundShape = new CANNON.Plane();
		var groundBody = new CANNON.Body({ mass: 0 });
		
		groundBody.addShape(groundShape);
		groundBody.position.set(0,0,0);
		groundBody.quaternion.setFromAxisAngle(new CANNON.Vec3(1,0,0),-Math.PI/2);
		world.addBody(groundBody);
	}