import mongoose from "mongoose";

const movieSchema = new mongoose.Schema({
  title: { type: String, required: true },
  director: { type: String, required: true },
  genre: [{ type: String, required: true }], // Mảng các thể loại
  releaseDate: { type: Date, required: true }, // Đã đổi thành kiểu dữ liệu Date
  duration: { type: Number, required: true }, // Đã đổi thành kiểu dữ liệu Number
  ratings: [
    {
      value: { type: Number }, // Giá trị của rating
      createdAt: { type: Date, default: Date.now }, // Ngày và giờ tạo
    },
  ], // Đã đổi thành kiểu dữ liệu Number
  cast: [{ type: String, required: true }], // Mảng các diễn viên
  reviews: [
    {
      content: { type: String }, // Nội dung của đánh giá
      createdAt: { type: Date, default: Date.now }, // Ngày và giờ tạo
    },
  ], // Mảng các đánh giá
  plot: { type: String, required: true },
  ticketPrice: { type: Number, required: true }, // Giá vé
  theaters: [{ type: String }], // Mảng các rạp chiếu
  image: { type: String, required: true },
  bookings: [{ type: mongoose.Types.ObjectId, ref: "Booking" }],
});

export default mongoose.model("Movie", movieSchema);
