import express from "express";
import {
  addMovie,
  // deleteAllMovies,
  filterMoviesByGenre,
  getAllMovies,
  getMovieById,
  ratingMovie,
  reviewMovie,
  searchMovies,
  sortMoviesByGenre,
} from "../controllers/movieController.js";

const movieRouter = express.Router();

movieRouter.post("/", addMovie);
movieRouter.get("/getAllMovie", getAllMovies);
movieRouter.get("/search", searchMovies);
movieRouter.get("/sort-by-genre", sortMoviesByGenre);
movieRouter.get("/filter-by-genre", filterMoviesByGenre);
movieRouter.post("/:id/rating", ratingMovie);
movieRouter.post("/:id/review", reviewMovie);
movieRouter.get("/:id", getMovieById);
// movieRouter.delete("/deleteAll", deleteAllMovies);

export default movieRouter;
