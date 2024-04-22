import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import Admin from "../models/Admin.js";
import Movie from "../models/Movie.js";

export const addMovie = async (req, res, next) => {
  if (!req.headers.authorization) {
    return res.status(401).json({ message: "Authorization header is missing" });
  }

  const extractedToken = req.headers.authorization.split(" ")[1];
  if (!extractedToken || extractedToken.trim() === "") {
    return res.status(404).json({ message: "Token Not Found" });
  }

  let adminId;

  // Verify token
  jwt.verify(extractedToken, process.env.SECRET_KEY, (err, decrypted) => {
    if (err) {
      return res.status(400).json({ message: `${err.message}` });
    } else {
      adminId = decrypted.id;
      return;
    }
  });

  // Create new movie
  const {
    title,
    director,
    genre,
    releaseDate,
    duration,
    rating,
    cast,
    plot,
    reviews,
    ticketPrice,
    theaters,
    image,
  } = req.body;

  // Check for missing or empty required fields
  if (
    !title ||
    title.trim() === "" ||
    !director ||
    director.trim() === "" ||
    !genre ||
    genre.length === 0 ||
    !releaseDate ||
    !duration ||
    !image ||
    image.trim() === "" ||
    !cast ||
    cast.length === 0 ||
    !plot ||
    plot.trim() === "" ||
    !ticketPrice
  ) {
    return res.status(422).json({ message: "Invalid Inputs" });
  }

  let movie;
  try {
    movie = new Movie({
      title,
      director,
      genre,
      releaseDate: new Date(releaseDate),
      duration,
      rating,
      cast,
      plot,
      reviews,
      ticketPrice,
      theaters,
      image,
    });

    const session = await mongoose.startSession();
    session.startTransaction();
    await movie.save({ session });

    const adminUser = await Admin.findById(adminId);
    if (!adminUser) {
      await session.abortTransaction();
      session.endSession();
      return res.status(404).json({ message: "Admin not found" });
    }

    adminUser.addedMovies.push(movie);
    await adminUser.save({ session });
    await session.commitTransaction();
    session.endSession();
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Request Failed" });
  }

  if (!movie) {
    return res.status(500).json({ message: "Request Failed" });
  }

  return res.status(201).json({ movie });
};

export const searchMovies = async (req, res) => {
  try {
    // Lấy từ khóa tìm kiếm từ yêu cầu của người dùng
    const keyword = req.query.keyword;

    // Kiểm tra xem từ khóa tìm kiếm có được cung cấp hay không
    if (!keyword) {
      return res.status(400).json({ message: "Keyword is required" });
    }

    // Tìm kiếm các bộ phim thỏa mãn từ khóa tìm kiếm
    const movies = await Movie.find({
      $or: [
        { title: { $regex: keyword, $options: "i" } }, // Tìm kiếm theo tiêu đề không phân biệt hoa thường
        { director: { $regex: keyword, $options: "i" } }, // Tìm kiếm theo đạo diễn không phân biệt hoa thường
        { genre: { $regex: keyword, $options: "i" } }, // Tìm kiếm theo thể loại không phân biệt hoa thường
        { cast: { $regex: keyword, $options: "i" } }, // Tìm kiếm theo diễn viên không phân biệt hoa thường
        { plot: { $regex: keyword, $options: "i" } }, // Tìm kiếm theo nội dung không phân biệt hoa thường
      ],
    });

    // Trả về kết quả cho người dùng
    res.status(200).json({ movies });
  } catch (error) {
    // Xử lý lỗi nếu có
    console.error("Error searching movies:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const sortMoviesByGenre = async (req, res) => {
  try {
    // Lấy danh sách các bộ phim và sắp xếp theo trường genre
    const movies = await Movie.find().sort({ genre: 1 }); // Sắp xếp tăng dần theo trường genre

    // Trả về kết quả cho người dùng
    res.status(200).json({ movies });
  } catch (error) {
    // Xử lý lỗi nếu có
    console.error("Error sorting movies by genre:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const filterMoviesByGenre = async (req, res) => {
  try {
    // Lấy giá trị của trường genre từ yêu cầu của người dùng
    const { genre } = req.query;

    // Kiểm tra xem trường genre có được cung cấp hay không
    if (!genre) {
      return res.status(400).json({ message: "Genre is required" });
    }

    // Thực hiện lọc theo trường genre
    const movies = await Movie.find({ genre: genre });

    // Trả về kết quả cho người dùng
    res.status(200).json({ movies });
  } catch (error) {
    // Xử lý lỗi nếu có
    console.error("Error filtering movies by genre:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getAllMovies = async (req, res, next) => {
  let movies;

  try {
    movies = await Movie.find();
  } catch (err) {
    return console.log(err);
  }

  if (!movies) {
    return res.status(500).json({ message: "Request Failed" });
  }
  return res.status(200).json({ movies });
};

export const getMovieById = async (req, res, next) => {
  const id = req.params.id;
  let movie;
  try {
    movie = await Movie.findById(id);
  } catch (err) {
    return console.log(err);
  }

  if (!movie) {
    return res.status(404).json({ message: "Invalid Movie ID" });
  }

  return res.status(200).json({ movie });
};

export const ratingMovie = async (req, res, next) => {
  try {
    const movieId = req.params.id;
    const ratingValue = parseFloat(req.query.rating);

    // Tìm bộ phim theo ID
    const movie = await Movie.findById(movieId);

    if (!movie) {
      return res.status(404).json({ message: "Not found film" });
    }

    // Thêm lần rating mới vào mảng ratings của bộ phim
    movie.ratings.push({ value: ratingValue });

    // Lưu thay đổi vào cơ sở dữ liệu
    await movie.save();

    res.status(201).json({ message: "Rating Successfully", movie });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Rating Fail" });
  }
};

export const reviewMovie = async (req, res, next) => {
  try {
    const movieId = req.params.id;
    const reviewContent = req.query.content;

    // Tìm bộ phim theo ID
    const movie = await Movie.findById(movieId);

    if (!movie) {
      return res.status(404).json({ message: "Not found film" });
    }

    // Thêm đánh giá mới vào mảng reviews của bộ phim
    movie.reviews.push({ content: reviewContent });

    // Lưu thay đổi vào cơ sở dữ liệu
    await movie.save();

    res.status(201).json({ message: "Review Successfully", movie });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Review Fail" });
  }
};

// Khi nào cần thì dùng
// export const deleteAllMovies = async (req, res) => {
//   try {
//     await Movie.deleteMany({});
//     res.status(200).json({ message: "All movie data deleted successfully." });
//   } catch (error) {
//     console.error("Error deleting movie data:", error);
//     res.status(500).json({ message: "Error deleting movie data." });
//   }
// };
