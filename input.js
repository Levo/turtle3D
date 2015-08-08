
var roll = 0;
var oldRoll = 0;

var pitchRoll = 0;
var oldPitch = 0;

document.addEventListener("keypress", function(event){
		if(event.keyCode ===  119){

	    	eye.e.x += view.e.x*1.0;
		    eye.e.y += view.e.y*1.0;
		    eye.e.z += view.e.z*1.0;

		}

		if(event.keyCode === 115){

	    	eye.e.x -= view.e.x*1.0;
		    eye.e.y -= view.e.y*1.0;
		    eye.e.z -= view.e.z*1.0;


		}

		if(event.keyCode === 100){
			
			oldRoll = roll;
			roll += 5.0;
			nUp.arbRotate(roll - oldRoll, view);
			r.arbRotate(roll - oldRoll, view);


		}

		if(event.keyCode === 97){

			oldRoll = roll;
			roll += 5.0;

			nUp.arbRotate(-roll + oldRoll, view);
			r.arbRotate(-roll + oldRoll, view);
		}

},false);

document.onkeydown = function(event) {
	if(event.keyCode === 38){
		oldPitch = pitchRoll;
		pitchRoll += 5.0;

		view.arbRotate(pitchRoll - oldPitch, r);
		nUp.arbRotate(pitchRoll - oldPitch, r);
	}


	if(event.keyCode === 40){
		oldPitch = pitchRoll;
		pitchRoll += 5.0;

		view.arbRotate(-pitchRoll + oldPitch, r);
		nUp.arbRotate(-pitchRoll + oldPitch, r);
	}

};