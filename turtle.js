function turtle(x,y,z){
	this.pos = {x: x, y: y, z: z};
	this.dir = {x: 0, y: 0, z: 1};
	this.unit = 2.5;
	this.angle = 90;
	this.rad = Math.PI/180;
}


turtle.prototype.debug = function(){
	this.drawDir();
}

turtle.prototype.drawDir = function(){

	/* 
		Draw Arrow
	*/

	context.beginPath();
	context.strokeStyle= "blue";
	context.moveTo(this.pos.x, this.pos.y);
	context.lineTo(this.pos.x + this.unit*this.dir.x, this.pos.y + this.unit*this.dir.y);
	context.stroke();
	context.closePath();

	context.beginPath();
	context.fillStyle = "red";
	context.arc(this.pos.x + this.unit*this.dir.x, this.pos.y + this.unit*this.dir.y, 2, 0, 2*Math.PI);
	context.fill();
	context.closePath();

}


turtle.prototype.f = function(){
	this.pos.x += this.unit * this.dir.x;
	this.pos.y += this.unit * this.dir.y;
	this.pos.z += this.unit * this.dir.z;
}

turtle.prototype.F = function(){
	var endLocation = {x: this.unit * this.dir.x + this.pos.x, y: this.unit * this.dir.y + this.pos.y, z: this.unit * this.dir.z + this.pos.z};

	this.pushVert(endLocation.x, endLocation.y, endLocation.z);

	this.pos.x += this.unit * this.dir.x;
	this.pos.y += this.unit * this.dir.y;
	this.pos.z += this.unit * this.dir.z;
}

turtle.prototype.plus = function(){	
	var intoRad = (180 - this.angle) * this.rad;

	var xNew = -(this.dir.x * Math.cos(intoRad) - this.dir.y * Math.sin(intoRad));
	var yNew = -(this.dir.x * Math.sin(intoRad) + this.dir.y * Math.cos(intoRad));

	this.dir.x = xNew;
	this.dir.y = yNew;

	var normalDir = this.normalize(this.dir.x, this.dir.y);

	this.dir.x = normalDir.x;
	this.dir.y = normalDir.y;
}


turtle.prototype.minus = function(){	
	var intoRad = this.angle * this.rad;

	var xNew = (this.dir.x * Math.cos(intoRad) - this.dir.y * Math.sin(intoRad));
	var yNew= (this.dir.x * Math.sin(intoRad) + this.dir.y * Math.cos(intoRad));

	this.dir.x = xNew;
	this.dir.y = yNew;

	var normalDir = this.normalize(this.dir.x, this.dir.y);

	this.dir.x = normalDir.x;
	this.dir.y = normalDir.y;
}



turtle.prototype.normalize = function(x,y){

	var vecNorm = {x: x, y: y};

	var mag = Math.sqrt((x*x) + (y*y));
	vecNorm.x /= mag;
	vecNorm.y /= mag;

	return vecNorm;

}

turtle.prototype.pushVert = function(x,y,z){
	var tempVertices = new Float32Array(vertices.length + 3);

	for (var i = 0; i < vertices.length; i++) {
		tempVertices[i] = vertices[i];
	};

	var length = vertices.length;

	tempVertices[length] = x;
	tempVertices[length + 1] = y;
	tempVertices[length + 2] = z;

	vertices = tempVertices;
}