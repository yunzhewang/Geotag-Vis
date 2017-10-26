function draw_hist(){

  this.init = function(){
    run_histogram();
  }
  
  function run_histogram(){

    function normal() {
      var x = 0,
          y = 0,
          rds, c;
      do {
          x = Math.random() * 2 - 1;
          y = Math.random() * 2 - 1;
          rds = x * x + y * y;
      } while (rds == 0 || rds > 1);
      c = Math.sqrt(-2 * Math.log(rds) / rds);
      return x * c; 
    }

    /////////////////////   Load  Data   /////////////////////

    var N = 50, a = -1, b = 1.2;
    var step = (b - a) / (N - 1);
    var t = new Array(N), x = new Array(N), y = new Array(N);

    for(var i = 0; i < N; i++){
      t[i] = a + step * i;
      x[i] = -73.9830315074+(Math.pow(t[i], 3)) + (0.25 * normal() );   //input data x, longitude
      y[i] = 40.7515699768+(Math.pow(t[i], 6)) + (0.25 * normal() );   //altitude
    }
    


    //////////////////////////////////////////////////////////////

    var trace1 = {
      x: x,
      y: y,
      mode: 'markers',
      name: 'points',
      marker: {
        color: '#0066cc',
        // color: my_color,
        size: 5,
        opacity: 0.4
      },
      type: 'scatter'
    };
    // var trace2 = {
    //   x: x,
    //   y: y,
    //   name: 'density',
    //   ncontours: 20,
    //   colorscale: 'Hot',
    //   reversescale: true,
    //   showscale: false,
    //   type: 'histogram2dcontour'
    // };
    var trace3 = {
      x: x,
      name: 'x density',
      marker: {
        color: '#0066cc'},
        //color: my_color},
        yaxis: 'y2',
        type: 'histogram'
    };
    var trace4 = {
      y: y,
      name: 'y density',
      marker: {color: '#0066cc'},//my_color},
      xaxis: 'x2',
      type: 'histogram'
    };
    
    var data = [trace1, trace3, trace4];
    var layout = {
      showlegend: false,
      autosize: false,
      width: 400,
      height: 250,
      margin: {t: 50},
      hovermode: 'closest',
      bargap: 0,
      xaxis: {
        domain: [0, 0.85],
        showgrid: false,
        zeroline: false
      },
      yaxis: {
        domain: [0, 0.85],
        showgrid: false,
        zeroline: false
      },
      xaxis2: {
        domain: [0.85, 1],
        showgrid: false,
        zeroline: false
      },
      yaxis2: {
        domain: [0.85, 1],
        showgrid: false,
        zeroline: false
      }
    };

    // 'my_hist' is the id of the div which to draw
    Plotly.newPlot('my_hist', data, layout, {displayModeBar: false});  //hide the toolbar
  }

}

var draw_hist = new draw_hist();
