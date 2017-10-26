// draw_NY();

$('#Btn2').click(function(e){
	map.setView(new L.LatLng(40.737, -73.923), 9);
	d3.selectAll('.marker_points').remove();
	draw_NY();
});

var svg = d3.select(map.getPanes().overlayPane).append("svg");
var g = svg.append("g").attr("class", "leaflet-zoom-hide");

function draw_NY(){
	//console.log(11);
	draw_circles("./Data/points_data.json");
	//$('#Btn3').click( function(e){draw_convex("./Data/clusters_data.json");} );
	// draw_convex("./Data/clusters_data.json")

}



function draw_circles(filename){
	d3.json(filename, function(geoShape) {

		var transform = d3.geo.transform({point: projectPoint}),
            	path = d3.geo.path().projection(transform);
		function projectPoint(x, y) {
			var point = map.latLngToLayerPoint(new L.LatLng(y, x));
			this.stream.point(point.x, point.y);
		} 

		function check_arr(arr, ele){
			for(var i=0; i<arr.length; i++){
				if((ele[0]==arr[i]['geometry']['coordinates'][0]) && (ele[1]==arr[i]['geometry']['coordinates'][1])){
					return i;
				}
			}
			return -1;
		}


		///////////////////////////////////DDraw marker points/////////////////////////////////
		filtered_data = geoShape.features.filter(function(d){return d.properties=='C'});
		var color = d3.scale.category20();
		var markers = g.selectAll('circle')
					   .data(geoShape.features)
					   //.data(filtered_data)              
					   .enter().append('circle')
					   .attr('class', function(d){return d.properties;})
					   .attr('r', 3)
					   .attr("opacity", 0.8)
					   .style('fill', function(d){ 
	                  	    						if(d.properties == 'F'){return "#1f77b4";}  //"none";}
	                  	    						else if(d.properties == 'T'){return "#ff7f0e";}
	                  	    						else if(d.properties == 'C'){return "#2ca02c";}
	                  	    						else if(d.properties == 'R'){return "#d62728";}} );
		/////////////////////////////////////Add icons to points/////////////////////////////////
		var icon_size = 23;
		
   
	    var marker_icons = g.selectAll('.icon')
						    .data(geoShape.features)
						    //.data(filtered)
						    .enter().append("svg:image")
						    .attr('class', 'marker_icons')
	                  	    .attr("xlink:href", function(d){ 
	                  	    						if(d.properties == 'C'){return "edu_icon.png";}}
	                  	    						// else if(d.properties == 'T'){return "trans_icon.png";}
	                  	    						// else if(d.properties == 'R'){return "enter_icon.png";}
	                  	    						// else if(d.properties == 'C'){return "edu_icon.png";}} 
	                  	    						).attr('opacity',1)
	                  	    .attr("width", icon_size)
	                  	    .attr("height", icon_size);
	   

		map.on("viewreset", reset);
		reset();



		// fit the SVG element to leaflet's map layer
		function reset() {  

			bounds = path.bounds(geoShape);

			var topLeft = bounds[0],
				bottomRight = bounds[1];

			svg .attr("width", bottomRight[0] - topLeft[0]+120)
				.attr("height", bottomRight[1] - topLeft[1]+120)
				.style("left", topLeft[0]-50 + "px")
				.style("top", topLeft[1]-50 + "px");

			g .attr("transform", "translate(" + (-topLeft[0]+50) + "," 
			                                  + (-topLeft[1]+50) + ")");

			// all position-related settings should be in reset()
			///////////////////////////////////////Add circle positions////////////////////////////////
   			markers.attr('cx', function(d){ return applyLatLngToLayer(d).x; })
   				   .attr('cy', function(d){ return applyLatLngToLayer(d).y; });


   // 			$('#Btn1').click(function(e){
				
			// 	marker_icons.attr('x', function(d){ return applyLatLngToLayer(d).x-icon_size/2; })
   // 				   			.attr('y', function(d){ return applyLatLngToLayer(d).y-icon_size/2; });
			// });

		}
		
		function applyLatLngToLayer(d) {
	        var y = d.geometry.coordinates[1]
	        var x = d.geometry.coordinates[0]
	        return map.latLngToLayerPoint(new L.LatLng(y, x))
	    }

	})
}


function draw_convex(filename){

	d3.json(filename, function(geoShape){

		var transform = d3.geo.transform({point: projectPoint}),
            	path = d3.geo.path().projection(transform);
		function projectPoint(x, y) {
			var point = map.latLngToLayerPoint(new L.LatLng(y, x));
			this.stream.point(point.x, point.y);
		} 

		function check_arr(arr, ele){
			for(var i=0; i<arr.length; i++){
				if((ele[0]==arr[i]['geometry']['coordinates'][0]) && (ele[1]==arr[i]['geometry']['coordinates'][1])){
					return i;
				}
			}
			return -1;
		}


        //prepare input for hull method
		var vertices = [];  //store data for all clusters

		var filter_F1 = geoShape.features.filter(function(d){return d.properties=='F1';});
		var filter_F2 = geoShape.features.filter(function(d){return d.properties=='F2';});
		var filter_T1 = geoShape.features.filter(function(d){return d.properties=='T1';});
		var filter_T2 = geoShape.features.filter(function(d){return d.properties=='T2';});
		var filter_T3 = geoShape.features.filter(function(d){return d.properties=='T3';});
		var filter_C1 = geoShape.features.filter(function(d){return d.properties=='C1';});
		var filter_C2 = geoShape.features.filter(function(d){return d.properties=='C2';});
		var filter_C3 = geoShape.features.filter(function(d){return d.properties=='C3';});
		var filter_R1 = geoShape.features.filter(function(d){return d.properties=='R1';});
		var filter_R2 = geoShape.features.filter(function(d){return d.properties=='R2';});
		var filter_data = [filter_F1, filter_F2, filter_T1, filter_T2, filter_T3, filter_C1, filter_C2, filter_C3, filter_R1, filter_R2];
		for(var i=0; i<filter_data.length; i++){
			var tmp = [];
			for(var j=0; j<filter_data[i].length; j++){
				var x = filter_data[i][j]['geometry']['coordinates'][0];
				var y = filter_data[i][j]['geometry']['coordinates'][1];
				tmp.push([x, y]);
			}
			
			vertices.push(tmp);
		}

		//calculate hull border points
		var convex_F1 = d3.geom.hull(vertices[0]);   // Note the element order !!!!
		var convex_F2 = d3.geom.hull(vertices[1]);
		var convex_T1 = d3.geom.hull(vertices[2]);
		var convex_T2 = d3.geom.hull(vertices[3]);
		var convex_T3 = d3.geom.hull(vertices[4]);
		var convex_C1 = d3.geom.hull(vertices[5]);
		var convex_C2 = d3.geom.hull(vertices[6]);
		var convex_C3 = d3.geom.hull(vertices[7]);
		var convex_R1 = d3.geom.hull(vertices[8]);
		var convex_R2 = d3.geom.hull(vertices[9]);
		var convex_points = [convex_F1, convex_F2, convex_T1, convex_T2, convex_T3, convex_C1, convex_C2, convex_C3, convex_R1, convex_R2];
		var cluster_label = ['F1','F2', 'T1', 'T2', 'T3', 'C1', 'C2', 'C3', 'R1', 'R2'];

		//re-projecct vertices to json format

		//start
		var hull_json = [];
		for(var i=0; i<convex_points.length; i++){
			var tmp_hull = [];
			for(var j=0; j<convex_points[i].length; j++){
				var index = check_arr(geoShape.features, convex_points[i][j]);
				var pos = geoShape.features[index]['geometry']['coordinates'];
				var feature_obj = {"type":"Feature",  "geometry": { "type":"Point", "coordinates": [ pos[0], pos[1]]}, "properties":cluster_label[i]};
				tmp_hull.push(feature_obj);
			}
			tmp_hull.push(tmp_hull[0]);
			tmp_hull.push(tmp_hull[1]);
			hull_json.push(tmp_hull);
		}

		//console.log(hull_json);
		//create path
		var hull_path = [];
		var hull_class = ['convex-hull-f1', 'convex-hull-f2',
						  'convex-hull-t1', 'convex-hull-t2', 'convex-hull-t3',
						  'convex-hull-c1', 'convex-hull-c2', 'convex-hull-c3',
						  'convex-hull-r1', 'convex-hull-r2'];
		for(var i=0; i<convex_points.length; i++){
			var tmp_hull = g.selectAll('.'+ hull_class[i])
							.data([hull_json[i]]).enter()
							.append('path').attr('class', hull_class[i]).attr('opacity', 0.65);
			hull_path.push(tmp_hull);
		}

		//end

		

		var hull_line = d3.svg.line()
						  .interpolate('linear')
						  .x(function(d){ return applyLatLngToLayer(d).x; })
						  .y(function(d){ return applyLatLngToLayer(d).y; });
		

       

		map.on("viewreset", reset);
		reset();



		// fit the SVG element to leaflet's map layer
		function reset() {

			bounds = path.bounds(geoShape);

			var topLeft = bounds[0],
				bottomRight = bounds[1];

			svg .attr("width", bottomRight[0] - topLeft[0]+120)
				.attr("height", bottomRight[1] - topLeft[1]+120)
				.style("left", topLeft[0]-50 + "px")
				.style("top", topLeft[1]-50 + "px");

			g .attr("transform", "translate(" + (-topLeft[0]+50) + "," 
			                                  + (-topLeft[1]+50) + ")");

   			///////////////////////////////////////Add           path////////////////////////////////
   			

			for(var i=0; i<convex_points.length; i++){
				hull_path[i].attr('d', hull_line).on("click", function(d){
					var id = d[0].properties;
					var label, group, cluster_size;
					// change back the label between 'food' and 'traffic'
					if(id == 'F1'){label="Traffic", group=1, cluster_size=filter_data[0].length;}
					else if(id == 'F2'){label="Traffic", group=2, cluster_size=filter_data[1].length;}
					else if(id == 'T1'){label="Food", group=1, cluster_size=filter_data[2].length;}
					else if(id == 'T2'){label="Food", group=2, cluster_size=filter_data[3].length;}
					else if(id == 'T3'){label="Food", group=3, cluster_size=filter_data[4].length;}
					else if(id == 'C1'){label="Culture", group=1, cluster_size=filter_data[5].length;}
					else if(id == 'C2'){label="Culture", group=2, cluster_size=filter_data[6].length;}
					else if(id == 'C3'){label="Culture", group=3, cluster_size=filter_data[7].length;}
					else if(id == 'R1'){label="Recreation", group=1, cluster_size=filter_data[8].length;}
					else if(id == 'R2'){label="Recreation", group=2, cluster_size=filter_data[9].length;}
					
					alert(  "Class:"+label+'\n'+"Cluster#:"+ group+'\n'+"Size:"+ cluster_size);

					// show three modules;
					donut();
					wordcloud();
					histogram();
					drawPie();
				});

					
   			
			}

		}
		
		function applyLatLngToLayer(d) {
	        var y = d.geometry.coordinates[1]
	        var x = d.geometry.coordinates[0]
	        return map.latLngToLayerPoint(new L.LatLng(y, x))
	    }

	})
}

function clear_convex(){
	d3.select('.convex-hull-f1').remove();
	d3.select('.convex-hull-f2').remove();
	d3.select('.convex-hull-t1').remove();
	d3.select('.convex-hull-t2').remove();
	d3.select('.convex-hull-t3').remove();
	d3.select('.convex-hull-r1').remove();
	d3.select('.convex-hull-r2').remove();

}


function clear_convex_1(){
	d3.select('.convex-hull-f1').remove();
	d3.select('.convex-hull-f2').remove();
	d3.select('.convex-hull-c1').remove();
	d3.select('.convex-hull-c2').remove();
	d3.select('.convex-hull-c3').remove();
	d3.select('.convex-hull-r1').remove();
	d3.select('.convex-hull-r2').remove();

}