# Letterboxd-Visualization

This project is a visualization of data regarding the Top 250 Narrative Features on Letterboxd. It features a variety of charts and graphs to allow users to get info on the greatest movies of all time.

It was developed as part of Instituto Superior Técnico's Visualization of Information course in 2021 using the JavaScript d3 package.

### How To Run

#### Option 1:

If you have Visual Studio Code installed you can install the extension **Live Server** availeble on the following link:

- https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer

And click in "Go Live" in lower left corner.

#### Option 2:

Alternativly, you can use python 3 to set up a server running the following command on the directory of the project where is the `index.html` file:

```
python3 -m http.server 5500
```

Go to a desired browser and go to the following link:

- http://localhost:5500/index.html

### Project Structure

 * The html file is in the main directory
 * The datasets used are in the directory `data` folder
 * The libraries are in `libs` folder 
 * The css file is in `sytle` folder
 * The code for the visualizations is in `scripts` folder