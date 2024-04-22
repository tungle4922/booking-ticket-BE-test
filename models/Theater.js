import mongoose from "mongoose";

// Schema cho rạp chiếu (theater)
const theaterSchema = new mongoose.Schema({
  name: { type: String, required: true }, // Tên rạp chiếu
  location: { type: String, required: true }, // Địa điểm của rạp chiếu
});

// Tạo model từ schema
export default mongoose.model('Theater', theaterSchema);

