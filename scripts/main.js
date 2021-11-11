var movies_dataset;
//var countries_dataset;
var decades_dataset;

//Colors to use
lb_orange = "#ff8000";
lb_green = "#00e054";
lb_cyan = "#40bcf4";
lb_fontColor = "#f1f3f5";
lb_grey = "#2c3440";
lb_black = "#14181c";
lb_lightGrey = "#678";


var svg_radar_chart;
var svg_scatterplot;
var svg_map;
var svg_circular;
var svg_bar;


var width_radar_chart = 500;

var width_col_1 = window.innerWidth * 0.28;
var width_col_2 = window.innerWidth * 0.15;
var width_radar_chart = window.innerWidth * 0.32;
var width_col_4 = window.innerWidth * 0.25 - 20;

var height_row_1 = window.innerHeight - 30;
var height_row_2 = height_row_1 / 2;

//permanent list of genres to acess later
var genreList = [];

// define counter that holds count for each genre
var movies_per_genre = {};

// define counter that holds count for each country
var movies_per_country = {};

// define counter that holds count for each genre
var movies_per_director = {};

// define counter that holds count for each genre
var movies_per_actor = {};

var bar_chart_data = {};

// color associated to each genre
var color_scale = {
    "Action": "#D5294E",
    "Adventure": "#6A3D9A",
    "Animation": "#33A02C",
    "Comedy": "#e55e4b",
    "Crime": "#b15928",
    "Documentary": "#FF7F00",
    "Drama": "#59e397",
    "Family": "#FB9A99",
    "Fantasy": "#CA709F",
    "History": "#CAB2D6",
    "Horror": "#1F78B4",
    "Music": "#B2DF8A",
    "Mystery": "#A6CEE3",
    "Romance": "#FDBF6F",
    "Science-Fiction": "#183517",
    "Thriller": "#F1E833",
    //TODO meter 3 cores novas
    "Tv-movie": "#FDBF6F",
    "War": "#183517",
    "Western": "#F1E833"
}

// filters
var filters = {
    genres: [],
    countries: [],
    directors: [],
    actors: [],
    years: [1924, 2021]
}

d3.dsv(',', "data/movie_data.csv").then(function (data) {

    data.forEach(function (d) {

        d.length = parseInt(d.length);
        d.rating = parseFloat(d.rating);
        d.nr_of_ratings = parseInt(d.nr_of_ratings);
        d.year = parseInt(d.year);

        d.genres = d.genres.split(",");
        d.countries = d.countries.split(",");
        d.directors = d.directors.split(",");
        d.actors = d.actors.split(",");

        for (var i = 0; i < d.genres.length; i++) {
            d.genres[i] = d.genres[i].trim();
            if (filters["genres"].indexOf(d.genres[i]) < 0) {
                filters["genres"].push(d.genres[i]);
                genreList.push(d.genres[i]);
            }
        }
        for (var i = 0; i < d.countries.length; i++) {
            d.countries[i] = d.countries[i].trim();
            if (filters["countries"].indexOf(d.countries[i]) < 0) {
                filters["countries"].push(d.countries[i]);
            }
        }
        for (var i = 0; i < d.directors.length; i++) {
            d.directors[i] = d.directors[i].trim();
            if (filters["directors"].indexOf(d.directors[i]) < 0) {
                filters["directors"].push(d.directors[i]);
            }
        } for (var i = 0; i < d.actors.length; i++) {
            d.actors[i] = d.actors[i].trim();
            if (filters["actors"].indexOf(d.actors[i]) < 0) {
                filters["actors"].push(d.actors[i]);
            }
        }

        // count nr of movies for each genre
        for (var i = 0; i < d.genres.length; i++) {
            if (movies_per_genre[d.genres[i]] === undefined) {
                movies_per_genre[d.genres[i]] = 1;
            }
            else {
                movies_per_genre[d.genres[i]]++;
            }
        }

        // count nr of movies for each country
        for (var i = 0; i < d.countries.length; i++) {
            if (movies_per_country[d.countries[i]] === undefined) {
                movies_per_country[d.countries[i]] = 1;
            }
            else {
                movies_per_country[d.countries[i]]++;
            }
        }

        // count nr of movies for each director
        for (var i = 0; i < d.directors.length; i++) {
            if (movies_per_director[d.directors[i]] === undefined) {
                movies_per_director[d.directors[i]] = 1;
            }
            else {
                movies_per_director[d.directors[i]]++;
            }
        }

        // count nr of movies for each actor
        for (var i = 0; i < d.actors.length; i++) {
            if (movies_per_actor[d.actors[i]] === undefined) {
                movies_per_actor[d.actors[i]] = 1;
            }
            else {
                movies_per_actor[d.actors[i]]++;
            }
        }

        /*
        // count total gross for each year
        if (bar_chart_data[d.year] === undefined) {
            bar_chart_data[d.year] = {};
            bar_chart_data[d.year]["studios"] = {};
            bar_chart_data[d.year]["genres"] = {};
            bar_chart_data[d.year]["total_gross"] = d.worldwide_gross;
            bar_chart_data[d.year]["studios"][d.studio] = d.worldwide_gross;
            bar_chart_data[d.year]["genres"][d.Main_Genre] = d.worldwide_gross;
        }
        else {
            bar_chart_data[d.year]["total_gross"] += d.worldwide_gross;
            if (bar_chart_data[d.year]["studios"][d.studio] === undefined) {
                bar_chart_data[d.year]["studios"][d.studio] = d.worldwide_gross;
            }
            else {
                bar_chart_data[d.year]["studios"][d.studio] += d.worldwide_gross;
            }
            if (bar_chart_data[d.year]["genres"][d.Main_Genre] === undefined) {
                bar_chart_data[d.year]["genres"][d.Main_Genre] = d.worldwide_gross;
            }
            else {
                bar_chart_data[d.year]["genres"][d.Main_Genre] += d.worldwide_gross;
            }
        }*/
    })


    //blockbusters_dataset = data;
    movies_dataset = data;
    current_dataset = data;
    //nominations_dataset = data;

    gen_scatterplot();
    gen_bar_chart();
    gen_radar_chart();
    gen_genre_list();
    gen_map_chart();
    gen_year_chart();
    gen_sliders();
});


// updates current_dataset with current filters (TODO oscars filter)
function updateDataset() {
    current_dataset = movies_dataset.filter(function (d) {
        return d.year >= filters["years"][0] && d.year <= filters["years"][1] &&
            containsGenres(d) && containsCountries(d) && containsDirectors(d) && containsActors(d);
    });
}

function containsGenres(d) {
    for (var i = 0; i < d.genres.length; i++) {
        if (filters["genres"].includes(d.genres[i])) {
            return true;
        }
    }
    return false;
}

function containsCountries(d) {
    for (var i = 0; i < d.countries.length; i++) {
        if (filters["countries"].includes(d.countries[i])) {
            return true;
        }
    }
    return false;
}

function containsDirectors(d) {
    for (var i = 0; i < d.directors.length; i++) {
        if (filters["directors"].includes(d.directors[i])) {
            return true;
        }
    }
    return false;
}

function containsActors(d) {
    for (var i = 0; i < d.actors.length; i++) {
        if (filters["actors"].includes(d.actors[i])) {
            return true;
        }
    }
    return false;
}

function getAllGenres() {
    return genreList.sort(d3.ascending);
}

function getCurrentMovies() {
    var titles = [];
    current_dataset.forEach(function (d) {
        titles.push(d.title);
    })
    return titles;
}

function measureText(pText, pFontSize, pStyle) {
    var lDiv = document.createElement('div');

    document.body.appendChild(lDiv);

    if (pStyle != null) {
        lDiv.style = pStyle;
    }
    lDiv.style.fontSize = "" + pFontSize + "px";
    lDiv.style.position = "absolute";
    lDiv.style.left = -1000;
    lDiv.style.top = -1000;

    lDiv.innerHTML = pText;

    const width = lDiv.clientWidth

    document.body.removeChild(lDiv);
    lDiv = null;

    return width;
}
