
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

  console.log(root);

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
      if(d.depth==0)
      return 'grey';
      else if(d.depth==1)
        return '#05668D';
      else if(d.depth==2)
        return '#57A367';  
      else
        return '#9D41E0';
      // var countryMovies = current_dataset.filter(function (da) {
      //     return da.countries.includes(d.properties.name);
      // });
      // if (countryMovies.length === 0) {
      //     return lb_lightGrey;
      // } else if (filters["countries"].includes(d.properties.name)
      //     && filters["countries"].length != getAllCountries().length) {
      //     return lb_orange;
      // } else {
      //     return colorScale(countryMovies.length);
      // }
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
      } else if (d.depth === 2) {
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
      } else if (d.depth === 2) {
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

      if (d.depth === 0) {
        //do nothing
      } else if (d.depth === 3) {
        
        dispatch_year.call(
          "click_movie",
          this, event, d
        );
      } else if (d.depth === 2) {
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
    .attr("id",(d) => d.data.name);

  var text = circlesG
    .append('text')
    .attr('font-family', 'sans-serif')
    .attr('font-size', 10)
    .attr('stroke-linejoin', 'round')
    .attr('stroke-width', 3)
    .attr('x', function (d) { return d.x * textSize + 20; })
    .attr('y', (d) => d.y * textSize - 10)
    .attr('dy', '0.31em')
    .attr('dx', (d) => (d.children ? -6 * textSize : 6 * textSize))
    .text(function (d) {
      if (d.depth==1) {
        return d.data.name.substring(0, 5);
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


});


dispatch_year.on("click_year", function (event, d) {

});


dispatch_year.on("click_movie", function (event, d) {

});



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





