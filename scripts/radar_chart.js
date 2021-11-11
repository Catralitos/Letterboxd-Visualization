var movies_per_group = {};

var tooltip_radar_chart;
var dispatch_radar = d3.dispatch(
    "tooltip_genres_mouseover",
    "tooltip_genres_mouseout",
    "highlight_scatterplot_on",
    "highlight_scatterplot_off",
    "click_radar"
);

/*********************************************************/
/************************ CREATION ***********************/
/*********************************************************/

function gen_radar_chart() {
    d3.select("#GenreChart")
        .attr("style", "width: 100%; float: left; \
            height: " + height_row_2 + "px;");

    var padding_bottom = 40;

    /************************ Create SVG ********************/

    svg_radar_chart = d3
        .select("#GenreChart")
        .append("svg")
        .attr("width", "300%")
        .attr("height", "300%")
        .append("g")
        .attr("transform", "translate(" + (300 / 2) + "," +
            (350 / 2 - padding_bottom) + ")");
    ;

    /*************** Initialize dictionaries ***************/

    movies_per_group = movies_per_genre;

    /******************* Create Lines ***********************/

    updateRadarChartLines();

    /****************** Create Circles **********************/

    updateRadarByGenre();

    /********************* Create tooltip *******************/

    tooltip_radar_chart = d3
        .select("#GenreChart")
        .append("div")
        .attr("class", "tooltip")
        .style("opacity", 0)
        .style("width", "150px")
        .style("height", "45px");

    prepareGenreTooltip();

    /****************** Interaction On Click ***************/

    prepareGenreClick();
}

/*********************************************************/
/************************* UPDATE ************************/
/*********************************************************/

function updateRadarChart() {
    updateRadarChartData();

    //nao sei se isto tem que tar aqui
    movies_per_group = movies_per_genre;

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

    /************ Remove circles ************/
    svg_radar_chart
        .selectAll("circle")
        .remove();

    /************ Remove icons ************/
    svg_radar_chart
        .selectAll("image")
        .remove();

    Object.entries(movies_per_group).forEach((d, i) => {

        /************ Append circles ************/
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
                    return "red";
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
                return "none";
            })
            .attr("fill", function () {
                return color_scale[d[0]];
            })
            //.transition("draw_radar")
            //.duration(1000)
            .attr("cx", hscale(d[1]))
            .attr("transform", "rotate(" + 360 / size * i + ")")
            .append("title")
            .text(d[0] + ": " + d[1] + " movies");
    })
}

// update movies_per_genre
function updateRadarChartData() {

    /*current_dataset = movies_dataset.filter(function (d) {
        if (filters["age_ratings"].includes(d.rating.replace(/\s/g, '')) &&
            d.year >= filters["years"][0] && d.year <= filters["years"][1])

            if (filters["oscars"] == 0)
                return filters["genres"].includes(d.Main_Genre);

            // movies nominated for oscar
            else if (filters["oscars"] == 1)
                return (filters["genres"].includes(d.Main_Genre) && (d.nominations > 0));
        
        // movies that won oscar
        return (filters["genres"].includes(d.Main_Genre) && (d.winnings > 0));
        
        movies_per_genre = {}


        current_dataset.forEach(function (d) {
            for (var i = 0; i < d.genres.length; i++) {
                // count nr of movies and gross for each genre
                if (movies_per_genre[d.genres[i]] === undefined) {
                    movies_per_genre[d.genres[i]] = 1;
                }
                else {
                    movies_per_genre[d.genres[i]]++;
                }
            }
        });
    }*/
    //do nothing for now
}

/*********************************************************/
/******************** PREPARE EVENTS *********************/
/*********************************************************/

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

/*********************************************************/
/************************* EVENTS ************************/
/*********************************************************/

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

/*
dispatch_radar.on("highlight_scatterplot_on", function (event, d,) {
    var name = d[0];
    var max_value = getScatterplotMaxValue();

    svg_scatterplot
        .selectAll("circle")
        //.transition("higlight_on")
        //.duration(200)
        .attr("fill", function (d) {
            //(is_duration ? data = d.length : data = d.imdb_rating);
            var data;
            if (is_duration) { data = d.length; }
            else { data = d.imdb_rating; }

            // movies that match the hover
            if ((is_by_genre && d.Main_Genre == name) ||
                (!is_by_genre && d.studio == name)) {

                if (data == max_value) { return "rgba(255, 255, 255, 1)"; }
                else { return "rgba(74, 74, 74, 0.7)"; }
            }

            //movies that don't match the hover
            if (data == max_value) { return "rgba(255, 255, 255, 0.2)"; }
            else { return "rgba(74, 74, 74, 0.1)"; }
        })
        .attr("stroke-opacity", function (d) {
            var data;
            if (is_duration) { data = d.length; }
            else { data = d.imdb_rating; }

            if (data == max_value) {
                if ((is_by_genre && d.Main_Genre == name) ||
                    (!is_by_genre && d.studio == name)) {
                    return "1"
                }
                else { return "0.15"; }
            }
            else { return "none"; }
        });
});

dispatch_radar.on("highlight_scatterplot_off", function (event, d) {
    var max_value = getScatterplotMaxValue();

    svg_scatterplot
        .selectAll("circle")
        //.transition("higlight_off")
        //.duration(200)
        .attr("fill", function (d) {
            var data;
            if (is_duration) { data = d.length; }
            else { data = d.imdb_rating; }

            if (data == max_value) { return "rgba(255, 255, 255, 1)"; }
            else { return "rgba(74, 74, 74, 0.5)"; }
        })
        .attr("stroke-opacity", function (d) {
            var data;
            if (is_duration) { data = d.length; }
            else { data = d.imdb_rating; }

            if (data == max_value) { return "1"; }
            else { return "none"; }
        });
})
*/

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
                    return "red";
                }
                else {
                    return "none";
                }
            });

        /*
    d3
        .select(this)
        //.transition("click_radar")
        //.duration(100)
        .attr("stroke", "red");
        */
    }

    /************ Update Idioms ************/

    updateDataset();
    // VER SE USAR MOVIE_DATASET EM VEZ DE CURRENT NÃO FODE ISTO
    //pode ser preciso meter os genres todos de volta no filtered E depois filtrar por generos outra vez
    /*var filtered_dataset = movies_dataset.filter(function (item) {
        return containsGenres(item)
    });

    var filtered_data = Object.entries(filtered_dataset);
    */
    //console.log(current_dataset);

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