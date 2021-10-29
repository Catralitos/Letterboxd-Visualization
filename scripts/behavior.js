var map = "/data/countries.json"; // world atlas
var data_source = "/data/dataset.csv";

var topology;
var dataset;

var width = 1000;
var height = 400;

margin = { top: 20, right: 20, bottom: 20, left: 40 };

var radius = 5;

var countryList = []

Promise.all([d3.json(map), d3.csv(data_source)]).then(function ([map, data]) {
	topology = map;
	dataset = data;
	gen_geo_map();
	gen_scatterplot(dataset, false);
	addZoom();
});

function gen_geo_map() {
	var projection = d3
		.geoMercator()
		.scale(height / 2)
		.rotate([0, 0])
		.center([0, 0])
		.translate([width / 2, height / 2]);

	var path = d3.geoPath().projection(projection);

	d3.select("#geo_map")
		.append("svg")
		.attr("width", width)
		.attr("height", height)
		.selectAll("path")
		.style("fill", "steelblue")
		.data(topojson.feature(topology, topology.objects.countries).features)
		.join("path")
		.attr("class", "country")
		.attr("d", path)
		.style("fill", "steelblue")
		.on("mouseover", handleMouseOver)
		.on("mouseleave", handleMouseLeave)
		.on("click", handleClickGeo)
		.attr("id", function (d, i) {
			return d.properties.name;
		})  
		.append("title")
		.text(function (d) {
			var alcohol = 0;
			var life = 0;
			for (dataItem in dataset){
				if (dataset[dataItem].country == d.properties.name){
				    alcohol = dataset[dataItem].alcconsumption;
					life = dataset[dataItem].lifeexpectancy;
				    break;
				}
			}
			return d.properties.name + " has alcohol consumption " + alcohol + " and life expectancy " + life;
		});
}

function gen_scatterplot(data, update) {

    //var width = 640;
    //var height = 400;
    //margin = { top: 20, right: 20, bottom: 20, left: 40 };
    
    x = d3
        .scaleLinear()
        .domain([47, 85])
        .nice()
        .range([margin.left, width - margin.right]);

    y = d3
        .scaleLinear()
        .domain([0, 20])
        .range([height - margin.bottom, margin.top]);

    xAxis = (g) => g
        .attr("transform", `translate(0,${height - margin.bottom})`)
        .call( d3.axisBottom(x));


    yAxis = (g) => g
        .attr("transform", `translate(${margin.left},0)`)
        .call(d3.axisLeft(y));


    grid = (g) => g.attr("stroke", "currentColor").attr("stroke-opacity", 0.1).call((g) => g.append("g").selectAll("line").data(x.ticks()).join("line").attr("x1", (d) => 0.5 + x(d)).attr("x2", (d) => 0.5 + x(d)).attr("y1", margin.top).attr("y2", height - margin.bottom)).call((g) => g.append("g").selectAll("line").data(y.ticks()).join("line").attr("y1", (d) => 0.5 + y(d)).attr("y2", (d) => 0.5 + y(d)).attr("x1", margin.left).attr("x2", width - margin.right));
    
    if (!update) {
        d3.select("div#scatterplot")
          .append("svg")
          .append("g")
          .attr("class", "circles")
          .style("stroke-width", 1.5);
      }
    
      const svg = d3
        .select("div#scatterplot")
        .select("svg")
        .attr("width", width)
        .attr("height", height);
    
      svg
        .select("g.circles")
        .selectAll("circle")
        .data(data)
        .join(
          (enter) => {
            return enter
              .append("circle")
              .attr("cx", (d) => x(d.lifeexpectancy))
            .attr("cy", (d) => { if (d.alcconsumption !=0 || d.alcconsumption != NaN) {return y(d.alcconsumption);}})
              .attr("r", 2)
              .style("fill", "steelblue")
			  .on("click", handleClickScatter)
			  .append("title")
			  .text((d) => `${d.country} has alcohol consumption ${d.alcconsumption} and life expectancy ${d.lifeexpectancy}`)
              .on("mouseover", handleMouseOver)
              .on("mouseleave", handleMouseLeave)
              .on("click", handleClickScatter)
              .transition()
              .duration(1000)
              .style("opacity", "100%");
          },
          (update) => {
            update
              .transition()
              .duration(1000)
              .attr("cx", (d) => x(d.lifeexpectancy))
            .attr("cy", (d) => { if (d.alcconsumption !=0 || d.alcconsumption != NaN) {return y(d.alcconsumption);}})
              .attr("r", 2)
              .style("fill", "steelblue");
          },
          (exit) => {
            exit.remove();
          }
        );
    
      if (!update) {
        svg.append("g").attr("class", "scatterXAxis");
        svg.append("g").attr("class", "scatterYAxis");
        svg.append("g").attr("class", "scatterGrid").call(grid);
      } else {
      }
      d3.select("g.scatterXAxis").call(xAxis);
      d3.select("g.scatterYAxis").call(yAxis);
    }

	function handleMouseOver(event, d) {
		geo_map = d3.select("div#geo_map").select("svg");
		scatterplot = d3.select("div#scatterplot").select("svg");
	
		/*
		geo_map
			.selectAll("path")
			.filter(function (c) {
				if (d.id == c.id) return c;
			})
			.style("fill", "red");
	
		scatterplot
			.selectAll("circle")
			.filter(function (c) {
				if (d.id == c.id) return c;
			})
			.style("fill", "red");
			*/
	}
	
	function handleMouseLeave(event, d) {
			
		/*d3.select("div#geo_map")
			.select("svg")
			.selectAll("path")
			.style("fill", "steelblue");
	
		d3.select("div#scatterplot")
			.select("svg")
			.selectAll("circle")
			.style("fill", "steelblue");
			*/
	}

function handleClickGeo(event, d) {
	
	if (countryList.includes(d.properties.name)){
		countryList = countryList.filter(item => item !== d.properties.name);	
		geo_map
		.selectAll("path")
		.filter(function (c) {
			if (d.id == c.id) return c;
		})
		.style("fill", "steelblue");
	
	scatterplot
		.selectAll("circle")
		.filter(function (c) {
			if (d.properties.name == c.country) return c;
		})
		.style("fill", "steelblue");
		
		document.getElementById(  d.properties.name + "listItem").remove();
	
	
	} else {
		countryList.push(d.properties.name);
		geo_map
		.selectAll("path")
		.filter(function (c) {
			if (d.id == c.id) return c;
		})
		.style("fill", "red");
	
	scatterplot
		.selectAll("circle")
		.filter(function (c) {
			if (d.properties.name == c.country) return c;
		})
		.style("fill", "red");
		
		var list = document.getElementById('countryList');
		var entry = document.createElement('li');
		entry.appendChild(document.createTextNode(d.properties.name));
		entry.setAttribute("id", d.properties.name + "listItem")
		list.appendChild(entry);
	}
	
	console.log(countryList);
	
	//window.alert(d.properties.name);
}

function handleClickScatter(event, d) {
	console.log("Chamou on click scatter")
	if (countryList.includes(d.country)){
		countryList = countryList.filter(item => item !== d.country);	
		geo_map
		.selectAll("path")
		.filter(function (c) {
			if (d.country == c.properties.name) return c;
		})
		.style("fill", "steelblue");
	
	scatterplot
		.selectAll("circle")
		.filter(function (c) {
			if (d.country == c.country) return c;
		})
		.style("fill", "steelblue");
		
		document.getElementById( d.country + "listItem").remove();
	
	
	} else {
		countryList.push(d.country);
		geo_map
		.selectAll("path")
		.filter(function (c) {
			if (d.country == c.properties.name) return c;
		})
		.style("fill", "red");
	
	scatterplot
		.selectAll("circle")
		.filter(function (c) {
			if (d.country == c.country) return c;
		})
		.style("fill", "red");
		
		var list = document.getElementById('countryList');
		var entry = document.createElement('li');
		entry.appendChild(document.createTextNode(d.country));
		entry.setAttribute("id", d.country + "listItem")
		list.appendChild(entry);
	}
	
	console.log(countryList);
	
	//window.alert(d.properties.name);
}


function addZoom() {
	d3.select("#geo_map")
		.selectAll("svg")
		.call(d3.zoom().scaleExtent([1, 8]).on("zoom", zoomed));
}

function zoomed({ transform }) {
	d3.select("#geo_map")
		.selectAll("svg")
		.selectAll("path")
		.attr("transform", transform);
}









