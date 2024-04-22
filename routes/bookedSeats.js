import express from "express";
import { createBookedSeats, getBookedSeatsByParams, removeBookedSeats, updateBookedSeats } from "../controllers/BookedSeatsController.js";

const bookedSeatsRouter = express.Router();

bookedSeatsRouter.get("/getBookedSeatsByParams", getBookedSeatsByParams);
bookedSeatsRouter.post("/createBookedSeats", createBookedSeats);
bookedSeatsRouter.put("/updateBookedSeats", updateBookedSeats);
bookedSeatsRouter.delete("/removeBookedSeats", removeBookedSeats);

export default bookedSeatsRouter;