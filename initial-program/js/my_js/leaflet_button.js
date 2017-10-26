//
// operations of buttons on the leaflet map

function leaflet_button(){
	// create one button or multiple buttons
	this.add = function(arg, map){
		// create & add one button
		if(arg.length==1){
			var parameter = arg[0];
			var button = create_btn(parameter);
			button.addTo(map);
		}
		// create & add multiple buttons
		else if (arg.length>1){
			var btn_num = arg.length;
			var buttons = [];

			for(var i=0; i<btn_num; i++){
				var pram_tmp = arg[i];
				var btn_tmp = create_btn(pram_tmp);
				buttons.push(btn_tmp);
			}

			L.easyBar(buttons).addTo(map);
		}
	}

	// create a button
	function create_btn(parameter){
		var status = {states:[{
								onClick: parameter.onClick,
								title: parameter.title,
								icon: parameter.icon
							}]
					 };

		return L.easyButton(status);
	}

}

var leaflet_button = new leaflet_button();
