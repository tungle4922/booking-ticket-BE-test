import express from "express";
import { findTheaterByName, getAllTheaters } from '../controllers/theaterController.js'


const theaterRouter = express.Router();

theaterRouter.get("/getAllTheater", getAllTheaters);
theaterRouter.get("/findTheaterByName", findTheaterByName);


export default theaterRouter;