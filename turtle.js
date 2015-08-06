function turtle(x,y,z){
	this.pos = {x: x, y: y, z: z};
	this.dir = {x: 0, y: 0, z: 1};
	this.up  = {x: 0, y: 1, z: 0};
	this.r  =  {x:-1, y: 0, z: 0};
	this.unit = 1.0;
	this.angle = 90;
	this.rad = Math.PI/180;
}


turtle.prototype.debug = function(){

}

/*
	Moves the turtle one unit without drawing a line
*/
turtle.prototype.f = function(){
	// TODO
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

	var c = Math.cos(theta*this.rad);
	var s = Math.sin(theta*this.rad);

	var oneMc = (1-c);

    var xx  =  v.x * v.x;
    var xy  =  v.x * v.y;
    var z   =  v.z;
    var xz  =  v.x * v.z;
    var y   =  v.y;
    var yx  =  xy;
    var yy  =  v.y * v.y;
    var yz  =  v.y * v.z;
    var x   =  v.x;
    var zx  =  xz;
    var zy  =  yz;
    var zz  =  v.z * v.z;

    var A = c + xx * oneMc;
    var B = yx * oneMc + z * s;
    var C = zx * oneMc - y * s;
    var D = xy * oneMc - z * s;
    var E = c + yy * oneMc;
    var F = zy * oneMc + x * s;
    var G = xz * oneMc + y * s;
    var H = yz * oneMc - x * s;
    var I = c + zz * oneMc;

    var oX = out.x;
    var oY = out.y;
    var oZ = out.z;

	out.x = A * oX + D * oY + G * oZ; 
	out.y = B * oX + E * oY + H * oZ; 
	out.z = C * oX + F * oY + I * oZ;

	this.out = this.normalize(out);
}

/*
	yaw left
*/
turtle.prototype.plus = function(){
	this.arbRotate(this.angle, this.up, this.dir);
	this.arbRotate(this.angle, this.up, this.r);
}

/* 
	yaw right	
*/
turtle.prototype.minus = function(){
	this.arbRotate(-this.angle, this.up, this.dir);
	this.arbRotate(-this.angle, this.up, this.r);
}

/*
	pitch up 
*/
turtle.prototype.upArrow = function(){
	this.arbRotate(this.angle, this.r, this.dir);
	this.arbRotate(this.angle, this.r, this.up);
}

/*
	pitch down
*/
turtle.prototype.ampersand = function(){
	this.arbRotate(-this.angle, this.r, this.dir);
	this.arbRotate(-this.angle, this.r, this.up);
}

/*
	roll left
*/
turtle.prototype.backslash = function(){
	this.arbRotate(-this.angle, this.dir, this.up);
	this.arbRotate(-this.angle, this.dir, this.r);
}

/*
	roll right
*/
turtle.prototype.forwardslash = function(){
	this.arbRotate(this.angle, this.dir, this.up);
	this.arbRotate(this.angle, this.dir, this.r);
}





