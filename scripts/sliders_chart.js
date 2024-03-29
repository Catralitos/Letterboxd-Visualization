const s = d3.formatSpecifier("f");
s.precision = d3.precisionFixed(1);
const f = d3.format(s);

const s2 = d3.formatSpecifier("f");
s.precision = d3.precisionFixed(0.01);
const f2 = d3.format(s);

const s3 = d3.formatSpecifier("f");
s.precision = d3.precisionFixed(1000);
const f3 = d3.format(s);

function gen_sliders() {

    svg_runtime_slider = d3
        .sliderBottom()
        .min(45)
        .max(432)
        .width(300)
        .tickFormat(f)
        .tickValues([40, 100,  160,  220,  280, 340,  400])
        .default([45, 432])
        .fill('#2196f3')
        .on('onchange', val => {
            d3.select('p#value-range').text(val.map(f).join('-'));
            filters["runtime"] = val;
            updateDataset();
            updateScatterplot();
            updateBarChart();
            updateRadarChart();
            updateLists();
            updateMapChart();
            updateYearChart();
            updateSliders();
        });

    var gRangeRuntime = d3
        .select('#slider-runtime')
        .append('svg')
        .attr('width', 500)
        .attr('height', 80)
        .append('g')
        .attr('transform', 'translate(30,30)');

    gRangeRuntime.call(svg_runtime_slider);

    svg_rating_slider = d3
        .sliderBottom()
        .min(4.15)
        .max(4.60)
        .width(300)
        .tickFormat(f2)
        .tickValues([4.15, 4.20, 4.25, 4.30, 4.35, 4.40, 4.45, 4.50, 4.55, 4.60])
        .default([4.15, 4.60])
        .fill('#2196f3')
        .on('onchange', val => {
            console.log("No val " + val);
            d3.select('p#value-range').text(val.map(f2).join('-'));
            filters["rating"] = val;
            updateDataset();
            updateScatterplot();
            updateBarChart();
            updateRadarChart();
            updateLists();
            updateMapChart();
            updateYearChart();
            updateSliders();
        });

    var gRangeRating = d3
        .select('#slider-rating')
        .append('svg')
        .attr('width', 500)
        .attr('height', 80)
        .append('g')
        .attr('transform', 'translate(30,30)');

    gRangeRating.call(svg_rating_slider);

    svg_nr_of_ratings_slider = d3
        .sliderBottom()
        .min(2534)
        .max(960591)
        .width(300)
        .tickFormat(f3)
        //.ticks(5)
        .tickValues([2500, 202000, 401500, 601000, 800500, 1000000])
        .default([2534, 960591])
        .fill('#2196f3')
        .on('onchange', val => {
            d3.select('p#value-range').text(val.map(f3).join('-'));
            filters["nr_of_ratings"] = val;
            updateDataset();
            updateScatterplot();
            updateBarChart();
            updateRadarChart();
            updateLists();
            updateMapChart();
            updateYearChart();
            updateSliders();
        });

    var gRangeNrRatings = d3
        .select('#slider-ratings')
        .append('svg')
        .attr('width', 500)
        .attr('height', 80)
        .append('g')
        .attr('transform', 'translate(30,30)');

    gRangeNrRatings.call(svg_nr_of_ratings_slider);
}

function updateSliders() { }