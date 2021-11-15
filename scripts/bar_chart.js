var directors = true;

var dispatch_bar_chart = d3.dispatch(
    "highlight_bar_on",
    "highlight_bar_off",
    "highlight_scatter_on",
    "highlight_scatter_off",
    "click_bar"
);

var width_col_1 = window.innerWidth * 0.28;

var bar_chart_width = width_col_1 - (width_col_1 / 5) - 30;

function gen_bar_chart() {
    /*d3
        .select("#barChart")
        .attr("style", "width: " + bar_chart_width +
            "px; float: left; height: " + (height_row_1 - 20) + "px;");*/

    svg_bar_chart = d3
        .select("#barChart")
        .append("svg")
        .attr("width", bar_chart_width)
        .attr("height", height_row_1 - 20);

    updateBarChart();
}

function updateBarChart() {
    svg_bar_chart.remove();

    width = 400;
    height = 400;
    margin = { top: 20, right: 20, bottom: 20, left: 40 };

    if (directors) {
        x = d3
            .scaleLinear()
            .domain([0, 10])
            .range([margin.left, width - margin.right]);
        y = d3
            .scaleBand()
            .domain(d3.range(current_movies_per_director.length))
            .range([margin.top, height - margin.bottom])
            .padding(0.1);
        
        function xAxis(g) {
            g.attr("transform", `translate(0, ${margin.top})`).call(d3.axisTop(x));
        }
        function yAxis(g) {
            g.attr("transform", `translate(${margin.left}, 0)`).call(
                d3
                    .axisLeft(y)
                    .tickFormat((i) => {
                        if (current_movies_per_director[i] !== undefined && i < 10) {
                            return current_movies_per_director[i][0];
                        }
                    })
                    .tickSizeOuter(0)
            );
        }

        svg_bar_chart = d3
            .select("div#barChart")
            .append("svg")
            .attr("width", width)
            .attr("height", height);
        
        svg_bar_chart
            .append("g")
            .attr("class", "bars")
            .selectAll("rect")
            .data(current_movies_per_director, function (d) {
                return d[0];
            })
            .join("rect")
            .attr("x", x(0))
            .attr("y", (d, i) => y(i))
            .attr("width", (d) => x(d[1]) - x(0))
            .attr("height", y.bandwidth())
            .attr("id", function (d) {
                return d[0].replace(/\s/g, '');
            })
            .style("fill", function (d) {
                if (filters["directors"].length === getAllDirectors().length) {
                    return lb_cyan;
                }
                return lb_orange
            });
    } else {
        x = d3
            .scaleLinear()
            .domain([0, 10])
            .range([margin.left, width - margin.right]);
        y = d3
            .scaleBand()
            .domain(d3.range(current_movies_per_actor.length))
            .range([margin.top, height - margin.bottom])
            .padding(0.1);
        
        function xAxis(g) {
            g.attr("transform", `translate(0, ${margin.top})`).call(d3.axisTop(x));
        }
        function yAxis(g) {
            g.attr("transform", `translate(${margin.left}, 0)`).call(
                d3
                    .axisLeft(y)
                    .tickFormat((i) => {
                        if (current_movies_per_actor[i] !== undefined && i < 10) {
                            return current_movies_per_actor[i][0];
                        }
                    })
                    .tickSizeOuter(0)
            );
        }

        svg_bar_chart = d3
            .select("div#barChart")
            .append("svg")
            .attr("width", width)
            .attr("height", height);
        
        svg_bar_chart
            .append("g")
            .attr("class", "bars")
            .selectAll("rect")
            .data(current_movies_per_actor, function (d) {
                return d[0];
            })
            .join("rect")
            .attr("x", x(0))
            .attr("y", (d, i) => y(i))
            .attr("width", (d) => x(d[1]) - x(0))
            .attr("height", y.bandwidth())
            .attr("id", function (d) {
                return d[0].replace(/\s/g, '');
            })
            .style("fill", function (d) {
                if (filters["actors"].length === getAllActors().length) {
                    return lb_cyan;
                }
                return lb_orange
            });
    }

    svg_bar_chart.append("g").attr("class", "xAxis").call(xAxis);
    svg_bar_chart.append("g").attr("class", "yAxis").call(yAxis);

    prepareBarChartGroupEvents();
}

function prepareBarChartGroupEvents() {

    if (directors) {
        svg_bar_chart
            .selectAll("rect")
            .data(Object.entries(current_movies_per_director))
            .on('mouseenter', function (event, d) {
                dispatch_bar_chart.call(
                    "highlight_bar_on",
                    this, event, d
                );
                dispatch_bar_chart.call(
                    "highlight_scatter_on",
                    this, event, d
                );
            })
            .on('mouseleave', function (event, d) {
                dispatch_bar_chart.call(
                    "highlight_bar_off",
                    this, event, d
                );
                dispatch_bar_chart.call(
                    "highlight_scatter_off",
                    this, event, d
                );
            })
            .on("click", function (event, d) {
                dispatch_bar_chart.call(
                    "click_bar",
                    this, event, d
                );
            });
    }
    else {
        svg_bar_chart
            .selectAll("rect")
            .data(Object.entries(current_movies_per_actor))
            .on('mouseenter', function (event, d) {
                dispatch_bar_chart.call(
                    "highlight_bar_on",
                    this, event, d
                );
                dispatch_bar_chart.call(
                    "highlight_scatter_on",
                    this, event, d
                );
            })
            .on('mouseleave', function (event, d) {
                dispatch_bar_chart.call(
                    "highlight_bar_off",
                    this, event, d
                );
                dispatch_bar_chart.call(
                    "highlight_scatter_off",
                    this, event, d
                );
            })
            .on("click", function (event, d) {
                dispatch_bar_chart.call(
                    "click_bar",
                    this, event, d
                );
            });
    }
}

dispatch_bar_chart.on("highlight_bar_on", function (event, d) {
    d3.select(this)
        //.transition("list_mouseevent")
        //.duration(100)
        .style("fill", lb_green);
});

dispatch_bar_chart.on("highlight_bar_off", function (event, d) {
    d3.select(this)
        //.transition("list_mouseevent")
        //.duration(100)
        .style("fill", lb_cyan);
});

dispatch_bar_chart.on("highlight_scatter_on", function (event, d) {    
    var circles = d3.select('div#scatter').selectAll('circle');

    if (directors) {
        circles
            .filter((f) => {
                if (f.directors.includes(d[1][0])) {
                    return f;
                }
            })
            //.transition()
            //.duration(300)
            .style('fill', lb_green)
            .attr('r', 5)
    } else {
        circles
            .filter((f) => {
                if (f.actors.includes(d[1][0])) {
                    return f;
                }
            })
            //.transition()
            //.duration(300)
            .style('fill', lb_green)
            .attr('r', 5)
    }
});

dispatch_bar_chart.on("highlight_scatter_off", function (event, d) {
    var circles = d3.select('div#scatter').selectAll('circle');
    if (directors) {
        circles
            .filter((f) => {
                if (f.directors.includes(d[1][0])) {
                    return f;
                }
            })
            //.transition()
            //.duration(300)
            .style('fill', lb_cyan)
            .attr('r', 2)
    } else {
        circles
            .filter((f) => {
                if (f.actors.includes(d[1][0])) {
                    return f;
                }
            })
            //.transition()
            //.duration(300)
            .style('fill', lb_cyan)
            .attr('r', 2)
    }
});


dispatch_bar_chart.on("click_bar", function (event, d) {
    //SE QUISERMOS POR PARA FILTRAR POR 1 REALIZADOR OU 1 ATOR, DESCOMENTAR ISTO
    //MAS ISSO INVOLVE FILTRAR OS OUTROS GRÁFICOS. HIGHLIGHTS FICAM MELHOR
    /*
    if (directors) {
        //in case list of filters is not all genres, you're just clicking to remove 1 of multiple selected
        if (filters["directors"].includes(d[1][0]) && filters["directors"].length != getAllDirectors().length) {

            for (var i = 0; i < filters["directors"].length; i++) {
                if (filters["directors"][i] == d[1][0]) {
                    filters["directors"].splice(i, 1);
                }
            }

            //if list is empty it has to fill back up again with all of them
            if (filters["directors"].length == 0) {
                filters["directors"] = getAllDirectors();
            }
        }
        else {
            if (filters["directors"].length == getAllDirectors().length) {
                filters["directors"] = [];
            }
            filters["directors"].push(d[1][0]);

            //preencher o fill vai ter que ser em cima, que o update dá override
        }
    } else {
        if (filters["actors"].includes(d[1][0]) && filters["actors"].length != getAllDirectors().length) {

            for (var i = 0; i < filters["actors"].length; i++) {
                if (filters["actors"][i] == d[1][0]) {
                    filters["actors"].splice(i, 1);
                }
            }

            //if list is empty it has to fill back up again with all of them
            if (filters["actors"].length == 0) {
                filters["actors"] = getAllDirectors();
            }
        }
        else {
            if (filters["actors"].length == getAllDirectors().length) {
                filters["actors"] = [];
            }
            filters["actors"].push(d[1][0]);

            //preencher o fill vai ter que ser em cima, que o update dá override
        }
    }
    */
    /*d3.select(this)
        //.transition("list_mouseevent")
        //.duration(100)
        .style("fill", lb_orange);*/

    if (directors) {
        var stringToPrint = d[1][0] + "'s Filmography (From Best to Worst):\n";
        for (var i = 0; i < movie_list_per_director.length; i++) {
            if (movie_list_per_director[i][0] === d[1][0]) {
                for (var j = 0; j < movie_list_per_director[i][1].length; j++) {
                    var movie = movie_list_per_director[i][1][j];
                    stringToPrint += (j + 1) + ". " + movie.title + " (" + movie.year + ") \n";
                    stringToPrint += "   Genres: " + movie.genres + "\n";
                }
                break;
            }
        }
        window.alert(stringToPrint);
    } else {
        var stringToPrint = d[1][0] + "'s Filmography (From Best to Worst):\n";
        for (var i = 0; i < movie_list_per_actor.length; i++) {
            if (movie_list_per_actor[i][0] === d[1][0]) {
                for (var j = 0; j < movie_list_per_actor[i][1].length; j++) {
                    var movie = movie_list_per_actor[i][1][j];
                    stringToPrint += (j + 1) + ". " + movie.title + " (" + movie.year + ") \n";
                    stringToPrint += "   Genres: " + movie.genres + "\n";
                }
                break;
            }
        }
        window.alert(stringToPrint);
    }

    /*updateDataset();
    updateScatterplot();
    updateBarChart();
    updateRadarChart();
    updateLists();
    updateMapChart();
    updateYearChart();
    updateSliders();*/
});

function directorsChange(value) {
    if (value === 'directors') {
        directors = true;
    } else if (value === 'actors') {
        directors = false;
    }
    updateBarChart();
}