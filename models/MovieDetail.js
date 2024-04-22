const mongoose = require('mongoose')
import Theater from './Theater';

const movieSchema = new mongoose.Schema({
    title: { type: String, required: true }, // Tiêu đề phim
    director: { type: String, required: true }, // Đạo diễn
    genre: [{ type: String, required: true }], // Mảng các thể loại
    releaseDate: { type: Date, required: true }, // Ngày phát hành
    duration: { type: Number, required: true }, // Thời lượng phim (phút)
    rating: { type: Number, required: true }, // Đánh giá phim
    cast: [{ type: String, required: true }], // Mảng các diễn viên
    plot: { type: String, required: true }, // Nội dung phim
    reviews: [{ type: String, required: false }], // Mảng các đánh giá
    ticketPrice: { type: Number, required: true }, // Giá vé
    theaters: [Theater], // Mảng các rạp chiếu
    image: { type: String, required: true }, // URL hình ảnh của phim
});

// Tạo model từ schema
const Movie = mongoose.model('Movie', movieSchema);

module.exports = Movie;