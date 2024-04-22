import jwt from "jsonwebtoken";
import User from "../models/User.js";
import bcrypt from "bcryptjs";

// Get all users
export const getAllUsers = async (req, res, next) => {
  let users;
  try {
    users = await User.find();
  } catch (error) {
    return console.log(error);
  }
  if (!users) {
    return res.status(500).json({
      message: "User not found",
    });
  }
  return res.status(200).json({ users });
};

// Sign up
export const signup = async (req, res, next) => {
  const {
    username,
    email,
    password,
    dateOfBirth,
    fullName,
    gender,
    phoneNumber,
    address,
  } = req.body;

  // Kiểm tra xem email hoặc username đã tồn tại trong cơ sở dữ liệu chưa
  const existingUser = await User.findOne({
    $or: [{ email: email }, { username: username }],
  });
  if (existingUser) {
    // Nếu email hoặc username đã tồn tại, trả về thông báo lỗi
    return res
      .status(422)
      .json({ message: "Email or username already exists" });
  }

  // Nếu email và username chưa tồn tại, tiếp tục với quy trình đăng ký bình thường
  if (
    !username.trim() ||
    !email.trim() ||
    !password.trim() ||
    !dateOfBirth.trim() ||
    !fullName.trim() ||
    !gender.trim() ||
    !phoneNumber.trim() ||
    !address.trim()
  ) {
    return res.status(422).json({ message: "Invalid Inputs" });
  }

  const hashedPassword = bcrypt.hashSync(password);
  try {
    let user = new User({
      username,
      email,
      password: hashedPassword,
      dateOfBirth,
      fullName,
      gender,
      phoneNumber,
      address,
    });
    user = await user.save();
    if (!user) {
      return res.status(500).json({ message: "Unexpected Error Occurred" });
    }
    return res.status(201).json({
      message: "Register Successful",
      user: user,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Unexpected Error Occurred" });
  }
};

// Login
export const login = async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password || email.trim() === "" || password.trim() === "") {
    return res.status(422).json({ message: "Invalid Inputs" });
  }
  let user;
  try {
    user = await User.findOne({ email });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal Server Error" });
  }

  if (!user) {
    return res
      .status(404)
      .json({ message: "Unable to find user with this email" });
  }

  const isPasswordCorrect = bcrypt.compareSync(password, user.password);

  if (!isPasswordCorrect) {
    return res.status(400).json({ message: "Incorrect Password" });
  }

  // Tạo JWT token
  // const token = jwt.sign({ email: user.email }, process.env.SECRET_KEY, {
  //   expiresIn: "7d",
  // }); // Thay 'your_secret_key' bằng một chuỗi bí mật (secret) thực tế
  const token = jwt.sign(
    { id: user.id, email: user.email },
    process.env.SECRET_KEY,
    {
      expiresIn: "7d",
    }
  );

  // Trả về token cho client
  return res.status(200).json({ message: "Login Successful", user, token });
};

// Login by token
export const loginWithToken = async (req, res) => {
  try {
    // Lấy token từ header của request
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

      return res.status(200).json({ status: "success", user });
    } else {
      console.error("Invalid token or email not found in token");
      return res
        .status(500)
        .json({ status: "error", message: "Internal server error" });
    }
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ status: "error", message: "Internal server error" });
  }
};

// Get user by id
export const getUserById = async (req, res, next) => {
  const id = req.params.id;
  let user;
  try {
    user = await User.findById(id);
  } catch (err) {
    return console.log(err);
  }
  if (!user) {
    return res.status(500).json({ message: "Unexpected Error Occured" });
  }
  return res.status(200).json({ user });
};

// Delete a user
export const deleteUser = async (req, res, next) => {
  const id = req.params.id;
  let user;
  try {
    user = await User.findByIdAndDelete(id);
  } catch (err) {
    return console.log(err);
  }
  if (!user) {
    return res.status(500).json({ message: "Something went wrong" });
  }
  return res.status(200).json({ message: "Deleted Successfully" });
};

// Update a user
// export const updateUser = async (req, res, next) => {
//   const id = req.params.id;
//   const {
//     username,
//     email,
//     fullName,
//     dateOfBirth,
//     gender,
//     phoneNumber,
//     address,
//     password,
//   } = req.body;

//   // Kiểm tra xem người dùng đã cung cấp ít nhất một trường thông tin mới để cập nhật
//   if (
//     !username &&
//     !email &&
//     !fullName &&
//     !dateOfBirth &&
//     !gender &&
//     !phoneNumber &&
//     !address &&
//     !password
//   ) {
//     return res
//       .status(422)
//       .json({ message: "At least one field is required to update" });
//   }

//   // Hash mật khẩu mới nếu được cung cấp
//   let hashedPassword;
//   if (password) {
//     hashedPassword = bcrypt.hashSync(password);
//   }

//   let user;
//   try {
//     // Xây dựng đối tượng chứa các trường thông tin mới được cập nhật
//     const updatedFields = {};
//     if (username) updatedFields.username = username;
//     if (email) updatedFields.email = email;
//     if (fullName) updatedFields.fullName = fullName;
//     if (dateOfBirth) updatedFields.dateOfBirth = dateOfBirth;
//     if (gender) updatedFields.gender = gender;
//     if (phoneNumber) updatedFields.phoneNumber = phoneNumber;
//     if (address) updatedFields.address = address;
//     if (hashedPassword) updatedFields.password = hashedPassword;

//     // Cập nhật người dùng trong cơ sở dữ liệu
//     user = await User.findByIdAndUpdate(id, updatedFields, { new: true });
//   } catch (err) {
//     console.error(err);
//     return res.status(500).json({ message: "Something went wrong" });
//   }

//   if (!user) {
//     return res.status(500).json({ message: "User not found" });
//   }

//   res.status(200).json({ message: "Updated successfully", user: user });
// };

export const updateUser = async (req, res) => {
  const id = req.params.id;
  const {
    username,
    email,
    fullName,
    dateOfBirth,
    gender,
    phoneNumber,
    address,
    password,
  } = req.body;

  // Kiểm tra xem người dùng đã cung cấp ít nhất một trường thông tin mới để cập nhật
  if (
    !username &&
    !email &&
    !fullName &&
    !dateOfBirth &&
    !gender &&
    !phoneNumber &&
    !address &&
    !password
  ) {
    return res
      .status(422)
      .json({ message: "At least one field is required to update" });
  }

  try {
    // Xác thực token
    const token =
      req.headers.authorization && req.headers.authorization.split(" ")[1];
    if (!token) {
      return res.status(401).json({ message: "Token is missing" });
    }

    const decodedToken = jwt.verify(token, process.env.SECRET_KEY);
    if (!decodedToken || !decodedToken.id) {
      return res.status(403).json({ message: "Invalid token" });
    }

    // Kiểm tra quyền truy cập
    if (decodedToken.id !== id) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    // Hash mật khẩu mới nếu được cung cấp
    let hashedPassword;
    if (password) {
      hashedPassword = bcrypt.hashSync(password);
    }

    // Xây dựng đối tượng chứa các trường thông tin mới được cập nhật
    const updatedFields = {};
    if (username) updatedFields.username = username;
    if (email) updatedFields.email = email;
    if (fullName) updatedFields.fullName = fullName;
    if (dateOfBirth) updatedFields.dateOfBirth = dateOfBirth;
    if (gender) updatedFields.gender = gender;
    if (phoneNumber) updatedFields.phoneNumber = phoneNumber;
    if (address) updatedFields.address = address;
    if (hashedPassword) updatedFields.password = hashedPassword;

    // Cập nhật người dùng trong cơ sở dữ liệu
    const updatedUser = await User.findByIdAndUpdate(id, updatedFields, {
      new: true,
    });
    if (!updatedUser) {
      return res.status(500).json({ message: "User not found" });
    }

    res
      .status(200)
      .json({ message: "Updated successfully", user: updatedUser });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Something went wrong" });
  }
};
