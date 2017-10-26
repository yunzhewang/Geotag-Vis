// Operations conducted on the map, d3 + Leaflet
// Leaflet 编程：尽量用leaflet本身完成需求，将d3代码减少

function map_d3(){

	var map = new L.map('map');

	// svg added to 'overlay' pane for reposition
	var svg = d3.select(map.getPanes().overlayPane).append("svg"),
	    g = svg.append("g").attr("class", "leaflet-zoom-hide");

	// load map
	this.init = function(){

		// map.setView([37.8, -96], 4);
		map.setView([42.35, -71.08], 13);

		// multiple tileLayers can be stacked
		L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
		   attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
		}).addTo(map);

	}


	// d3 drawing, svg dynamically change, no initial dimension
	this.draw_path = function(filename){

		// load data
		d3.json(filename, function(collection) {	

			var geo_paths = g.selectAll('path').data(collection.features).enter()
						 	 .append('path');

			// receive 'hash' methods
			// d3.geo.path() has default projection method: alberts, here, indicate a new one
			var transform = d3.geo.transform({point:projectPoint}),
				path = d3.geo.path().projection(transform);

		    // on zooming in/out
		    map.on('viewreset', reset);
		    reset();

		    function reset(){
		    	// path.bounds(obj) is a method, not the 'path' above
				bounds = path.bounds(collection);
				var topLeft = bounds[0], bottomRight = bounds[1];

				// dynamically change svg size
				svg.attr("width", bottomRight[0] - topLeft[0])
				   .attr("height", bottomRight[1] - topLeft[1])
				   .style("left", topLeft[0] + "px")
				   .style("top", topLeft[1] + "px");

				// show the complete path
				g.attr('transform', 'translate('+ -topLeft[0] + "," + -topLeft[1] + ")");

				// add data for path
				geo_paths.attr('d', path)
					     .attr('stroke', 'steelblue')
					     .attr('stroke-width', 3)
					     .style('fill', 'none');
			}

		});

	}


	// use Leaflet to implement a D3 geometric transformation
	// access the wrapped stream in a function: this.stream
	function projectPoint(x, y) {
		// L.LatLng: change data format
		// map.latLngToLayerPoint: change point coordinates
		var point = map.latLngToLayerPoint(new L.LatLng(y, x));
		this.stream.point(point.x, point.y);
	}


    //-----------------------  D3   -----------------------//
	this.draw_circle = function(filename){

		d3.json(filename, function(collection) {

			collection.objects.forEach(function(d) {
				d.LatLng = new L.LatLng(d.circle.coordinates[0],
										d.circle.coordinates[1])
			});

			
			var circles = g.selectAll('circle').data(collection.objects).enter()
						   .append('circle').attr("stroke", "black")
						   .attr('class', 'my-circle') 
						   .attr("opacity", .6).attr("fill", "red");

			map.on('viewreset', reset);
		    reset();

		    function reset(){
		    	// circles are invisible, because the size of svg and g are incorrect
		    	var bounds = document.getElementById("map").getBoundingClientRect();
		    	// console.log( map.latLngToLayerPoint(map.getBounds()['_southWest']) ) ;
		    	// console.log( map.latLngToLayerPoint(map.getBounds()['_northEast']) ) ;

				svg.attr("width", bounds.width)
				   .attr("height", bounds.height)
				   .style("left", bounds.left+'px')
				   .style("top", bounds.top+'px');

				g.attr('transform', 'translate('+ -bounds.left + "," + -bounds.top + ")");

				var zoom_level =  map.getZoom();

		    	circles.attr("transform", function(d){ 
					return "translate("+ 
						map.latLngToLayerPoint(d.LatLng).x +","+ 
						map.latLngToLayerPoint(d.LatLng).y +")";
				}).attr("r", 2*zoom_level);    // update circle size
		    }	    
		});			
	}


}






