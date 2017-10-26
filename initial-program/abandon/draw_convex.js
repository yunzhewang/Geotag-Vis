// strict mode, 'bad syntax' will not be ignored
// e.g., undeclared variables raise errors
'use strict'

function draw_convex(){
	var vertices = [];     // a set of points [x, y] in the 2D space
	var hull_tag = '';

	this.init = function(points, tag){
		vertices = [];       //in case, the path cover all unconnected regions
		for(var i=0; i<points.length; i++ ){
			var point_x = points[i]['x'];
			var point_y = points[i]['y'];
			var tmp_point = [];
			tmp_point.push(point_x);
			tmp_point.push(point_y);
			vertices.push(tmp_point);
		}
		hull_tag = tag;
	}


	this.draw = function(container){
		var hull = container.append("path")
					  		.attr("class", hull_tag);

		//--------------------     SVG  PATH      --------------------//
		// attribute 'd' define the shape of the path, it contains a series of commands and parameters
		// 'M': Move the pen to a new location. No line is drawn;      
		// 'L': Draw a line from the current point to the point (x,y);
		// 'Z': A line is drawn from the last point to the first point drawn, no parameter;
		// capital letters: absolute positions;      lower case letters: relative positions;

		// calc convex hull of points
		var convex_data = d3.geom.hull(vertices);

		var lineFunction = d3.svg.line()
	                         .x(function(d) { return d[0]; })
	                         .y(function(d) { return d[1]; })
	                         .interpolate("cardinal-closed");

		hull.datum( d3.geom.hull(vertices) )
			.attr("d", lineFunction(convex_data) )
			.attr('stroke', 'steelblue')
			.attr('stroke-width', 2)
			.style('fill', 'none');
		
	}


}

