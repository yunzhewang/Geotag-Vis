// 
// draw stuff on the leaflet map with D3

function map_d3(map){

	var svg, g = undefined;

	this.init = function(){
		console.log(map);
		svg = d3.select(map.getPanes().overlayPane).append("svg"),
	    g = svg.append("g").attr("class", "leaflet-zoom-hide");
	}

	this.draw_path = function(filename){

		// load data, data must be in GeoJSON !!
		d3.json(filename, function(geoshape) {	

			////////////////     Alpha-related Definition     ////////////////
			// alpha: key to delaunay??
			var alpha = 50;
			var asq = alpha*alpha;

			// offset function: for point translation, why??
			var offset = function(arr, dx, dy){
				return arr.map(function(d){
					return [d[0]+dx, d[1]+dy];
				});
			};

			// square distance between points
			var dsq = function(x, y){
				var dx = x[0]-y[0], dy = x[1]-y[1];
				return dx*dx + dy*dy;
			};

			// KEY: calculate the delaunay mesh
			var points = geoshape.features.map(function(d){ return d.geometry.coordinates;});

			var mesh = d3.geom.delaunay(offset(points,0,0)).filter(function(t){
				return dsq(t[0],t[1]) < asq && dsq(t[0],t[2]) < asq && dsq(t[1],t[2]) < asq;
			});
			console.log(mesh);

			var geo_mesh = undefined;
			geo_mesh.type = geoshape.type;
			geo_mesh.features = [];
			for(var i=0; i<mesh.length; i++){
				var triangle = mesh[i];
				for(var j=0; j<3; j++){
					var pnt_tmp = triangle[j];
					var index_tmp = obj_arr_index(points, pnt_tmp);
					console.log(index_tmp);
					geo_mesh.features.push(geoshape.features[index_tmp]);

				}
			}
			////////////////     ////////////////     ////////////////


			////////////////        d3 geo path       ////////////////
			var geo_paths = g.selectAll('path').data(geoshape.features).enter()
						 	 .append('path');
			// receive 'hash' methods
			// d3.geo.path() has default projection method: alberts, here, indicate a new one
			var transform = d3.geo.transform({point:projectPoint}),
				path = d3.geo.path().projection(transform);

		    // on zooming in/out
		    map.on('viewreset', reset);
		    reset();

		    function reset(){
		    	console.log(11);
				bounds = path.bounds(geoshape);
				console.log(bounds);
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
				// geo_paths.attr('d', function(d) { return "M" + d.join("L") + "Z"; })
					     .attr('stroke', 'steelblue')
					     .attr('stroke-width', 3)
					     .style('fill', 'none');
			}
			////////////////     ////////////////     ////////////////

		});

	}


	// use Leaflet to implement a D3 geometric transformation
	// access the wrapped stream in a function: this.stream
	function projectPoint(x, y) {
		// L.LatLng: change data format
		// map.latLngToLayerPoint: change point coordinates
		// console.log(d3_map);
		var point = map.latLngToLayerPoint(new L.LatLng(y, x));
		this.stream.point(point.x, point.y);
	}

	function obj_arr_index(arr, obj){
		for(var k=0; k<arr.length; k++){
			if( (obj[0]==arr[k][0])&& (obj[1]==arr[k][1]) )
				return k;
		}
		return -1;
	}

}