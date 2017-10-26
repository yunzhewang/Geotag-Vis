function draw_pie(){

  var color = d3.scale.category10();
  var radius = 100, width = 400, height = 400;
  var trans_x = 200, trans_y = 120;
  var svg, g = undefined;
  var filename = "../../data/csv/pie_data.csv";

  this.init = function(container_class){  // string
    svg = d3.select('.'+container_class).append("svg"),
    g = svg.append("g").attr("class", "pie-chart");

    svg.attr("width", width).attr("height", height);
    g.attr("transform", "translate(" + trans_x + "," + trans_y + ")");

    draw(g);
  }

  function draw(container){
    var pie = d3.layout.pie()
                .sort(null)
                .value(function(d) { return d.population; });

    var path = d3.svg.arc()
                 .outerRadius(radius - 10)
                 .innerRadius(0);

    var label = d3.svg.arc()
                  .outerRadius(radius - 40)
                  .innerRadius(radius - 40);

    // load file
    d3.csv(filename, function(d){
      d.population = +d.population;
      return d;
    }, function(error, data) {
      if (error) throw error;

      var arc = container.selectAll(".arc")
                         .data(pie(data))
                         .enter().append("g")
                         .attr("class", "arc");

      arc.append("path")
         .attr("d", path)
         .attr("fill", function(d) { return color(d.data.age); });

      arc.append("text")
         .attr("transform", function(d) { return "translate(" + label.centroid(d) + ")"; })
         .attr("dy", "0.35em")
         .text(function(d) { return d.data.age; });

    });
  } 

}

var draw_pie = new draw_pie();

