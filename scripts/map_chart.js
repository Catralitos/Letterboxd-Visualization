var width = 500;
height = 500;
margin = { top: 20, right: 20, left: 60, bottom: 40 };
radius = 5;

//Geo
var geoWidth = 590;
var geoHeight = 230;

var dispatch_map = d3.dispatch(
    "highlight_scatterplot_on",
    "highlight_scatterplot_off",
    "click_map"
);

function gen_map_chart() {
    const cVar = 'nr_of_movies';

    const projection = d3
        .geoMercator()
        .scale(height / 2)
        .rotate([0, 0])
        .center([0, 0])
        .translate([geoWidth / 2, geoHeight / 2]);

    const path = d3
        .geoPath()
        .projection(projection);


    const colorScale = d3
        .scaleLinear()
        .range(['#86c2ff', '#08306b'])
        .domain(d3.extent(countries_dataset.map((d) => +d[cVar])));

    svg_map = d3
        .select('#geo')
        .append('svg')
        .attr('width', geoWidth)
        .attr('height', geoHeight)
        .attr('class', 'map')
        .selectAll('path')
        .data(topojson.feature(map_dataset, map_dataset.objects.countries).features)
        .join('path')
        .attr('class', 'country')
        .attr('d', path)
        .attr('id', (d, i) => d.properties.name)
        .attr('fill', (d) => {
            var countryMovies = current_dataset.filter(function (da) {
                return da.countries.includes(d.properties.name);
            });
            if (countryMovies.length === 0) {
                return lb_lightGrey;
            } else {
                return colorScale(countryMovies.length);
            }
        })    

    addZoom();
    updateMapChart();
}

function updateMapChart() {
    
    d3.selectAll("svg.map").remove();
    d3.selectAll("#legend").remove();

    const cVar = 'nr_of_movies';

    const projection = d3
        .geoMercator()
        .scale(height / 6)
        .rotate([0, 0])
        .center([0, 0])
        .translate([geoWidth / 2, geoHeight / 1.5]);

    const path = d3
        .geoPath()
        .projection(projection);

    const colorScale = d3
        .scaleLinear()
        .range(['#86c2ff', '#08306b'])
        .domain(d3.extent(countries_dataset.map((d) => +d[cVar])));

    svg_map = d3
        .select('#geo')
        .append('svg')
        .attr('class', 'map')
        .attr('width', geoWidth)
        .attr('height', geoHeight)
        .selectAll('path')
        .data(topojson.feature(map_dataset, map_dataset.objects.countries).features)
        .join('path')
        .attr('class', 'country')
        .attr('d', path)
        .attr('id', (d, i) => d.properties.name)
        .attr('fill', (d) => {
            var countryMovies = current_dataset.filter(function (da) {
                return da.countries.includes(d.properties.name);
            });
            if (countryMovies.length === 0) {
                return lb_lightGrey;
            } else if (filters["countries"].includes(d.properties.name)
                && filters["countries"].length != getAllCountries().length) {
                return lb_orange;
            } else {
                return colorScale(countryMovies.length);
            }
        })
        .append("title")
        .text((d) => {
            var countryMovies = current_dataset.filter(function (da) {
                return da.countries.includes(d.properties.name);
            });
            if (countryMovies.length === 0) {
                return d.properties.name + ": 0 movies";
            } else {
                if (d.properties.name === "Hungary") {
                    console.log(countryMovies);
                }
                return d.properties.name + ": " + countryMovies.length + " movies";
            }
        });
    
        
    const scale = ['NA', 1, 5, 10, 50, 100];

    d3.select('div#geo')
        .append('svg')
        .attr('id', 'legend')
        .attr('width', geoWidth)
        .attr('height', 40);

    d3.select('div#geo')
        .select('#legend')
        .append('text')
        .attr('x', 30)
        .attr('y', 25)
        .text('Nª of Movies per Country:')
        .style("fill", lb_fontColor);

    for (let i = 0; i < scale.length; i++) {
        d3.select('#legend')
            .append('rect')
            .attr('x', 175 + 40 * i)
            .attr('y', 15)
            .attr('rx', 4)
            .attr('ry', 4)
            .attr('width', 20)
            .attr('height', 15)
            .style('fill', () => {
                return i === 0 ? lb_lightGrey : colorScale(scale[i]);
            });
    }

    for (let i = 0; i < scale.length; i++) {
        d3.select('#legend')
            .append('text')
            .attr('x', 175 + 40 * i)
            .attr('y', 40)
            .text(scale[i])
            .style("fill", lb_fontColor);

    }
    
    prepareMapChartGroupEvents();

}

function prepareMapChartGroupEvents() {
    //svg_map
    d3.select("body")
        .selectAll(".country")
        .data(topojson.feature(map_dataset, map_dataset.objects.countries).features)
        .on('mouseenter', function (event, d) {
            dispatch_map.call(
                "highlight_scatterplot_on",
                this, event, d
            );
        })
        .on('mouseleave', function (event, d) {
            dispatch_map.call(
                "highlight_scatterplot_off",
                this, event, d
            );
        })
        .on("click", function (event, d) {
            dispatch_map.call(
                "click_map",
                this, event, d
            );
        });
}

dispatch_map.on("highlight_scatterplot_on", function (event, d) {
    //escolher os elementos do scatter e dar highlight
});

dispatch_map.on("highlight_scatterplot_off", function (event, d) {
    //escolher os elementos do scatter e tirar highlight
});

dispatch_map.on("click_map", function (event, d) {
    console.log(getAllCountries().length);
    if (filters["countries"].includes(d.properties.name) && filters["countries"].length != getAllCountries().length) {
        const cVar = 'nr_of_movies';
        console.log("Entrou no if");
        const colorScale = d3
            .scaleLinear()
            .range(['#86c2ff', '#08306b'])
            .domain(d3.extent(countries_dataset.map((d) => +d[cVar])));

        /*d3.select(this)
            //.transition("list_mouseevent")
            //.duration(1000)
            .attr('fill', (d) => {
                var countryMovies = current_dataset.filter(function (da) {
                    return da.countries.includes(d.properties.name);
                });
                if (countryMovies.length === 0) {
                    return lb_lightGrey;
                } else {
                    return colorScale(countryMovies.length);
                }
            })*/
        for (var i = 0; i < filters["countries"].length; i++) {
            if (filters["countries"][i] === d.properties.name) {
                filters["countries"].splice(i, 1);
            }
        }
        //if list is empty it has to fill back up again with all of them
        if (filters["countries"].length === 0) {
            filters["countries"] = getAllCountries();
        }
    }
    else {
        if (filters["countries"].length === getAllCountries().length) {
            filters["countries"] = [];
        }
        filters["countries"].push(d.properties.name);

        /* d3.select(this)
             //.transition("list_mouseevent")
             // .duration(1000)
             .style("fill", lb_orange);*/
    }
    updateDataset();
    updateScatterplot();
    updateBarChart();
    updateRadarChart();
    updateLists();
    updateMapChart();
    updateYearChart();
    updateSliders();
})

function addZoom() {
    d3.select('#geo')
        .selectAll('svg')
        .call(d3
            .zoom()
            .scaleExtent([0.25, 8])
            .on('zoom', zoomed));
}

function zoomed({ transform }) {
    d3.select('#geo')
        .selectAll('svg')
        .selectAll('path')
        .attr('transform', transform);
}