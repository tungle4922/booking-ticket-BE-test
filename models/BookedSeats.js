import mongoose from "mongoose";

const bookedSeatsSchema = new mongoose.Schema({
  cinemaLocation: { type: String, required: true },
  movieId: { type: mongoose.Schema.Types.ObjectId, ref: 'Movie', required: true },
  theaterId: { type: mongoose.Schema.Types.ObjectId, ref: 'Theater', required: true },
  showTime: { type: String, required: true },
  bookedSeats: [{ type: String, required: true }]
});

export default mongoose.model('BookedSeats', bookedSeatsSchema);

