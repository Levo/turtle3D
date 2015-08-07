function reader(){

	/*
		Angle for the turtle to use
	*/
	this.angle = 25.7;

	/*
		Possble symbols to be used with the productions and axiom
	*/
	this.symbols = ["F","f","+","-","[","]","^","&","\\","/","|"];

	/*
		a set of production stream
			F -> FF+F&F-F
			B -> BB+F+B++B
			...
	*/
	this.productions = {
		// "A":"-BF+AFA+FB-",
		// "B":"+AF-BFB-FA+",
		"X":"F[+X][-X]FX",
		"F":"FF"
		// "X":" ^\\XF^\\XFX-F^//XFX&F+//XFX-F/X-/ ",
	};

	/*
		Starting equation
			FB ...
	*/
	this.axiom = "X";

	/*
		A stack structure to keep track of the current state of the turtle
	*/
	this.stack = [];


	/*
		The number of iterations for the productions
	*/
	this.iterations = 7;

	/*
		Variables for axiom and production
			Only add if you want them to be considered as F ... which means move forward
	*/
	this.variables = {
		"F":true,

	};

	/*
		Temp production used in iterations of the production
	*/
	this.tempProduction = "";

	/*
		The stream of commands after iterations
		The turtle will perform these commands
	*/
	this.finalProduction = "";

	/*
		Symbols to ignore in production
			"G : true"...
				If FFGFF, it would only read the F
	*/
	this.ignoreSymbols = {
		"A":true,
		"B":true,	
		"C":true,
		"D":true,
		"X":true,
		"Y":true
	};


}

reader.prototype.decode = function(){

	/*
		If the iterations is equal to zero
			Just perform the axiom
	*/
	if(this.iterations === 0){
		this.finalProduction = this.axiom;
	}else{
		this.tempProduction = this.axiom;

		for (var i = 0; i < this.iterations; i++) {

			for (var j = 0; j < this.tempProduction.length; j++) {
				if(this.productions[this.tempProduction[j]]){
					for (var w = 0; w < this.productions[this.tempProduction[j]].length; w++) {
					    this.finalProduction = this.finalProduction + this.productions[this.tempProduction[j]][w];
					};
				}else{
					this.finalProduction = this.finalProduction + this.tempProduction[j];
				}

			};

			this.tempProduction = this.finalProduction;
			this.finalProduction = "";
		};

	}

	this.finalProduction = this.tempProduction;

	/*
		Make the turtle move!
	*/
	this.draw();

}

/*
	Calls all the functions to make the turtle walk the pattern
*/
reader.prototype.draw = function(){
	/*
		current action to peform
	*/
	var c = null;

	/*
		Go through the whole production stream and call each function
	*/
	for (var i = 0; i < this.finalProduction.length; i++) {

		c = this.finalProduction[i];

		if(!this.ignoreSymbols[c]){

			if(this.variables[c] === true){
				turtle.F();
			}else if(c === "f"){
				turtle.f();
			}else if(c === "+"){
				turtle.plus();
			}else if(c === "-"){
				turtle.minus();
			}else if(c === "["){
				var temp = {
					pos: {
						x: turtle.pos.x,
						y: turtle.pos.y,
						z: turtle.pos.z
					},
					dir: {
						x: turtle.dir.x,
						y: turtle.dir.y,
						z: turtle.dir.z
					},
					up: {
						x: turtle.up.x,
						y: turtle.up.y,
						z: turtle.up.z
					},
					r: {
						x: turtle.r.x,
						y: turtle.r.y,
						z: turtle.r.z
					}
				};
				this.stack.push(temp);
				// turtle.plus();
			}else if(c === "]"){

				var temp = this.stack.pop();

				turtle.pos.x = temp.pos.x;
				turtle.pos.y = temp.pos.y;
				turtle.pos.z = temp.pos.z;

				turtle.dir.x = temp.dir.x;
				turtle.dir.y = temp.dir.y;
				turtle.dir.z = temp.dir.z;

				turtle.up.x = temp.up.x;
				turtle.up.y = temp.up.y;
				turtle.up.z = temp.up.z;

				turtle.r.x = temp.r.x;
				turtle.r.y = temp.r.y;
				turtle.r.z = temp.r.z;

				// turtle.minus();

			}else if(c === "^"){
				turtle.upArrow();
			}else if(c === "&"){
				turtle.ampersand();
			}else if(c === "\\"){
				turtle.backslash();
			}else if(c === "/"){
				turtle.forwardslash();
			}else if(c === "|"){
				turtle.verticalbar();
			}
		}

	};
}


