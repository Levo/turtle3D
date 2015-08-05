function Vector4 (X,Y,Z) {
	// Defaults to a vector.
	this.e = {x: X, y: Y, z: Z, w: 1.0};
}

Vector4.prototype.set = function(x,y,z,w) {

    this.e.x = x;
    this.e.y = y;
    this.e.z = z;

    if(w){
	    this.e.w = w;
    }else{
    	this.e.w = 1.0;
    }

}

Vector4.prototype.setUp = function(x,y,z){

	if((x + y + z) == 1){
		this.e.x = x;
		this.e.y = y;
		this.e.z = z;
	} 

}

Vector4.prototype.invert = function(){

	this.e.x = -this.e.x;
	this.e.y = -this.e.y;
	this.e.z = -this.e.z;

}

Vector4.prototype.normalize = function(){
	var magnitude = 1/(Math.sqrt( this.e.x * this.e.x + this.e.y * this.e.y + this.e.z * this.e.z) )
	
	this.e.x *= magnitude;
	this.e.y *= magnitude;
	this.e.z *= magnitude;
}

Vector4.prototype.vAdd = function(vec){

	this.e.x += vec.e.x;
	this.e.y += vec.e.y;
	this.e.z += vec.e.z;
}

Vector4.prototype.vSubtract = function(vec){

	this.e.x -= vec.e.x;
	this.e.y -= vec.e.y;
	this.e.z -= vec.e.z;
}

Vector4.prototype.scale = function(constant){
	
	this.e.x *= constant;
	this.e.y *= constant;
	this.e.z *= constant;
}

Vector4.prototype.add = function(constant){

	this.e.x += constant;
	this.e.y += constant;
	this.e.z += constant;
}

Vector4.prototype.subtract = function(constant){

	this.e.x -= constant;
	this.e.y -= constant;
	this.e.z -= constant;
}

Vector4.prototype.dot = function(vec){

	var xx = this.e.x * vec.e.x;
	var yy = this.e.y * vec.e.y;
	var zz = this.e.z * vec.e.z;

	var dotProduct = xx + yy + zz;
	return dotProduct;
}

Vector4.prototype.angle = function(vec){

	var vecNorm = vec.normalize();
	var thisNorm  = this.normalize();

	var norm = vecNorm * thisNorm;

	var dotProduct = this.dotProduct(vec);

	var dotNorm = dotProduct/norm;
	var angle = Math.acos(dotNorm) * 180 / Math.PI;

	return angle;
}

Vector4.prototype.toPoint = function(){
	this.e.w = 0.0;
}

Vector4.prototype.toVector = function(){
	this.e.w = 1.0;
}

Vector4.prototype.cross = function(vec1, vec2){

	this.e.x = vec1.e.y * vec2.e.z - vec1.e.z * vec2.e.y;
	this.e.y = vec1.e.z * vec2.e.x - vec1.e.x * vec2.e.z;
	this.e.z = vec1.e.x * vec2.e.y - vec1.e.y * vec2.e.x;
	this.normalize();
}

Vector4.prototype.xyRot = function(angle){
	var radian = Math.PI/180;

	var nX = this.e.x * Math.cos(angle * radian) - this.e.y * Math.sin(angle * radian);
	var nY = this.e.x * Math.sin(angle * radian) + this.e.y * Math.cos(angle * radian);

}