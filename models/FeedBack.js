import mongoose from "mongoose";

const feedBackSchema = new mongoose.Schema({
  movie: { type: mongoose.Types.ObjectId, ref: "Movie" },
  user: { type: mongoose.Types.ObjectId, ref: "User" },
  rating: { type: Number },
  review: { type: String },
});

export default mongoose.model("FeedBack", feedBackSchema);
