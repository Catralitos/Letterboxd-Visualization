var movies_per_group = {};

var tooltip_radar_chart;
var dispatch_radar = d3.dispatch(
    "tooltip_genres_mouseover",
    "tooltip_genres_mouseout",
    "highlight_scatterplot_on",
    "highlight_scatterplot_off",
    "click_radar"
);

function gen_radar_chart() {
    d3.select("#GenreChart")
        .attr("style", "width: 100%; float: left; \
            height: " + height_row_2 + "px;");

    var padding_bottom = 40;

    svg_radar_chart = d3
        .select("#GenreChart")
        .append("svg")
        .attr("width", "300%")
        .attr("height", "300%")
        .append("g")
        .attr("transform", "translate(" + (300 / 2) + "," +
            (350 / 2 - padding_bottom) + ")");
    ;

    movies_per_group = Object.fromEntries(current_movies_per_genre);

    updateRadarChartLines();

    updateRadarByGenre();

    tooltip_radar_chart = d3
        .select("#GenreChart")
        .append("div")
        .attr("class", "tooltip")
        .style("opacity", 0)
        .style("width", "150px")
        .style("height", "45px");

    prepareGenreTooltip();

    prepareGenreClick();
}

function updateRadarChart() {
    movies_per_group = Object.fromEntries(current_movies_per_genre);

    updateRadarChartLines();

    updateRadarByGenre();

    prepareGenreTooltip();

    prepareGenreClick();
}

function updateRadarChartLines() {
    var hscale = getRadarChartHscale();
    var size = getNumOfGroups();
    svg_radar_chart
        .selectAll("line")
        .remove()

    Object.entries(movies_per_group).forEach((d, i) => {
        svg_radar_chart
            .append("line")
            .attr("class", "solid")
            .attr("fill", "none")
            .attr("stroke", "black")
            .attr("stroke-width", 1)
            .attr("x1", 0)
            .attr("y1", 0)
            //.transition("draw_radar")
            //.duration(1000)
            .attr("x2", hscale(d[1]))
            .attr("transform", "rotate(" + 360 / size * i + ")");
    });
}

function updateRadarByGenre() {
    var hscale = getRadarChartHscale();

    var size = getNumOfGroups();

    svg_radar_chart
        .selectAll("circle")
        .remove();

    svg_radar_chart
        .selectAll("image")
        .remove();

    Object.entries(movies_per_group).forEach((d, i) => {

        svg_radar_chart
            .append("circle")
            .attr("class", "radar")
            .attr("r", function () {
                if (isMaxNumOfMovies(d[1])) {
                    return 10;
                }
                return 7;
            })
            .attr("stroke", function () {
                if (filters["genres"].length != getAllGenres().length && filters["genres"].includes(d[0])) {
                    return lb_orange;
                }
                else if (isMaxNumOfMovies(d[1])) {
                    return "black";
                }
                return "none";
            })
            .attr("stroke-width", function () {
                if (isMaxNumOfMovies(d[1])) {
                    return "2";
                }
                return "2";
            })
            .attr("fill", function () {
                return color_scale[d[0]];
            })
            .attr("id", d[0])
            //.transition("draw_radar")
            //.duration(1000)
            .attr("cx", hscale(d[1]))
            .attr("transform", "rotate(" + 360 / size * i + ")")
            .append("title")
            .text(d[0] + ": " + d[1] + " movies");
    })
}

function prepareGenreTooltip() {
    svg_radar_chart
        .selectAll("circle")
        .data(Object.entries(movies_per_group))
        .on('mouseover', function (event, d) {
            dispatch_radar.call(
                "tooltip_genres_mouseover",
                this, event, d
            );
            dispatch_radar.call(
                "highlight_scatterplot_on",
                this, event, d
            );
        })
        .on('mouseout', function (event, d) {
            dispatch_radar.call(
                "tooltip_genres_mouseout",
                this, event, d
            );

            dispatch_radar.call(
                "highlight_scatterplot_off",
                this, event, d
            );
        });
}

function prepareGenreClick() {
    svg_radar_chart
        .selectAll("circle")
        .data(Object.entries(movies_per_group))
        .on("click", function (event, d) {
            dispatch_radar.call(
                "click_radar",
                this, event, d
            );
        });
}

dispatch_radar.on("tooltip_genres_mouseover", function (event, d) {
    d3.select(this)
        //.transition()
        //.duration(100)
        .attr("r", 15);
});

dispatch_radar.on("tooltip_genres_mouseout", function (event, d) {

    if (isMaxNumOfMovies(d[1])) {
        d3.select(this)
            //.transition()
            //.duration(200)
            .attr("r", 10);
    }
    else {
        d3.select(this)
            //.transition()
            //.duration(200)
            .attr("r", 7);
    }
});


dispatch_radar.on("highlight_scatterplot_on", function (event, d,) {
        var circles = d3.select('div#scatter').selectAll('circle');
        circles
            .filter((f) => {
                if (f.genres.includes(d[0])) {
                    return f;
                }
            })
            //.transition()
            //.duration(300)
            .style('fill', lb_green)
            .attr('r', 5)
});

dispatch_radar.on("highlight_scatterplot_off", function (event, d) {
    var circles = d3.select('div#scatter').selectAll('circle');
    circles
        .filter((f) => {
            if (f.genres.includes(d[0])) {
                return f;
            }
        })
        //.transition()
        //.duration(300)
        .style('fill', lb_cyan)
        .attr('r', 2)
})


dispatch_radar.on("click_radar", function (event, d) {

    /************ In case the genre was clicked for the second time ************/

    //in case list of filters is not all genres, you're just clicking to remove 1 of multiple selected
    if (filters["genres"].includes(d[0]) && filters["genres"].length != getAllGenres().length) {

        if (isMaxNumOfMovies(d[1])) {
            d3
                .select(this)
                //.transition("click_radar")
                //.duration('200')
                .attr("stroke", "black");
        }
        else {
            d3
                .select(this)
                //.transition("click_radar")
                //.duration('200')
                .attr("stroke", "none");
        }

        for (var i = 0; i < filters["genres"].length; i++) {
            if (filters["genres"][i] == d[0]) {
                filters["genres"].splice(i, 1);
            }
        }

        //if list is empty it has to fill back up again with all of them
        if (filters["genres"].length == 0) {
            filters["genres"] = getAllGenres();
        }
    }
    else {
        if (filters["genres"].length == getAllGenres().length) {
            filters["genres"] = [];
        }
        filters["genres"].push(d[0]);

        /************ In case a new genre was clicked ************/
        d3
            .selectAll("circle.radar")
            //.transition("click_radar")
            //.duration(100)
            .attr("stroke", function (d) {
                /*if (isMaxNumOfMovies(d[1])) {
                    return "black";
                }
                else */if (filters["genres"].includes(d[0])) {
                    return lb_orange;
                }
                else {
                    return "none";
                }
            });
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

/*********************************************************/
/************************ AUXILIAR ***********************/
/*********************************************************/

function getMaxValue(dictionary) {
    return d3.max(Object.values(dictionary));
}

function isMaxNumOfMovies(value) {
    var max_num_movies = getMaxValue(movies_per_group);
    return value == max_num_movies;
}

/************************ Scales ***********************/

// radius of the lines
function getRadarChartHscale() {
    return d3
        .scalePow()
        .exponent(0.3)
        .domain([0, getMaxValue(movies_per_group)])
        .range([0, width_radar_chart / 3.25]);
}

function getNumOfGroups() {
    return Object.entries(movies_per_group).filter(function (d) {
        return d[1] > 0;
    }).length;
}