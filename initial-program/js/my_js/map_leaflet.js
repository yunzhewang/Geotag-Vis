// use leaflet inherent methods to draw point, polygon

function map_leaflet(){

	var map = new L.map('map');
	var self = this;
	// var geojson = L.getJSON().addTo(map);

	this.get_map = function(){
		return map;
	}

	// load map
	this.init = function(){

		// map.setView([42.35, -71.08], 13);
		map.setView([40.7128, -74.0059], 4);  

		var CartoDB_Positron = L.tileLayer('http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png', {
			attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="http://cartodb.com/attributions">CartoDB</a>',
			subdomains: 'abcd'
			// maxZoom: 19
		}).addTo(map);

		// // multiple tileLayers can be stacked
		// var Stamen_TonerLite = L.tileLayer('http://stamen-tiles-{s}.a.ssl.fastly.net/toner-lite/{z}/{x}/{y}.{ext}', {
		// 	attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
		// 	subdomains: 'abcd',
		// 	// minZoom: 0,
		// 	// maxZoom: 20,
		// 	ext: 'png'
		// }).addTo(map);

		// functions need to run at the begining
		add_controller();
		add_legend();
		add_button();

	}

	

	this.draw_circle = function(filename, flag){    // 'flag' for getting color
		
		$.getJSON(filename, function(data){
			// add marker
			// L.geoJson(data, {pointToLayer: function(feature, latlng){
			// 	return L.marker(latlng);
			// }}).addTo(map);

			// add circle
			// OPTIONS: style, pointToLayer (exclusively for point, changing marker), onEachFeature, filter (visibility, T/F)
		
			// create location dictionary
			var coord_arr = data.features.map(function(d){return d.geometry.coordinates});
			var spot_dict = Util.spot_dict(coord_arr);

			console.log(Object.keys(spot_dict).length);

			var last_index = data.features.length-1;
			var diff_days = Util.diff_days(data.features[0].properties.time, data.features[last_index].properties.time);

			L.geoJson(data, {pointToLayer: function(feature, latlng){
				// more posts, bigger circle
				var key = latlng.lng.toString()+','+latlng.lat.toString();
				var count = spot_dict[key];
				var radius = 300 * count;

				var time = feature.properties.time;
				var tmp_diff = Util.diff_days(data.features[0].properties.time, time);
				var temporal_color = Util.temporal_color_case(tmp_diff, diff_days, flag);

				var circle = L.circle(latlng, {radius: radius, color: temporal_color, /// OR, Util.color_case(flag), 
											   fillOpacity: 0.8});

				circle.on("click", function(e){
					var clickedCircle = e.target;
					var detail = "Time: "+feature.properties.time;
					var popup = L.popup();
					popup.setLatLng(latlng).setContent(detail).openOn(map);
				});

				return circle;

			}}).addTo(map);

		})

	}

	this.draw_line = function(filename, flag){   // 'flag' for getting color
		$.getJSON(filename, function(data){

			var pnt_list = data.features.map(function(d){
				var pnt_tmp = d.geometry.coordinates;
				return {lng:pnt_tmp[0], lat:pnt_tmp[1]};
			});

			var firstpolyline = new L.Polyline(pnt_list, {
			    color: Util.color_case(flag),
			    weight: 1,
			    opacity: 0.5,
			    smoothFactor: 1
			}).addTo(map);


		});
	}


	function add_button(){
		// click functions of all buttons
		var circle_file = "../data/geojson/day_in_geojson/2012-12-01.geojson";
		
		function circle_click(){		
	    	self.draw_circle(circle_file);
		}

		function heatmap_click(){
	    	self.heatmap(circle_file);
		}

		function pie_click(){
			// get the city selected in drop-down menu
	    	var selected_city = $('.drop-down-menu').find('option:selected').text();
        	// show pie chart (div) of corresponding city
        	if(selected_city=="New York"){
        		// set absolute position of controller
        		var pie_controller = L.control();  //{position:'topright'}

				pie_controller.onAdd = function(map){
					this._div = L.DomUtil.create('div', 'pie-controller');
					return this._div;
				}
				pie_controller.addTo(map);

				draw_pie.init('pie-controller');
        	}
		}

		function hist_click(){
			// get the city selected in drop-down menu
	    	var selected_city = $('.drop-down-menu').find('option:selected').text();

			if(selected_city=="New York"){
        		// set absolute position of controller
        		var hist_controller = L.control(); 

				hist_controller.onAdd = function(map){
					this._div = L.DomUtil.create('div', 'hist-controller');
					this._div.id = 'my_hist';
					return this._div;
				}
				hist_controller.addTo(map);

				draw_hist.init();
        	}
		}

		function cloud_click(){
			// get the city selected in drop-down menu
	    	var selected_city = $('.drop-down-menu').find('option:selected').text();
	    	
        	if(selected_city=="New York"){
        		// set absolute position of controller
        		var cloud_controller = L.control(); 

				cloud_controller.onAdd = function(map){
					this._div = L.DomUtil.create('div', 'cloud-controller');
					return this._div;
				}
				cloud_controller.addTo(map);

				draw_cloud.init('cloud-controller');
        	}
		}

		// function trans_click(){
		// 	console.log("trans!");
		// }


		// first group of buttons 
		var arg1 = [{title: 'show circles', icon: '<i class="fa fa-map-marker" style="font-size:24px"></i>', onClick: circle_click},
		            {title: 'show heatmap', icon: '<i class="fa fa-photo" style="font-size:22px;color:#ff8080"></i>', onClick: heatmap_click}];
		          
		leaflet_button.add(arg1, map);

		// second group of buttons 	
		var arg2 = [{title: 'show pie', icon: '<i class="fa fa-pie-chart" style="font-size:24px"></i>', onClick: pie_click},
					{title: 'show word cloud', icon: '<i class="fa fa-cloud" style="font-size:24px"></i>', onClick: cloud_click},
		            {title: 'show histogram', icon: '<i class="fa fa-bar-chart" style="font-size:24px"></i>', onClick: hist_click}];

		leaflet_button.add(arg2, map);

		// third group of buttons 
		var arg3 = [{title: 'show food', icon: '<i class="material-icons" style="font-size:24px">free_breakfast</i>', onClick: function(){}},
					{title: 'show transportation', icon: '<i class="fa fa-bus" style="font-size:24px"></i>', onClick: function(){}},
					{title: 'show entertainment', icon: '<i class="material-icons" style="font-size:24px">insert_emoticon</i>', onClick: function(){}},
		            {title: 'show education', icon: '<i class="material-icons" style="font-size:24px">school</i>', onClick: function(){}}];

		leaflet_button.add(arg3, map);

	}

	// draw polygon on the map
	// make the style globally available so that the mouse-out event works
	function polygon_style(feature){
		var fillColor, density = feature.properties.density;
				    if ( density > 80 ) fillColor = "#006837";
				    else if ( density > 40 ) fillColor = "#31a354";
				    else if ( density > 20 ) fillColor = "#78c679";
				    else if ( density > 10 ) fillColor = "#c2e699";
				    else if ( density > 0 ) fillColor = "#ffffcc";
				    else fillColor = "#f7f7f7"; 
				    return { color: "#999", weight: 1, fillColor: fillColor, fillOpacity: .6 };			    
	}

	this.draw_polygon = function(filename){
		// draw concave hulls 
		$.getJSON(filename, function(data){
			
			var pointset = data.features.map(function(d){
				var pos = d.geometry.coordinates.reverse();    // original order: lng, lat
				return pos;
			});

			// connect to flask
			$.ajax({
	    		url: 'http://0.0.0.0:6699/clustering',
                data:{
                	points: JSON.stringify(pointset) 
                },
                dataType: 'JSON',
                type: 'GET',
                success: function(data){
                	console.log(data);
                	var clusters = data.result;
                	var colors = ['#f46d43', '#fdae61', '#a6d96a','#66bd63'];  //  200, 400, 600, 800

					clusters.forEach(function(pointset, i) {
							
						pointset = pointset.map(function(d){ return {lng: d[0], lat: d[1]};});   /////////////  NOTE: format !!!
					    var hullPts = pointset.map(map.latLngToContainerPoint.bind(map));
						hullPts = hull(hullPts, 20, ['.x', '.y']);
						hullPts = hullPts.map(function(pt) {
						    return map.containerPointToLatLng(L.point(pt.x, pt.y));
						});
						// console.log(pointset);	
						// console.log(hullPts);	
						var size = pointset.length, color = undefined;
						switch(true) {
						    case size<200:
						        color = colors[0];
						        break;
						    case size<400:
						        color = colors[1];
						        break;
						    case size<600:
						        color = colors[2];
						        break;
						    case size<800:
						        color = colors[3];
						        break;
						    default:
						    	console.log(size);
						        color = '#d53e4f';
						}

						var poly = L.polygon(hullPts, {weight: 2, color: color}).addTo(map);

						poly.on('click', function(e){
							highlightFeature(e);
							$('#cluster_info').html('<h4>Region Details</h4>'+"Cluster #12"+ '<br/>'+'Spots: 860');
							map.fitBounds(e.target.getBounds());
						});
						// }).on('mouseover', function(e){
						// 	highlightFeature(e);
						// }).on('mouseout', function(e){
						// 	resetHighligh(e, color);
						// });

						// L.geoJson(hullPts, {style: {weight: 2, color: colors[i%4]}, onEachFeature:layer_event}).addTo(map);
					});

                }
            });

            function highlightFeature(e){
			    var layer = e.target;

			    layer.setStyle({
			        weight: 5,
			        dashArray: '',
			        fillOpacity: 0.7
			    });

			    if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
			        layer.bringToFront();
			    }

			    // controller.update(layer.feature.properties);
			}

			// mouse out
			function resetHighligh(e, color){
				console.log(color);
				var layer = e.target;
				// layer.setStyle(polygon_style(feature));
				layer.setStyle({
			        weight: 2,
			        color: color
			    });

				// controller.update();
			}
			// var geojson = L.geoJson(data, {style: polygon_style, onEachFeature:layer_event}).addTo(map);

		})

	}


	// cluster markers automatically
	// VERSION PROBLEM !!!!!     DISABLED     Re-download (npm) from github
	this.marker_cluster = function(filename){
		$.getJSON(filename, function(data){

			var rodents = L.geoJson(data, { pointToLayer: function(feature,latlng){
			    var marker = L.marker(latlng);
			    marker.bindPopup(feature.properties.Location + '<br/>' + feature.properties.OPEN_DT);
			    return marker;
			  }
			});

			var clusters = L.markerClusterGroup();
			clusters.addLayer(rodents);
			map.addLayer(clusters); 

		})
	}


	// add heatmap to map
	this.heatmap = function(filename){
		$.getJSON(filename, function(data){

			var locations = data.features.map(function(rat){
				var pos = rat.geometry.coordinates;   // format: (lng, lat) 
				var count = Math.floor(Math.random() * 4) + 1			
				var location = {lng:pos[0], lat:pos[1], count:count};
				return location;
			});
			// console.log(locations);

			var heat_data = {max:500, data: locations};  // change 'max' will change the heat center of map
		
			var cfg = {
				// radius should be small ONLY if scaleRadius is true (or small radius is intended)
				// if scaleRadius is false it will be the constant radius used in pixels
				"radius": 2,
				"maxOpacity": .8, 
				// scales the radius based on map zoom
				"scaleRadius": true, 
				"useLocalExtrema": false,
				latField: 'lat',
				lngField: 'lng',
				valueField: 'count'
			};

			// var heat = L.heatLayer(locations, {radius: 35});
			// map.addLayer(heat);

			var heatmapLayer = new HeatmapOverlay(cfg);
			heatmapLayer.setData(heat_data);
			map.addLayer(heatmapLayer);

		});
	}


	// handling map events
	this.map_event = function(){
		var popup = L.popup({maxWidth: "auto"});
		map.on('click', map_click);

		function map_click(e){
			var latlng = e.latlng;
			// popup.setLatLng(latlng).setContent("You clicked the map at " + e.latlng.toString()).openOn(map);
			var icon_url = "../html/popup_img.jpg";
			popup.setLatLng(latlng).setContent( "<img src=" + icon_url + ">").openOn(map);
		}
	}


	// handling layer event
	function layer_event(feature, layer){

		layer.on({mouseover: highlightFeature,
			      mouseout: resetHighligh,
				  click: zoomToFeature});

		// hover over
		function highlightFeature(e){
		    var layer = e.target;

		    layer.setStyle({
		        weight: 5,
		        color: '#666',
		        dashArray: '',
		        fillOpacity: 0.7
		    });

		    if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
		        layer.bringToFront();
		    }

		    controller.update(layer.feature.properties);
		}

		// mouse out
		function resetHighligh(e){
			var layer = e.target;
			layer.setStyle(polygon_style(feature));

			controller.update();
		}

		// zoom to fit bounds
		function zoomToFeature(e) {
		    map.fitBounds(e.target.getBounds());
		}

	}



	// add custom control to the map
	function add_controller(){
		var controller = L.control({position:'topright'});

		controller.onAdd = function(map){
			// 'this' refers to 'controller'
			this._div = L.DomUtil.create('div', 'controller');
			this._div.id = "cluster_info";
			this.update();
			return this._div;

		}

		controller.update = function(property){   // property: in geojson data, properties
			this._div.innerHTML = '<h4> Region Information </h4>' +  (property ?
	        '<b>' + property.name + '</b><br />' + property.density + ' people / mi<sup>2</sup>'
	        : 'Click a Region of Interest');
		}

		controller.addTo(map);


		// add drop-down menu
		var drop_down_controller = L.control({position:'topright'});

		drop_down_controller.onAdd = function(map){
			var div = L.DomUtil.create('div', 'drop-down-menu');
			div.innerHTML = '<select><option>Please choose city</option><option>New York</option><option>Los Angeles</option></select>';
			div.firstChild.onmousedown = div.firstChild.ondblclick = L.DomEvent.stopPropagation;

			// could also use addlistener method of leaflet
			// L.DomEvent.addListener(div, 'click', function () { MapShowCommand(); });
			div.onchange = function(e){
				var menu = e.target;
				var item = menu.options[menu.selectedIndex].innerHTML;
				// if NY selected, relocate
				if(item == "New York"){
					map.setView([40.7128, -74.0059], 6); 
				}
				else if(item == "Los Angeles"){
					map.setView([34.0522, -118.2437], 10); 
				}
			};

			return div;
		}
		// var drop_down_controller = L.control.drop_down('drop-down-menu');
		drop_down_controller.addTo(map);

	}
	

	// create legend with custom control, use 'this._div' in the following also works
	function add_legend(){
		var color_legend = L.control({position:'bottomright'});

		color_legend.onAdd = function(map){

			this._div = L.DomUtil.create('div', 'color-legend');
			// var div = L.DomUtil.create('div', 'color-legend');
			// if static, no need for update
			// var grades = [0, 10, 20, 50, 100, 200, 500, 1000], labels = [];
			var grades = [0, 200, 400, 600, 800], labels = [];
			for (var i = 0; i < grades.length; i++) {
		        this._div.innerHTML += '<i style="background:' + getColor(grades[i] + 1) + '"></i> ' +
	            grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
		    }

		    return this._div;
		    // return div;

		}

		color_legend.addTo(map);

		['#f46d43', '#fdae61', '#a6d96a','#66bd63'];
		function getColor(d) {
		    return d < 200 ? '#f46d43' :
		           d < 400 ? '#fdae61' :
		           d < 600 ? '#a6d96a' :
		           d < 800 ? '#66bd63' :
		                      '#d5314f';
		}
	}
	

	// group layers, a layer is an element on the map, can be a marker, polyline, polygon, etc.
	// var layer1 = L.marker([30, 50]).bindpopup('hello');
	// var markers = L.layerGroup([layer1, layer2, layer3, ...]);



	// add layers' control, map object can contain multi key:value pairs
	// at instantiation, onlyn one base layer should be added, but all of them should be in the base layer object
	// L.control.layers(baseMaps, overlayMaps).addTo(map);
	// var baseMaps = {
	//     "Grayscale": grayscale,
	//     "Streets": streets
	// };



	// change the order of map panes
	// map.createPane('labels');
	// map.getPane('labels').style.zIndex = 650;   // check manual, zIndex is the depth (order of panes)
	// map.getPane('labels').style.pointerEvents = 'none';   // click and touch capturing problems

	// add layer to the pane
	// var positronLabels = L.tileLayer('http://{s}.basemaps.cartocdn.com/light_only_labels/{z}/{x}/{y}.png', {
	//         attribution: '©OpenStreetMap, ©CartoDB',
	//         pane: 'labels'   ///////////////////
	// }).addTo(map);

	// add interaction to layers
	// geojson.eachLayer(function (layer) {
	//     layer.bindPopup(layer.feature.properties.name);
	// });


	/////////////////////////////////////////////////////////
	// Leaflet uses [lat, lng] instead of [lng, lat]
    /////////////////////////////////////////////////////////

}