function player(){
	THREE.Mesh.apply(this, arguments);
	this.rotation.order = 'YXZ';
	this._aggregateRotation = new THREE.Vector3();
	this.cameraHeight = 40;
	this.velocity = new THREE.Vector3();
	this.acceleration = new THREE.Vector3(0, -150, 0);
	this.ambientFriction = new THREE.Vector3(-10, 0, -10);
	this.moveDirection = {
		FORWARD: false,
		BACKWARD: false,
		LEFT: false,
		RIGHT: false
	};
	Player.prototype = Object.create(THREE.Mesh.prototype);
	Player.prototype.constructor = Player;
}