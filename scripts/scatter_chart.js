width = 500;
height = 500;
margin = { top: 20, right: 20, left: 60, bottom: 40 };
radius = 5;

var dispatch_scatter = d3.dispatch(
    "highlight_radar_on",
    "highlight_radar_off",
    "highlight_list_on",
    "highlight_list_off",
    "highlight_bar_on",
    "highlight_bar_off",
    "highlight_country_on",
    "highlight_country_off",
    "highlight_year_on",
    "highlight_year_off",
    "click_scatter"
);
var respective, respective_bubble;

const x_var = 'rating';
const y_var1 = 'runtime';
const y_var2 = 'nr_of_ratings';
var y_var;

var xValue;
var yValue1;
var yValue2;
var xScale;
var yScale1;
var yScale2;
var xAxis;
var yAxis1;
var yAxis2;

//Scatter (not vw/vh)
const scatterWidth = 430;
const scatterHeight = 230;

function gen_scatterplot() {
    
    y_var = y_var1;

    xValue = (d) => +d[x_var];
    yValue1 = (d) => +d[y_var1];
    yValue2 = (d) => +d[y_var2];

    xScale = d3
        .scaleLinear()
        .domain(d3.extent(d3.map(current_dataset, (d) => +xValue(d))))
        .range([margin.left, scatterWidth - margin.right])
        .nice();

    yScale1 = d3
        .scaleLinear()
        .domain(d3.extent(d3.map(current_dataset, (d) => +yValue1(d))))
        .range([scatterHeight - margin.bottom, margin.top])
        .nice();

    yScale2 = d3
        .scaleLinear()
        .domain(d3.extent(d3.map(current_dataset, (d) => +yValue2(d))))
        .range([scatterHeight - margin.bottom, margin.top])
        .nice();

    xAxis = d3.axisBottom(xScale);
    yAxis1 = d3.axisLeft(yScale1);
    yAxis2 = d3.axisLeft(yScale2);

    const scatter = d3.select('#scatter');

    const svg = scatter
        .append('svg')
        .attr('width', scatterWidth)
        .attr('height', scatterHeight);

    svg
        .append('g')
        .attr('class', 'x-axis')
        .attr('transform', `translate(0,${scatterHeight - margin.bottom})`)
        .append('text')
        .attr('id', 'x-label')
        .attr('x', scatterWidth / 2)
        .attr('y', margin.bottom - 5)
        .attr('fill', lb_fontColor)
        .style('font-size', '1.3em');

    svg
        .append('g')
        .attr('class', 'y-axis')
        .attr('transform', `translate(${margin.left},0)`)
        .append('text')
        .attr('id', 'y-label')
        .attr('x', -scatterHeight / 2 + margin.top + margin.bottom + 35)
        .attr('y', -40)
        .attr('fill', lb_fontColor)
        .style('font-size', '1.3em')
        .attr('transform', 'rotate(-90)');

    svg
        .append('g')
        .attr('fill', lb_cyan)
        .attr('stroke-width', 1.5)
        .attr('class', 'scatter');

    scatter.select('g.x-axis').transition().duration(500).call(xAxis);
    scatter.select('g.y-axis').transition().duration(500).call(yAxis1);
    scatter.select('#x-label').text("Rating");
    scatter.select('#y-label').text(y_var === "runtime" ? "Runtime (Minutes)" : "Nº of Ratings (Thousands)");

    const radius = d3
        .select('g.scatter')
        .attr('fill', lb_cyan)
        .attr('stroke-width', 1.5)
        .selectAll('circle')
        .data(current_dataset)
        .join(
            (enter) => {
                return (
                    enter
                        .append('circle')
                        .on('mouseenter', function (event, d) {
                            dispatch_scatter.call(
                                "highlight_radar_on",
                                this, event, d
                            );
                            dispatch_scatter.call(
                                "highlight_list_on",
                                this, event, d
                            );
                            dispatch_scatter.call(
                                "highlight_bar_on",
                                this, event, d
                            );
                            dispatch_scatter.call(
                                "highlight_country_on",
                                this, event, d
                            );
                            dispatch_scatter.call(
                                "highlight_year_on",
                                this, event, d
                            );
                        })
                        .on('mouseleave', function (event, d) {
                            dispatch_scatter.call(
                                "highlight_radar_off",
                                this, event, d
                            );
                            dispatch_scatter.call(
                                "highlight_list_off",
                                this, event, d
                            );
                            dispatch_scatter.call(
                                "highlight_bar_off",
                                this, event, d
                            );
                            dispatch_scatter.call(
                                "highlight_country_off",
                                this, event, d
                            );
                            dispatch_scatter.call(
                                "highlight_year_off",
                                this, event, d
                            );
                        })
                        .on("click", function (event, d) {
                            dispatch_scatter.call(
                                "click_scatter",
                                this, event, d
                            );
                        })
                        .attr('cx', (d) => xScale(xValue(d)))
                        .attr('cy', (d) => yScale1(yValue1(d)))
                        .attr('r', 2)
                        .append('title')
                        .text((d) => {
                            if (y_var === "runtime") {
                                return d.title + "\n" + "Rating: " + d.rating + "\nRuntime: " + d.runtime;
                            } else {
                                return d.title + "\n" + "Rating: " + d.rating + "\nNº of Ratings: " + d.nr_of_ratings;
                            }
                        })
                );
            },
            (update) => {
                update
                    .transition()
                    .duration(1000)
                    .attr("cx", (d) => xScale(xValue(d)))
                    .attr("cy", (d) => yScale1(yValue1(d)))
                    .attr("r", 2)
                    .style("fill", lb_cyan);
            },
            (exit) => {
                return exit.remove();
            }
        );

    updateScatterplot();

}

function updateScatterplot() {

    console.log("Entrou no update com x_var = " + x_var + " e y_var " + y_var);
    
    var yValue = y_var === 'runtime' ? yValue1 : yValue2;
    var yAxis = y_var === 'runtime' ? yAxis1 : yAxis2;

    const scatter = d3.select('#scatter');

    scatter.select('g.x-axis').transition().duration(500).call(xAxis);
    scatter.select('g.y-axis').transition().duration(500).call(yAxis);
    scatter.select('#x-label').text("Rating");
    scatter.select('#y-label').text(y_var === "runtime" ? "Runtime (Minutes)" : "Nº of Ratings (Thousands)");

    var radius = d3
        .select('g.scatter')
        .attr('fill', lb_cyan)
        .attr('stroke-width', 1.5)
        .selectAll('circle')
        .remove()

    radius = d3
        .select('g.scatter')
        .attr('fill', lb_cyan)
        .attr('stroke-width', 1.5)
        .selectAll('circle')
        .data(current_dataset)
        .join(
            (enter) => {
                return (
                    enter
                        .append('circle')
                        .on('mouseenter', function (event, d) {
                            dispatch_scatter.call(
                                "highlight_radar_on",
                                this, event, d
                            );
                            dispatch_scatter.call(
                                "highlight_list_on",
                                this, event, d
                            );
                            dispatch_scatter.call(
                                "highlight_bar_on",
                                this, event, d
                            );
                            dispatch_scatter.call(
                                "highlight_country_on",
                                this, event, d
                            );
                            dispatch_scatter.call(
                                "highlight_year_on",
                                this, event, d
                            );
                        })
                        .on('mouseleave', function (event, d) {
                            dispatch_scatter.call(
                                "highlight_radar_off",
                                this, event, d
                            );
                            dispatch_scatter.call(
                                "highlight_list_off",
                                this, event, d
                            );
                            dispatch_scatter.call(
                                "highlight_bar_off",
                                this, event, d
                            );
                            dispatch_scatter.call(
                                "highlight_country_off",
                                this, event, d
                            );
                            dispatch_scatter.call(
                                "highlight_year_off",
                                this, event, d
                            );
                        })
                        .on("click", function (event, d) {
                            dispatch_scatter.call(
                                "click_scatter",
                                this, event, d
                            );
                        })
                        .attr('cx', (d) => xScale(xValue(d)))
                        .attr('cy', function (d) {
                            return y_var === 'runtime' ? yScale1(yValue(d)) : yScale2(yValue(d))
                        })
                        .attr('r', 2)//(d) => Math.ceil(rValue(d)))
                        .append('title')
                        .text((d) => {
                            if (y_var === "runtime") {
                                return d.title + "\n" + "Rating: " + d.rating + "\nRuntime: " + d.runtime;
                            } else {
                                return d.title + "\n" + "Rating: " + d.rating + "\nNº of Ratings: " + d.nr_of_ratings;
                            }
                        })
                );
            },
            (update) => {
                update
                    .transition()
                    .duration(1000)
                    .attr("cx", (d) => xScale(xValue(d)))
                    .attr('cy', function (d) {
                        return y_var === 'runtime' ? yScale1(yValue(d)) : yScale2(yValue(d))
                    })
                    .attr("r", 2)
                    .style("fill", lb_cyan);
            },
            (exit) => {
                return exit.remove();
            }
        );
}

function axisChange(axis) {

    if (axis === "runtime")
        y_var = y_var1;
    else
        y_var = y_var2;
    updateScatterplot();
}

dispatch_scatter.on("highlight_radar_on", function (event, d) {

});

dispatch_scatter.on("highlight_radar_off", function (event, d) {

});

dispatch_scatter.on("highlight_list_on", function (event, d) {

});

dispatch_scatter.on("highlight_list_off", function (event, d) {

});

dispatch_scatter.on("highlight_bar_on", function (event, d) {

});

dispatch_scatter.on("highlight_bar_off", function (event, d) {

});

dispatch_scatter.on("highlight_country_on", function (event, d) {

});

dispatch_scatter.on("highlight_country_off", function (event, d) {

});

dispatch_scatter.on("highlight_year_on", function (event, d) {

});

dispatch_scatter.on("highlight_year_off", function (event, d) {

});

dispatch_scatter.on("highlight_bar_on", function (event, d) {

});

dispatch_scatter.on("click_scatter", function (event, d) {

});
