
import BookedSeats from '../models/BookedSeats.js';
import User from '../models/User.js';
import Theater from '../models/Theater.js';
import jwt from "jsonwebtoken";

export const getBookedSeatsByParams = async (req, res) => {
    try {
        // Lấy thông tin từ request
        const { movieId, showTime, theaterId } = req.query;

        const _token = req.headers.authorization || "";
        const token = _token.split(" ")[1];

        if (!token) {
            return res
                .status(401)
                .json({ status: "error", message: "Token is missing" });
        }

        // Giải mã token
        const decodedToken = jwt.verify(token, process.env.SECRET_KEY || "");
        if (decodedToken && decodedToken.email) {
            // Tìm kiếm người dùng bằng email từ token
            const user = await User.findOne({ email: decodedToken.email });

            if (!user) {
                return res
                    .status(404)
                    .json({ status: "error", message: "User not found" });
            }
        }
        if (!movieId || !showTime || !theaterId) {
            return res.status(400).json({ message: 'Missing required parameters' });
        }

        // Tìm các booked seats dựa trên các thông tin truy vấn
        const bookedSeats = await BookedSeats.find({ movieId, showTime, theaterId });

        if (!bookedSeats) {
            return res.status(404).json({ message: 'No booked seats found' });
        }

        // Trả về booked seats
        res.status(200).json({ bookedSeats });
    } catch (error) {
        console.error('Error retrieving booked seats:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};
export const createBookedSeats = async (req, res) => {
    try {
        // Lấy thông tin từ request
        const { movieId, showTime, bookedSeats, theaterId } = req.body;

        const _token = req.headers.authorization || "";
        const token = _token.split(" ")[1];

        if (!token) {
            return res
                .status(401)
                .json({ status: "error", message: "Token is missing" });
        }

        // Giải mã token
        const decodedToken = jwt.verify(token, process.env.SECRET_KEY || "");
        if (!decodedToken || !decodedToken.email) {
            return res
                .status(403)
                .json({ status: "error", message: "Unauthorized access" });
        }

        const theater = await Theater.findById(theaterId);
        if (!theater) {
            return res
                .status(404)
                .json({ status: "error", message: "Theater not found" });
        }

        // Tạo mới bản ghi bookedSeats
        const newBookedSeats = new BookedSeats({
            movieId,
            showTime,
            bookedSeats,
            theaterId,
            cinemaLocation: theater.location
        });

        // Lưu bookedSeats vào cơ sở dữ liệu
        await newBookedSeats.save();

        // Trả về kết quả
        res.status(201).json({ message: "Booked seats created successfully", bookedSeats: newBookedSeats });
    } catch (error) {
        console.error('Error creating booked seats:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};


export const updateBookedSeats = async (req, res) => {
    try {
        // Lấy thông tin từ request
        const { movieId, showTime, theaterId, bookedSeats } = req.body;

        const _token = req.headers.authorization || "";
        const token = _token.split(" ")[1];

        if (!token) {
            return res
                .status(401)
                .json({ status: "error", message: "Token is missing" });
        }

        // Giải mã token
        const decodedToken = jwt.verify(token, process.env.SECRET_KEY || "");
        if (decodedToken && decodedToken.email) {
            // Tìm kiếm người dùng bằng email từ token
            const user = await User.findOne({ email: decodedToken.email });

            if (!user) {
                return res
                    .status(404)
                    .json({ status: "error", message: "User not found" });
            }
        }

        // Kiểm tra xem bookedSeats đã tồn tại chưa
        let bookedSeatsRecord = await BookedSeats.findOne({ movieId, showTime, theaterId });

        if (!bookedSeatsRecord) {
            return res.status(404).json({ status: "error", message: "Booked seats not found" });
        }

        // Cập nhật trường bookedSeats
        bookedSeatsRecord.bookedSeats.push(...bookedSeats);

        // Lưu cập nhật
        await bookedSeatsRecord.save();

        res.status(200).json({ status: "success", message: "Booked seats updated successfully" });
    } catch (error) {
        console.error('Error updating booked seats:', error);
        res.status(500).json({ status: "error", message: "Internal Server Error" });
    }
};

export const removeBookedSeats = async (req, res) => {
    try {
        // Lấy thông tin từ request
        const { movieId, showTime, theaterId, bookedSeats } = req.body;

        const _token = req.headers.authorization || "";
        const token = _token.split(" ")[1];

        if (!token) {
            return res
                .status(401)
                .json({ status: "error", message: "Token is missing" });
        }

        // Giải mã token
        const decodedToken = jwt.verify(token, process.env.SECRET_KEY || "");
        if (decodedToken && decodedToken.email) {
            // Tìm kiếm người dùng bằng email từ token
            const user = await User.findOne({ email: decodedToken.email });

            if (!user) {
                return res
                    .status(404)
                    .json({ status: "error", message: "User not found" });
            }
        }

        // Tìm bản ghi bookedSeats
        let bookedSeatsRecord = await BookedSeats.findOne({ movieId, showTime, theaterId });

        if (!bookedSeatsRecord) {
            return res.status(404).json({ status: "error", message: "Booked seats not found" });
        }
        // Lọc ra các ghế cần xóa khỏi mảng bookedSeats
        bookedSeatsRecord.bookedSeats = bookedSeatsRecord.bookedSeats.filter(seat => !bookedSeats.includes(seat));

        // Lưu cập nhật
        await bookedSeatsRecord.save();

        res.status(200).json({ status: "success", message: "Booked seats updated successfully" });
    } catch (error) {
        console.error('Error removing booked seats:', error);
        res.status(500).json({ status: "error", message: "Internal Server Error" });
    }
};


