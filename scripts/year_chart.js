
var data, nestedData;
var width = 800;
var height = 800;

function updateYearChart(){}


var data_path = "data/ams_data.csv";

function gen_year_chart() {
//   d3.csv(data_path)
//     .then(function (ams) {
//       data = ams;

//       processData();
//       circularPacking();
//     })
//     .catch((error) => {
//       console.log(error);
//     });
}

function processData() {
  var stratify = d3
    .stratify()
    .parentId(function (d) {
      return d.parent;
    })
    .id(function (d) {
      return d.child;
    });
  nestedData = stratify(data);
}

function circularPacking() {
  color = d3
    .scaleLinear()
    .domain([0, 5])
    .range(["hsl(152,80%,80%)", "hsl(228,30%,40%)"])
    .interpolate(d3.interpolateHcl);

  var g = d3
    .select("#year-chart")
    .append("svg")
    .attr("width", width)
    .attr("height", height)
    .append("g");

  var packLayout = d3.pack().size([width, height]);

  var root = d3.hierarchy(nestedData).sum(function (d) {
    return d.data.price;
  });

  var nodes = root.descendants();

  packLayout(root);

  g.selectAll("g")
    .data(nodes)
    .enter()
    .append("g")
    .attr("class", "node")
    .append("circle")
    .attr("fill", (d) => (d.children ? color(d.depth) : "white"))
    .attr("stroke", "#ADADAD")
    .attr("cx", function (d) {
      return d.x;
    })
    .attr("cy", function (d) {
      return d.y;
    })
    .attr("r", function (d) {
      return d.r;
    })
    .append("title")
    .text(function (d) {
      return d.data.data.child;
    });

  g.selectAll(".node")
    .append("text")
    .attr("class", "label")
    .attr("transform", function (d) {
      return "translate(" + d.x + "," + d.y + ")";
    })
    .attr("dx", "-25")
    .attr("dy", ".5em")
    .style("font", "8px sans-serif")
    .style("display", (d) => (d.children ? "none" : "inline"))
    .text(function (d) {
      return clipText(d, d.data.data.child);
    });
}

function clipText(d, t) {
  var text = t.substring(0, d.r / 2);
  if (text.length < t.length) {
    text = text.substring(0, text.length - Math.min(2, text.length)) + "...";
  }
  return text;
}
