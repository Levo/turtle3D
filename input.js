document.addEventListener("keypress", function(event){
		console.log(event.keyCode);
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
	    	eye.e.x += r.e.x*1.0;
		    eye.e.y += r.e.y*1.0;
		    eye.e.z += r.e.z*1.0;
		}


		if(event.keyCode === 97){
	    	eye.e.x -= r.e.x*1.0;
		    eye.e.y -= r.e.y*1.0;
		    eye.e.z -= r.e.z*1.0;
		}

},false);