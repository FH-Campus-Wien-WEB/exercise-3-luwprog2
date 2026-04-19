const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const movieModel = require("./movie-model.js");

const app = express();

// Parse urlencoded bodies
app.use(bodyParser.json());

// Serve static content in directory 'files'
app.use(express.static(path.join(__dirname, "files")));

/* Task 1.2: Add a GET /genres endpoint:
   This endpoint returns a sorted array of all the genres of the movies
   that are currently in the movie model.
*/
app.get("/genres", function (req, res) {
  let movies = Object.values(movieModel);
  /*flatMap: first map all genres, then make them flat, all in a big array
    Set: specific type of collection object. NO duplicate values.
    ...: Set is not a array, we cant use .sort() or .map(), ...will convert it back into a array[]*/
  let allGenres = movies.flatMap((movie) => movie.Genres);
  const uniqueGenres = [...new Set(allGenres)];
  const sortedGenres = uniqueGenres.sort();
  res.json(sortedGenres);
});

/* Task 1.4: Extend the GET /movies endpoint:
   When a query parameter for a specific genre is given, 
   return only movies that have the given genre
 */
app.get("/movies", function (req, res) {
  let movies = Object.values(movieModel);
  const selectedGenre = req.query.genre;

  if (selectedGenre) {
    // 修正点 1: 正确使用箭头函数 (movie) => ...
    const filteredMovies = movies.filter((movie) => {
      return movie.Genres && movie.Genres.includes(selectedGenre);
    });

    res.json(filteredMovies);
  } else {
    res.json(movies);
  }
});

// Configure a 'get' endpoint for a specific movie
app.get("/movies/:imdbID", function (req, res) {
  const id = req.params.imdbID;
  const exists = id in movieModel;

  if (exists) {
    res.send(movieModel[id]);
  } else {
    res.sendStatus(404);
  }
});

app.put("/movies/:imdbID", function (req, res) {
  const id = req.params.imdbID;
  const exists = id in movieModel;

  movieModel[req.params.imdbID] = req.body;

  if (!exists) {
    res.status(201);
    res.send(req.body);
  } else {
    res.sendStatus(200);
  }
});

app.listen(3000);

console.log("Server now listening on http://localhost:3000/");
