
function donut(){
  // var dataset = {
  //   apples: [53245, 28479, 19697, 24037, 40245],
  // };
  var dataset = {
                  Day_01: [55, 20, 30, 20],
                  Day_02: [60, 70, 80, 30],
                  Day_03: [100, 90, 40, 50]
                };
  var dataset_more = {
                  Day_01: [55, 20, 30, 20],
                  Day_02: [60, 70, 80, 30],
                  Day_03: [100, 90, 40, 50],
                  Day_04: [80, 60, 72, 33],
                  Day_05: [90, 83, 56, 50]
                };

  var width = 405,
      height = 408,
      cwidth =25,
      radius = Math.min(width, height) / 2;

  var color = d3.scale.category20();

  var pie = d3.layout.pie()
                     .sort(null);
  // var pie = d3.layout.pie()
  //       .value(function(d) {
  //         return d.value;
  //       });

  var arc = d3.svg.arc()
      .innerRadius(radius - 100)
      .outerRadius(radius - 50);

  // var arcOver = d3.svg.arc()
  //       .innerRadius(radius-100)
  //       .outerRadius(radius-50);

      

  var svg = d3.select("#pie-chart").append("svg")
      .attr("width", width)
      .attr("height", height);

  var donut_container = svg.append("g")
                           .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");
  
  var legend = svg.append("g")
                  .attr("class","legend")
                  .attr("transform","translate(30,30)")
                  .style("font-size","16px")
                  .call(d3.legend);

  setTimeout(function() { 
      legend
        .style("font-size","10px")
        .attr("data-style-padding",5)
        .call(d3.legend)
    },1000);

  var domain = ["food", "recreation", "traffic", "culture"];
  var colors = ['#1f77b4', '#d62728', '#ff7f0e', '#2ca02c'];

  // var gs = donut_container.selectAll("g").data(d3.values(dataset)).enter().append("g");
  // var path = gs.selectAll("path")
  //              .data(function(d) { return pie(d); })
  //              .enter().append("path")
  //              .attr('class', "pie-path-less")
  //              .attr("data-legend",function(d, i) { return domain[i];})
  //              .attr("fill", function(d, i) {  return colors[i]; })
  //              .attr("d", function(d, i, j) { return arc.innerRadius(10+cwidth*j).outerRadius(cwidth*(j+1))(d); })
  //              .on("click", function(d,i){word_cloud();histogram('#aec7e8')});
  // path.append("title")
  //       .text(function(d) { return "2012-01-01-food"; });

  var gs = donut_container.selectAll("g-less").data(d3.values(dataset)).enter().append("g").attr('class', 'g-less');
  var path = gs.selectAll("path")
               .data(function(d) { return pie(d); })
               .enter().append("path")
               .attr('class', "pie-path-less")
               .attr("data-legend",function(d, i) { return domain[i];})
               .attr("fill", function(d, i) {  return colors[i]; })
               .attr("d", function(d, i, j) { return arc.innerRadius(10+cwidth*j).outerRadius(cwidth*(j+1))(d); });
               //.on("click", function(d,i){word_cloud();histogram(colors[i])});
  path.append("title")
        .text(function(d) { return "2012-01-01-food"; });

  // $('#Btn5').click(function(e){
  //     //d3.selectAll('.pie-path').remove();
  //     var gs_more = donut_container.selectAll("g-more").data(d3.values(dataset_more)).enter().append('g').attr('class', 'g-more');
  //     var path_more = gs_more.selectAll("path")
  //              .data(function(d) { return pie(d); })
  //              .enter().append("path")
  //              .attr('class', "pie-path-more")
  //              .attr("data-legend",function(d, i) { return domain[i];})
  //              .attr("fill", function(d, i) {  return colors[i]; })
  //              .attr("d", function(d, i, j) { return arc.innerRadius(10+cwidth*j).outerRadius(cwidth*(j+1))(d); })
  //              .on("click", function(d,i){word_cloud();histogram(colors[i])});
  //     console.log(11);
  // });


  
}
