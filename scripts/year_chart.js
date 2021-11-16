
//DIV DIMENSIONS
var width = 800;
var height = 800;
//BIGGEST CIRCLE/ROOT DIMENSION
var vWidth = 600;
var vHeight = 600;
var size = 1;
var textSize = 1;
var diameter = width;
var data_path = "data/circular_data.csv";

function gen_year_chart() {
  d3.json("data/jason.json")
    .then(function (data) {
      /*data = d3.stratify(data)
        .parentId((d) => d.parent)
        .id((d) => d.child);*/
      createCPacking(data);
    })
    .catch((error) => {
      console.log(error);
    });
}

function createCPacking(data) {
  var svg = d3
    .select('#year-chart')
    .append('svg')
    .attr('width', '100%')
    .attr('height', 600);
  
  const root = tree(data);
  
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
    .attr('fill', '#05668D')
    .attr('opacity', 0.3)
    .attr('stroke-width', '2px')
    .attr('cx', (d) => d.x * size)
    .attr('cy', (d) => d.y * size)
    .attr('r', (d) => d.r * size);

  var text = circlesG
    .append('text')
    .attr('font-family', 'sans-serif')
    .attr('font-size', 10)
    .attr('stroke-linejoin', 'round')
    .attr('stroke-width', 3)
    .attr('x', function (d) { return d.x * textSize * 0.93; })
    .attr('y', (d) => d.y * textSize)
    .attr('dy', '0.31em')
    .attr('dx', (d) => (d.children ? -6 * textSize : 6 * textSize))
    .text(function (d) {
      return d.data.name.substring(0,5);
    })
    .filter((d) => d.children)
    .attr('text-anchor', 'end')
    .clone(true)
    .lower()
    .attr('stroke', 'white');
}

function updateYearChart(){

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





