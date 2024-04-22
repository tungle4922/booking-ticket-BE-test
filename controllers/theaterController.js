import Theater from '../models/Theater.js'

export const getAllTheaters = async (req, res) => {
    try {
        // Lấy tất cả các rạp chiếu phim từ cơ sở dữ liệu
        const theaters = await Theater.find();

        // Kiểm tra xem có rạp nào không
        if (theaters.length === 0) {
            return res.status(404).json({ message: 'Không tìm thấy rạp chiếu phim.' });
        }

        // Trả về danh sách các rạp chiếu phim
        res.status(200).json({ theaters });
    } catch (error) {
        // Xử lý lỗi nếu có
        console.error('Lỗi khi lấy danh sách rạp chiếu phim:', error);
        res.status(500).json({ message: 'Đã xảy ra lỗi khi lấy danh sách rạp chiếu phim.' });
    }
};

export async function findTheaterByName(req, res) {
    const { name } = req.query;

    try {
        const theater = await Theater.findOne({ name });

        if (theater) {
            return res.status(200).json(theater);
        } else {
            return res.status(404).json({ message: "Theater not found" });
        }
    } catch (error) {
        console.error("Error finding theater by name:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
}
