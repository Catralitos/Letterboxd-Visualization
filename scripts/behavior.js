const map_path = 'data/countries.json';
const data_path = 'data/country_movies.csv';
const main_data = 'data/movie_data.csv';

//Colors to use
lb_orange = "#ff8000";
lb_green = "#00e054";
lb_cyan = "#40bcf4";
lb_fontColor = "#f1f3f5";
lb_grey = "#2c3440";
lb_black = "#14181c";
lb_lightGrey = "#678";


//better to keep this as pixels, at least for now
const width = 500;
const height = 500;
const margin = { top: 20, right: 20, left: 60, bottom: 40 };
const radius = 5;

//I'm putting everything to change idiom sizes on top
//vw = view width
//vh = view height
//Note, the ones without vw or vh it's because they get converted later down

//Geo
const geoWidth = 590;
const geoHeight = 230;

//Scatter (not vw/vh)
const scatterWidth = 430;
const scatterHeight = 230;


var dataset;
var main_dataset;

const x_var = 'rating';
const y_var1 = 'runtime';
const y_var2 = 'nr_of_ratings';
var y_var;

var countries = [];

/*
Mapa:
    - quanto mais filmes desse país mais escuro o país
    - hover: tooltip diz nome do pais e numero de filmes
    - clicar num (ou mais paises) filtra so por esse pais(es)
    os outros dados nos outros graficos

Scatterplot:
    - eixo x - rating
    - eixo y - runtime ou numero de ratings (toggle)
    - hover: tooltip diz nome do filme e rating + runtime/numero de ratings 
    e país é highlighted 
*/


Promise.all([d3.json(map_path), d3.csv(data_path), d3.csv(main_data)]).then(([map, data, main]) => {
    dataset = data;
    main_dataset = main
    main_dataset = main_dataset.filter(function (d) {
        return d["nr_of_ratings"] = d["nr_of_ratings"] / 1000;
    });
    createGeoMap(map);
    y_var = y_var1;
    createScatterPlot(main_dataset, false);
    addZoom();
});

//////////////////////////////////////////////////////////////////////////////////////////////////////////////
/// CREATE IDIOMS                                                                                          ///
//////////////////////////////////////////////////////////////////////////////////////////////////////////////

function createGeoMap(map) {
    const cVar = 'nr_of_movies';
        
    const projection = d3
        .geoMercator()
        .scale(height / 2)
        .rotate([0, 0])
        .center([0, 0])
        .translate([geoWidth / 2, geoHeight / 2]);

    const path = d3.geoPath().projection(projection);

    const colorScale = d3
        .scaleLinear()
        .range(['#86c2ff', '#08306b'])
        .domain(d3.extent(dataset.map((d) => +d[cVar])));

    const geo = d3
        .select('#geo')
        .append('svg')
        .attr('width', geoWidth)
        .attr('height', geoHeight)
        .selectAll('path')
        .data(topojson.feature(map, map.objects.countries).features)
        .join('path')
        .attr('class', 'country')
        .attr('d', path)
        .attr('id', (d, i) => d.properties.name)
        // .style("fill", calculateFill)
        .attr('fill', (d) => {
            var country = dataset.filter((da) => da.country === d.properties.name);
            if (country.length === 0) {
                return lb_lightGrey;
            } else {
                return colorScale(country[0][cVar]);
            }
        })
        .on('mouseover', handleMouseOver)
        .on('mouseleave', handleMouseLeave)
        .on('click', handleClick)
        .append('title')
        .text((d) => { 
            var country = dataset.filter((d1) => d1.country === d.properties.name);
            if (country.length != 0) {
                return d.properties.name+"\n"+"Number of movies: "+country[0]['nr_of_movies']
            }
        });

        // console.log(d3.max(dataset.map((d) => +d[cVar])))

        const scale = ['NA', 1, 5,10, 50 , 100];
    
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

}

function createScatterPlot(data, update = false) {

    const xValue = (d) => +d[x_var];
    const yValue = (d) => +d[y_var];
    // const rValue = (d) => +d[y_var];

    data = data.filter(
        (d) =>
            !isNaN(xValue(d) && !isNaN(yValue(d))) &&
            xValue(d) > 0 &&
            yValue(d) > 0

    );

    // data = data.filter(function (d) {
    //       return d["nr_of_ratings"]=d["nr_of_ratings"]/100;  
    //   });

    const xScale = d3
        .scaleLinear()
        .domain(d3.extent(d3.map(data, (d) => +xValue(d))))
        .range([margin.left, scatterWidth - margin.right])
        .nice();

    const yScale = d3
        .scaleLinear()
        .domain(d3.extent(d3.map(data, (d) => +yValue(d))))
        .range([scatterHeight - margin.bottom, margin.top])
        .nice();

    // const rScale = d3
    //     .scaleLinear()
    //     .domain(d3.extent(d3.map(main_dataset, (d) => +rValue(d))));

    const xAxis = d3.axisBottom(xScale);
    const yAxis = d3.axisLeft(yScale);

    const scatter = d3.select('#scatter');

    if (!update) {
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
    }

    scatter.select('g.x-axis').transition().duration(500).call(xAxis);
    scatter.select('g.y-axis').transition().duration(500).call(yAxis);
    scatter.select('#x-label').text(
        "Rating"
    );
    scatter.select('#y-label').text(y_var === "runtime" ? "Runtime (Minutes)" : "Nº of Ratings (Thousands)");


    if (update === true) {
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
            .data(data)
            .join(
                (enter) => {
                    return (

                        enter
                            .append('circle')
                            // .on('mouseover', handleMouseOver)
                            // .on('mouseleave', handleMouseLeave)
                            // .on('click', handleClick)
                            .attr('cx', (d) => xScale(xValue(d)))
                            .attr('cy', (d) => yScale(yValue(d)))
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
                        .attr("cy", (d) => yScale(yValue(d)))
                        .attr("r", 2)
                        // .append('title')
                        // .text((d) => { 
                        //     return d.title+"\n"+"Rating: "+d.rating+"\nRuntime: "+d.runtime;
                        // })
                        .style("fill", lb_cyan);

                    // .append('title')
                    // .text((d) => { 

                    //     return d.title+"\n"+"Rating: "+d.rating+"\nRuntime: "+d.runtime;
                    // });

                },
                (exit) => {
                    // console.log(exit);
                    return exit.remove();
                }
            );


    }
    else {
        const radius = d3
            .select('g.scatter')
            .attr('fill', lb_cyan)
            .attr('stroke-width', 1.5)
            .selectAll('circle')
            .data(data)
            .join(
                (enter) => {
                    return (

                        enter
                            .append('circle')
                            // .on('mouseover', handleMouseOver)
                            // .on('mouseleave', handleMouseLeave)
                            // .on('click', handleClick)
                            .attr('cx', (d) => xScale(xValue(d)))
                            .attr('cy', (d) => yScale(yValue(d)))
                            .attr('r', 2)//(d) => Math.ceil(rValue(d)))
                            .append('title')
                            .text((d) => {
                                return d.title + "\n" + "Rating: " + d.rating + "\nRuntime: " + d.runtime;
                            })
                    );
                },
                (update) => {

                    update
                        .transition()
                        .duration(1000)
                        .attr("cx", (d) => xScale(xValue(d)))
                        .attr("cy", (d) => yScale(yValue(d)))
                        .attr("r", 2)
                        // .append('title')
                        // .text((d) => { 
                        //     return d.title+"\n"+"Rating: "+d.rating+"\nRuntime: "+d.runtime;
                        // })
                        .style("fill", lb_cyan);

                    // .append('title')
                    // .text((d) => { 

                    //     return d.title+"\n"+"Rating: "+d.rating+"\nRuntime: "+d.runtime;
                    // });

                },
                (exit) => {
                    // console.log(exit);
                    return exit.remove();
                }
            );
    }



}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////
/// HANDLE MOUSE EVENTS                                                                                    ///
//////////////////////////////////////////////////////////////////////////////////////////////////////////////



function handleMouseOver(e, d) {
    // var name = Object.keys(d).includes('country') ? d.country : d.properties.name;
    // if (countries.includes(name)===false)
    //     changeColor(d, 'red');  
}

function handleMouseLeave(e, d) {
    // var name = Object.keys(d).includes('country') ? d.country : d.properties.name;
    // if (countries.includes(name)===false)
    //     changeColor(d, lb_cyan);     
}


function handleClick(e, d) {

    var name = Object.keys(d).includes('countries') ? d.coutries : d.properties.name;
    // console.log(countries)
    // changeColor(d, 'orange');
    var color;
    if (Array.isArray(name) === false) {
        if (countries.includes(name) === false) {
            countries.push(name);
            dataChange(name);
            changeColor(d, lb_orange);
        }
        else {
            const cVar = 'nr_of_movies';

            const colorScale = d3
                .scaleLinear()
                // ["#f7fbff","#f6faff","#f5fafe","#f5f9fe","#f4f9fe","#f3f8fe","#f2f8fd","#f2f7fd","#f1f7fd","#f0f6fd","#eff6fc","#eef5fc","#eef5fc","#edf4fc","#ecf4fb","#ebf3fb","#eaf3fb","#eaf2fb","#e9f2fa","#e8f1fa","#e7f1fa","#e7f0fa","#e6f0f9","#e5eff9","#e4eff9","#e3eef9","#e3eef8","#e2edf8","#e1edf8","#e0ecf8","#e0ecf7","#dfebf7","#deebf7","#ddeaf7","#ddeaf6","#dce9f6","#dbe9f6","#dae8f6","#d9e8f5","#d9e7f5","#d8e7f5","#d7e6f5","#d6e6f4","#d6e5f4","#d5e5f4","#d4e4f4","#d3e4f3","#d2e3f3","#d2e3f3","#d1e2f3","#d0e2f2","#cfe1f2","#cee1f2","#cde0f1","#cce0f1","#ccdff1","#cbdff1","#cadef0","#c9def0","#c8ddf0","#c7ddef","#c6dcef","#c5dcef","#c4dbee","#c3dbee","#c2daee","#c1daed","#c0d9ed","#bfd9ec","#bed8ec","#bdd8ec","#bcd7eb","#bbd7eb","#b9d6eb","#b8d5ea","#b7d5ea","#b6d4e9","#b5d4e9","#b4d3e9","#b2d3e8","#b1d2e8","#b0d1e7","#afd1e7","#add0e7","#acd0e6","#abcfe6","#a9cfe5","#a8cee5","#a7cde5","#a5cde4","#a4cce4","#a3cbe3","#a1cbe3","#a0cae3","#9ec9e2","#9dc9e2","#9cc8e1","#9ac7e1","#99c6e1","#97c6e0","#96c5e0","#94c4df","#93c3df","#91c3df","#90c2de","#8ec1de","#8dc0de","#8bc0dd","#8abfdd","#88bedc","#87bddc","#85bcdc","#84bbdb","#82bbdb","#81badb","#7fb9da","#7eb8da","#7cb7d9","#7bb6d9","#79b5d9","#78b5d8","#76b4d8","#75b3d7","#73b2d7","#72b1d7","#70b0d6","#6fafd6","#6daed5","#6caed5","#6badd5","#69acd4","#68abd4","#66aad3","#65a9d3","#63a8d2","#62a7d2","#61a7d1","#5fa6d1","#5ea5d0","#5da4d0","#5ba3d0","#5aa2cf","#59a1cf","#57a0ce","#569fce","#559ecd","#549ecd","#529dcc","#519ccc","#509bcb","#4f9acb","#4d99ca","#4c98ca","#4b97c9","#4a96c9","#4895c8","#4794c8","#4693c7","#4592c7","#4492c6","#4391c6","#4190c5","#408fc4","#3f8ec4","#3e8dc3","#3d8cc3","#3c8bc2","#3b8ac2","#3a89c1","#3988c1","#3787c0","#3686c0","#3585bf","#3484bf","#3383be","#3282bd","#3181bd","#3080bc","#2f7fbc","#2e7ebb","#2d7dbb","#2c7cba","#2b7bb9","#2a7ab9","#2979b8","#2878b8","#2777b7","#2676b6","#2574b6","#2473b5","#2372b4","#2371b4","#2270b3","#216fb3","#206eb2","#1f6db1","#1e6cb0","#1d6bb0","#1c6aaf","#1c69ae","#1b68ae","#1a67ad","#1966ac","#1865ab","#1864aa","#1763aa","#1662a9","#1561a8","#1560a7","#145fa6","#135ea5","#135da4","#125ca4","#115ba3","#115aa2","#1059a1","#1058a0","#0f579f","#0e569e","#0e559d","#0e549c","#0d539a","#0d5299","#0c5198","#0c5097","#0b4f96","#0b4e95","#0b4d93","#0b4c92","#0a4b91","#0a4a90","#0a498e","#0a488d","#09478c","#09468a","#094589","#094487","#094386","#094285","#094183","#084082","#083e80","#083d7f","#083c7d","#083b7c","#083a7a","#083979","#083877","#083776","#083674","#083573","#083471","#083370","#08326e","#08316d","#08306b"]
                .range(['#86c2ff', '#08306b'])
                .domain(d3.extent(dataset.map((d) => +d[cVar])));
            var country = dataset.filter((da) => da.country === d.properties.name);
            if (country.length === 0) {
                color = lb_lightGrey;
            } else {
                color = colorScale(country[0][cVar]);
            }


            const index = countries.indexOf(name);
            if (index > -1) {
                countries.splice(index, 1);
            }
            dataChange(false);
            changeColor(d, color);



        }
    }



}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////
/// AUXILIARY METHODS                                                                                      ///
//////////////////////////////////////////////////////////////////////////////////////////////////////////////

function addZoom() {
    d3.select('#geo')
        .selectAll('svg')
        .call(d3.zoom().scaleExtent([0.25, 8]).on('zoom', zoomed));
}

function zoomed({ transform }) {
    d3.select('#geo')
        .selectAll('svg')
        .selectAll('path')
        .attr('transform', transform);
}
function calculateFill(dataItem, i) {
    return lb_cyan;
}

// function addCountry(country) {
//     var node = document.createElement("LI");
//     var textnode = document.createTextNode(country);
//     node.appendChild(textnode);
//     document.getElementById("myList").appendChild(node);
// }

// function removeCountry(country) {
//     var list = document.getElementById("myList");
//     list.removeChild(list.childNodes[countries.indexOf(country)]);
// }


function changeColor(d, color) {
    var name;

    name = Object.keys(d).includes('countries') ? d.countries.split(", ") : d.properties.name;
    // console.log(name);


    console.log(d);

    const paths = () =>
        d3
            .select('div#geo')
            .selectAll('path')
            .filter((c) => {
                if (name === c.properties.name) {

                    return c;
                }
            })
            .style('fill', color);


    const circles = d3.select('div#scatter').selectAll('circle');

    circles
        .filter((c) => {
            if (c.countries.includes(name)) {
                paths();
                return c;
            }
        })
        .transition()
        .duration(300)
        .style('fill', color)

    const rects = d3.select('div#bar').selectAll('rect');

    rects
        .filter((c) => {
            if (c.countries.includes(name)) {
                paths();
                return c;
            }
        })
        .transition()
        .duration(300)
        .style('fill', color);

    const outliers = d3.select('div#box').selectAll('circle');

    outliers
        .filter((c) => {
            if (c.countries.includes(name)) {
                paths();
                return c;
            }
        })
        .transition()
        .duration(300)
        .style('fill', color)

}

function dataChange(country) {
    if (country !== false) {
        d3.csv(main_data)
            .then((data) => {
                newData = data;
                newData = data.filter(function (d) {
                    // console.log(d);
                    for (let i = 0; i < countries.length; i++) {
                        if (d.countries.includes(countries[i])) {
                            // console.log(d);
                            return d;
                        }
                    }
                });

                newData = newData.filter(function (d) {
                    return d["nr_of_ratings"] = d["nr_of_ratings"] / 1000;
                });
                createScatterPlot(newData, true);
            })
            .catch((error) => {
                console.log(error);
            });
    }
    else {
        d3.csv(main_data)
            .then((data) => {
                newData = data;
                main_dataset = data;
                main_dataset = main_dataset.filter(function (d) {
                    return d["nr_of_ratings"] = d["nr_of_ratings"] / 1000;
                });
                createScatterPlot(main_dataset, true);
            })
            .catch((error) => {
                console.log(error);
            });
    }
}

function axisChange(axis) {

    if (axis === "runtime")
        y_var = y_var1;
    else
        y_var = y_var2;
    createScatterPlot(main_dataset, true);

}


