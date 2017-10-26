function draw_cloud(){

    var color = d3.scale.category20();
    var svg, g = undefined;
    var trans_x = 110, trans_y = 135;
    var width = 400, height = 250;
    var cloud_w = 350, cloud_h = 350;
    var filename = "../../data/csv/word_frequency.csv";

    var frequency_list = [{"text":"food","size":40},{"text":"taste","size":15},{"text":"delicious","size":10}];

    this.init = function(container_class){  // string
        svg = d3.select('.'+container_class).append("svg")
                .attr("width", width).attr("height", height);
                // .attr("id", "wordcloud");

        g = svg.append("g")
               .attr("transform", "translate("+trans_x+","+trans_y+")")
               .attr("class", "wordcloud");

        d3.csv(filename, function(data){
            console.log(data);
            var cloud = d3.layout.cloud().size([cloud_w, cloud_h])
                      .words(data)
                      .rotate(0)
                      .fontSize(function(d) { return d.size*1.5; })
                      .on("end", draw)
                      .start();

        });
        
    }

    

    function draw(words) {

        // d3.select("#wordcloud").remove();      
         g.selectAll("text")
          .data(words)
          .enter().append("text")
          .style("font-size", function(d) { return d.size*1.5 + "px"; })
          .style("fill", function(d, i) { return color(i); })
          .attr("transform", function(d) {
              return "translate(" + [d.x+12, d.y] + ")rotate(" + d.rotate + ")";
          })
          .text(function(d) { return d.text; });
          // .on("click", function(d){ highlight_map(d.text);} );
    }



    // once the user click a word on the word cloud
    // points whose tag containing the word highlight
    function highlight_map(text){
        console.log(text);
        var svg = d3.select(map.getPanes().overlayPane).append("svg"),
            g = svg.append("g").attr("class", "leaflet-zoom-hide");
                
        d3.json("./Data/points_data.json", function(geoShape) {

            var transform = d3.geo.transform({point: projectPoint}),
                    path = d3.geo.path().projection(transform);
            function projectPoint(x, y) {
                var point = map.latLngToLayerPoint(new L.LatLng(y, x));
                this.stream.point(point.x, point.y);
            } 

            var icon_size = 13;
            var icon_data = geoShape.features.filter(function(d){return d.properties=='C';}).slice(1,100);
            console.log(icon_data.length);
            var marker_icons = g.selectAll('.icon')
                                .data(icon_data)
                                .enter().append("svg:image")
                                .attr('class', 'marker_icons')
                                .attr("xlink:href", "food_icon.png")
                                .attr("width", icon_size)
                                .attr("height", icon_size);       

            map.on("viewreset", reset);
            reset();

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
                    
                marker_icons.attr('x', function(d){ return applyLatLngToLayer(d).x-icon_size/2; })
                            .attr('y', function(d){ return applyLatLngToLayer(d).y-icon_size/2; });


            }
            
            function applyLatLngToLayer(d) {
                var y = d.geometry.coordinates[1]
                var x = d.geometry.coordinates[0]
                return map.latLngToLayerPoint(new L.LatLng(y, x))
            }

        })
    }

}

var draw_cloud = new draw_cloud();










// var frequency_list = [{"text":"food","size":40},{"text":"taste","size":15},{"text":"delicious","size":10}, {"text":"drink","size":30},{"text":"yummy","size":5},{"text":"fruit","size":26},{"text":"lunch","size":10},{"text":"coffee","size":38},{"text":"sandwich","size":20},{"text":"hotdog","size":3},{"text":"beer","size":8},
// {"text":"cake","size":12},
// {"text":"salt","size":3},
// {"text":"sugar","size":2},
// {"text":"candy","size":8},
// {"text":"chess","size":6},
// {"text":"grill","size":12},
// {"text":"barbecue","size":30},
// {"text":"diet","size":16},
// {"text":"meal","size":20},
// {"text":"breakfast","size":20},
// {"text":"healthy","size":10},
// {"text":"fat","size":3},
// {"text":"oil","size":2},
// {"text":"sweet","size":8},
// {"text":"hot","size":6},
// {"text":"spicy","size":2},



// {"text":"bake","size":3},
// {"text":"beef","size":7},
// {"text":"cream","size":5},
// {"text":"spicy","size":4},
// {"text":"eat","size":23},
// {"text":"ginger","size":12},
// {"text":"crispy","size":1},
// {"text":"cake","size":12},
// {"text":"brunch","size":8},
// {"text":"garlic","size":9},
// {"text":"ice","size":12},
// {"text":"meat","size":19}];
