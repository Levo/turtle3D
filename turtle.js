function turtle(x,y,z){
	this.pos = {x: x, y: y, z: z};
	this.dir = {x: 0, y: 0, z: 1};
	this.up  = {x: 0, y: 1, z: 0};
	this.r  =  {x:-1, y: 0, z: 0};
	this.unit = 2.5;
	this.angle = 90;
	this.rad = Math.PI/180;
}


turtle.prototype.debug = function(){

}

/*
	Moves the turtle one unit without drawing a line
*/
turtle.prototype.f = function(){

	this.pos.x += this.unit * this.dir.x;
	this.pos.y += this.unit * this.dir.y;
	this.pos.z += this.unit * this.dir.z;

}
/*
	Moves the the turtle one unit with drawing a line
*/
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



turtle.prototype.normalize = function(x,y,z){

	var vecNorm = {x: x, y: y, z:z};

	var mag = Math.sqrt((x*x) + (y*y) + (z*z));
	vecNorm.x /= mag;
	vecNorm.y /= mag;
	vecNorm.z /= mag;

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


/*
	Rotate theta degrees
	v is the stationary axis to rotate around
	out will be rotated around v
*/
turtle.prototype.arbRotate = function(theta, v, out){


	v = this.normalize(v.x, v.y, v.z);

	var c = Math.cos(theta * this.rad);
	var s = Math.sin(theta * this.rad);


	var oneMc = (1-c);

	var xx = v.x * v.x;
	var xy = v.x * v.y;
	var z  = v.z;
	var xz = v.x * v.z;
	var y  = v.y;
	var yx = v.y * v.x;
	var yy = v.y * v.y;
	var yz = v.y * v.z;
	var x  = v.x;
	var zx = v.z * v.x;
	var zy = v.z * v.y;
	var zz = v.z * v.z;


	var A = c + xx * oneMc;
	var B = yx * oneMc + z * s;
	var C = zx * oneMc - y * s;
	var D = xy * oneMc - z * s;
	var E = c + yy * oneMc;
	var F = zy * oneMc + x * s;
	var G = xz * oneMc + y * s;
	var H = yz * oneMc - x * s;
	var I = c + zz * oneMc;




	out.x = A * out.x + D * out.y + G * out.z; 
	out.y = B * out.x + E * out.y + H * out.z; 
	out.z = C * out.x + F * out.y + I * out.z;

	this.out = this.normalize(out);
}