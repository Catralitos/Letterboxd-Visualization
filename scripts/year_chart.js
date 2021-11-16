
//DIV DIMENSIONS
var width = 600;
var height = 600;
//BIGGEST CIRCLE/ROOT DIMENSION
var vWidth = 480;
var vHeight = 480;
var size = 1;
var textSize = 1;
var diameter = width;
var data_path = "data/circular_data.csv";

var current_json;

var dispatch_year = d3.dispatch(
  "highlight_scatter_decade_on",
  "highlight_scatter_decade_off",
  "highlight_scatter_year_on",
  "highlight_scatter_year_off",
  "highlight_scatter_movie_on",
  "highlight_scatter_movie_off",
  "highlight_genre_on",
  "highlight_genre_off",
  "highlight_bar_on",
  "highlight_bar_off",
  "highlight_country_on",
  "highlight_country_off",
  "click_decade",
  "click_year",
  "click_movie"
);

function gen_year_chart() {
  d3.json("data/jason.json")
    .then(function (data) {
      current_json = data;
      /*data = d3.stratify(data)
        .parentId((d) => d.parent)
        .id((d) => d.child);*/
      createCPacking();
    })
    .catch((error) => {
      console.log(error);
    });
}

function createCPacking() {
  d3.select("#year-chart").select("svg").remove();

  var svg = d3
    .select('#year-chart')
    .append('svg')
    .attr('width', '100%')
    .attr('height', 600);

  const root = tree(current_json);

  var color = d3.scaleLinear()
    .domain([-1, 5])
    .range(["hsl(152,80%,80%)", "hsl(228,30%,40%)"])
    .interpolate(d3.interpolateHcl);



  var nodes = root.descendants();

  var focus = root;

  const circlesG = svg
    .selectAll('circle')
    .data(nodes)
    .enter()
    .append('g');

  var circle = circlesG
    .append('circle')
    .attr('stroke', 'white')
    .style('fill', (d) => {
      if (d.depth == 0)
        return 'grey';
      else if (d.depth == 1)
        return '#05668D';
      else if (d.depth == 2)
        return '#57A367';
      else
        return '#9D41E0';

    })
    .attr('opacity', 0.3)
    .attr('stroke-width', '2px')
    .attr('cx', function (d) {
      return d.x * size
    })
    .attr('cy', (d) => d.y * size)
    .attr('r', (d) => d.r * size)
    .on('mouseenter', function (event, d) {
      if (d.depth === 0) {
        //do nothing
      } else if (d.depth === 3) {
        dispatch_year.call(
          "highlight_scatter_movie_on",
          this, event, d
        );
      } else if (d.depth === 1) {
        dispatch_year.call(
          "highlight_scatter_decade_on",
          this, event, d
        );
      } else {
        dispatch_year.call(
          "highlight_scatter_year_on",
          this, event, d
        );
      }
      dispatch_year.call(
        "highlight_genre_on",
        this, event, d
      );
      dispatch_year.call(
        "highlight_bar_on",
        this, event, d
      );
      dispatch_year.call(
        "highlight_country_on",
        this, event, d
      );
    })
    .on('mouseleave', function (event, d) {
      if (d.depth === 0) {
        //do nothing
      } else if (d.depth === 3) {
        dispatch_year.call(
          "highlight_scatter_movie_off",
          this, event, d
        );
      } else if (d.depth === 1) {
        dispatch_year.call(
          "highlight_scatter_decade_off",
          this, event, d
        );
      } else {
        dispatch_year.call(
          "highlight_scatter_year_off",
          this, event, d
        );
      }
      dispatch_year.call(
        "highlight_genre_off",
        this, event, d
      );
      dispatch_year.call(
        "highlight_bar_off",
        this, event, d
      );
      dispatch_year.call(
        "highlight_country_off",
        this, event, d
      );
    })
    .on("click", function (event, d) {
      if (d.depth !== 0 && d.children.children === undefined ){
        current_json = d;
        createCPacking();
      }


      if (d.depth === 0) {
        //do nothing
      } else if (d.depth === 3) {
        dispatch_year.call(
          "click_movie",
          this, event, d
        );
      } else if (d.depth === 1) {
        dispatch_year.call(
          "click_decade",
          this, event, d
        );
      } else {
        dispatch_year.call(
          "click_year",
          this, event, d
        );
      }
    })
    .attr("id", (d) => d.data.name);
    
      var text = circlesG
      .append('text')
      .attr('font-family', 'sans-serif')
      .attr('font-size', 10)
      .attr('stroke-linejoin', 'round')
      .attr('stroke-width', 3)
      .attr('x', function (d) { 
        if (d.depth == 1) 
        {
          if(d.data.name!==undefined){
            
            return d.x * textSize +10; 
          }else{
            if (d.data.data.name!==undefined) 
              return d.x * textSize + 10; 
            else{
              if (d.data.data.data.name!==undefined) 
                return d.x * textSize - 50;
            }  
  
          }
        }
        return d.x * textSize +10; 
      })
      .attr('y', (d) => d.y * textSize - 10)
      .attr('dy', '0.31em')
      .attr('dx', (d) => (d.children ? -6 * textSize : 6 * textSize))
      .text(function (d) {
        if (d.depth == 1) 
        {
          if(d.data.name!==undefined){
            
            return d.data.name;
          }else{
            if (d.data.data.name!==undefined) 
              return d.data.data.name;
            else{
              if (d.data.data.data.name!==undefined) 
                return d.data.data.data.name;
            }  
  
          }
        }
  
      })
      .filter((d) => d.children)
      .attr('text-anchor', 'end')
      .clone(true)
      .lower()
      .attr('stroke', 'white');
    
  
  
  

}

function updateYearChart() {
  //DO NOTHING, porque não tou a conseguir filtrar isto
}


dispatch_year.on("highlight_scatter_decade_on", function (event, d) {

});

dispatch_year.on("highlight_scatter_decade_off", function (event, d) {

});

dispatch_year.on("highlight_scatter_year_on", function (event, d) {

});

dispatch_year.on("highlight_scatter_year_off", function (event, d) {

});

dispatch_year.on("highlight_scatter_movie_off", function (event, d) {

});

dispatch_year.on("highlight_genre_on", function (event, d) {

});

dispatch_year.on("highlight_genre_off", function (event, d) {

});

dispatch_year.on("highlight_bar_on", function (event, d) {

});

dispatch_year.on("highlight_bar_off", function (event, d) {

});

dispatch_year.on("highlight_country_on", function (event, d) {

});

dispatch_year.on("highlight_country_off", function (event, d) {

});


dispatch_year.on("click_decade", function (event, d) {
  //TODO mudar a cor do elemento

  var aux = d.data.name === undefined ? d.data.data.name : d.data.name;

  var x = aux.length > 4 ? [parseInt(aux.substring(0, 3) + "0"), parseInt(aux.substring(0, 3) + "9")] : [parseInt(aux), parseInt(aux)];
  if (JSON.stringify(filters['years']) === JSON.stringify(x)) {
    filters['years'] = [1924, 2021];
  } else {
    filters['years'] = x;
  }
  updateDataset();
  updateScatterplot();
  updateBarChart();
  updateRadarChart();
  updateLists();
  updateMapChart();
  updateYearChart();
  updateSliders();
});


dispatch_year.on("click_year", function (event, d) {

  var aux = d.data.name === undefined ? d.data.data.name : d.data.name;

  var x = [parseInt(aux.substring(0, 4)), parseInt(aux.substring(0, 4))];
  if (JSON.stringify(filters['years']) === JSON.stringify(x)) {
    filters['years'] = [1924, 2021];
  } else {
    filters['years'] = x;
  }
  updateDataset();
  updateScatterplot();
  updateBarChart();
  updateRadarChart();
  updateLists();
  updateMapChart();
  updateYearChart();
  updateSliders();

});


dispatch_year.on("click_movie", function (event, d) {
  var movie;
  for (var i = 0; i < current_dataset.length; i++) {
    if (current_dataset[i].title === d.data.name) {
      movie = current_dataset[i];
      break;
    }
  }
  if (movie === undefined) return;

  var str = movie.title + " (" + movie.year + ")\n";
  str += "Directed by: " + movie.directors + "\n";
  str += "Starring: " + movie.actors + "\n";
  str += "Runtime: " + movie.runtime + "\n";
  str += "Rating: " + movie.rating + "\n";
  str += "Number of Ratings: " + (movie.nr_of_ratings * 1000) + "\n";
  str += "Countries: " + movie.countries + "\n";
  str += "Genres: " + movie.genres + "\n";
  window.alert(str);
});

function reset() {
  filters['years'] = [1924, 2021];
  updateDataset();
  updateScatterplot();
  updateBarChart();
  updateRadarChart();
  updateLists();
  updateMapChart();
  updateYearChart();
  updateSliders();
}

const tree = (data) => {
  const root = d3.hierarchy(data).sum((d) => 5);
  return d3.pack().size([vWidth, vHeight])(root);
};

function addZoom() {
  d3.select('#year-chart')
    .selectAll('svg')
    .call(d3
      .zoom()
      .scaleExtent([0.25, 8])
      .on('zoom', zoomed));
}

function zoomed({ transform }) {
  d3.select('#year-chart')
    .selectAll('svg')
    .selectAll('path')
    .attr('transform', transform);
}





