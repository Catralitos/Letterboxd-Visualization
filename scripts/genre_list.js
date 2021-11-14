var dispatch_list = d3.dispatch(
    "list_mouseenter",
    "list_mouseleave",
    "highlight_scatter_on",
    "highlight_scatter_off",
    "genre_list_click"
);

function gen_genre_list() {
    var genre_height = 30;
    const list_height = genre_height * 16 + 5 * 17;

    d3.select("GenreList")
        .attr("style", "width: 80%; height: " + (height_row_2 - 60) + "px; \
            margin-left: 10%;")

    svg_genre_list = d3
        .select("#GenreList")
        .append("svg")
        .attr("viewBox", "0, 0, 150, " + list_height);

    const genres = getAllGenres();

    var group = svg_genre_list
        .selectAll("g.list_group")
        .data(genres)
        .enter()
        .append("g")
        .attr("class", "list_group")
        .attr("id", "genre_group")
        .on('mouseenter', function (event, d) {
            dispatch_list.call(
                "list_mouseenter",
                this, event, d
            );
            dispatch_list.call(
                "highlight_scatter_on",
                this, event, d
            );
        })
        .on('mouseleave', function (event, d) {
            dispatch_list.call(
                "list_mouseleave",
                this, event, d
            );
            dispatch_list.call(
                "highlight_scatter_off",
                this, event, d
            );
        })
        .on('click', function (event, d) {
            dispatch_list.call(
                "genre_list_click",
                this, event, d
            );
        });

    group
        .append("rect")
        .attr("width", 130)
        .attr("height", genre_height)
        .attr("class", "list_rect")
        .attr("fill", lb_grey)
        .attr("stroke", function (d) {
            if (filters["genres"].length != getAllGenres().length && filters["genres"].includes(d)) {
                return lb_orange;
            }
            else return "none";
        })
        .attr("id", (d) => d + "List")
        .attr("rx", 6)
        .attr("x", 10)
        .attr("y", function (d, i) {
            return 10 + (genre_height + 5) * i;
        });

    group
        .append("circle")
        .attr("r", 6)
        .attr("fill", function (d) { return color_scale[d.replace(/\s/g, '')]; })
        .attr("cx", 25)
        .attr("cy", function (d, i) {
            return 15 + 10 + (genre_height + 5) * i;
        });

    group
        .append("text")
        .text(function (d) { return d; })
        .style("fill", lb_fontColor)
        .attr("x", 45)
        .attr("y", function (d, i) {
            return 20 + 10 + (genre_height + 5) * i;
        })
}

function updateLists() {
    d3.select("#GenreList")
        .selectAll("g")
        .select("rect")
        .data(getAllGenres())
        .transition()
        .duration(1000)
        .attr("stroke", function (d) {
            if (filters["genres"].length != getAllGenres().length && filters["genres"].includes(d)) {
                return lb_orange;
            }
            else return "none";
        });
}

dispatch_list.on("list_mouseenter", function (event, d) {
    d3.select(this)
        .select("rect")
        .transition("list_mouseevent")
        .duration(100)
        .attr("fill", lb_lightGrey)
});

dispatch_list.on("list_mouseleave", function (event, d) {
    d3.select(this)
        .select("rect")
        .transition("list_mouseevent")
        .duration(100)
        .attr("fill", lb_grey)
});

dispatch_list.on("highlight_scatter_on", function (event, d) {
    var circles = d3.select('div#scatter').selectAll('circle');
        circles
            .filter((f) => {
                if (f.genres.includes(d)) {
                    return f;
                }
            })
            //.transition()
            //.duration(300)
            .style('fill', lb_green)
            .attr('r', 5)
});

dispatch_list.on("highlight_scatter_off", function (event, d) {
    var circles = d3.select('div#scatter').selectAll('circle');
    circles
        .filter((f) => {
            if (f.genres.includes(d)) {
                return f;
            }
        })
        //.transition()
        //.duration(300)
        .style('fill', lb_cyan)
        .attr('r', 2)
});

dispatch_list.on("genre_list_click", function (event, d) {
    if (filters["genres"].includes(d) && filters["genres"].length != getAllGenres().length) {
        
        d3.select("rect")
            .transition("list_mouseevent")
            .duration(1000)
            .attr("stroke", "none")
        
        for (var i = 0; i < filters["genres"].length; i++) {
            if (filters["genres"][i] == d) {
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
        filters["genres"].push(d);

        d3.select("rect")
            //.transition("list_mouseevent")
            //.duration(1000)
            .attr("stroke", lb_orange);
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
