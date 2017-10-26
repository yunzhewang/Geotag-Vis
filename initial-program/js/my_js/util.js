//
// class of commonly used utils

function Util(){

	// return a dictionary of the count of distinct coordinate
	this.spot_dict = function(coord_arr){		
		var dict = {};
		for(var i=0; i<coord_arr.length; i++){
			var coord_str = coord_arr[i][0].toString()+','+coord_arr[i][1].toString();
			if( coord_str in dict){
			    dict[coord_str]++;
			}
			else
				dict[coord_str]=1;
		}
		
		// check if all spot appear only once
		var keys = Object.keys(dict);
		var values = [];
		var flag = true;  // all once
		keys.forEach(function(key){
		    var value = dict[key];
		    if(value != 1)
		    	flag = false;
		});
		// console.log("Appear Once", flag);

		return dict;

	}

	// color cases, flag to denote different types of circles/lines
	this.color_case = function(flag){
		var colors = ['#c51b7d', '#4d9221', '#2166ac','#b2182b'];
		switch (flag){
			case 0: return colors[0];		
			case 1: return colors[1];
			case 2: return colors[2];
			case 3: return colors[3];
		}
	}


	// temporal color cases, more recent, darker color
	// flag to differentiate users. Currently, two users
	this.temporal_color_case = function(tmp_diff, total_diff, flag){
		var rate = tmp_diff/total_diff;
		// blue based
		if(flag == 2){
			switch (true){
				case rate<=0.2: return '#cce6ff';		
				case rate<=0.4: return '#66b5ff';
				case rate<=0.6: return '#1a90ff';
				case rate<=0.8: return '#0069cc';
				case rate<=1: return '#001a33';
			}
		}
		// red based
		else if(flag == 3){
			switch (true){
				case rate<=0.2: return '#ffe6e6';		
				case rate<=0.4: return '#ffb3b3';
				case rate<=0.6: return '#ff6666';
				case rate<=0.8: return '#ff3333';
				case rate<=1: return '#e60000';
			}
		}
		
	}

	// calculate the number of days between two dates
	this.diff_days = function(date1, date2) {
		var year1 = date1.slice(0,4), year2 = date2.slice(0,4);  // hard coded
		var month1 = date1.slice(5,7), month2 = date2.slice(5,7);
		var day1 = date1.slice(8,10), day2 = date2.slice(8,10);

		var tmp_date1 = new Date(year1, month1, day1);
		var tmp_date2 = new Date(year2, month2, day2);

		var oneDay = 24*60*60*1000;
		var diffDays = Math.round(Math.abs((tmp_date1.getTime() - tmp_date2.getTime())/(oneDay)));

		return diffDays;
	}



}



var Util = new Util();