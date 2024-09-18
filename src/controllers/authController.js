const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const RefreshToken = require("../models/refreshtoken");

async function login(req, res) {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(401)
        .json({ message: "Email hoặc mật khẩu không chính xác." });
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res
        .status(401)
        .json({ message: "Email hoặc mật khẩu không chính xác." });
    }

    const accessToken = jwt.sign(
      { userId: user._id },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "2h" }
    );

    const refreshToken = jwt.sign(
      { userId: user._id },
      process.env.REFRESH_TOKEN_SECRET
    );

    const newRefreshToken = new RefreshToken({
      userId: user._id,
      token: refreshToken,
    });
    await newRefreshToken.save();

    // Lưu accessToken và refreshToken vào cookies
    res.cookie("accessToken", accessToken, {
      httpOnly: false,
      secure: process.env.NODE_ENV === "production", // Chỉ dùng HTTPS ở môi trường production
      sameSite: "Strict",
      maxAge: 2 * 60 * 60 * 1000, // 2 giờ
    });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Strict",
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 ngày
    });

    const { password: userPassword, ...userInformation } = user.toObject();

    res.cookie("user", JSON.stringify(userInformation), {
      httpOnly: false, // Cho phép truy cập từ client-side, nếu cần thiết
      secure: process.env.NODE_ENV === "production",
      sameSite: "Strict",
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 ngày
      path: "/",
    });

    res.json({
      message: "Đăng nhập thành công.",
      data: userInformation,
      accessToken,
    });
  } catch (error) {
    console.error("Error during login:", error);
    res
      .status(500)
      .json({ message: "Đã xảy ra lỗi trong quá trình đăng nhập." });
  }
}

//register
async function register(req, res) {
  const { username, email, password, role, phone } = req.body;
  const fullName = "";
  const dateOfBirth = null;
  const address = "";
  try {
    let existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      email,
      password: hashedPassword,
      role,
      username,
      phone,
      fullName,
      address,
      dateOfBirth,
    });

    await newUser.save();

    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.error("Error during registration:", error);
    res.status(500).json({
      message: "Đã xảy ra lỗi trong quá trình đăng ký.",
      error: error.message,
    });
  }
}

//logout
const logout = async (req, res) => {
  const { refreshToken } = req.cookies;

  if (!refreshToken) {
    return res.status(400).json({ message: "Không tìm thấy refresh token." });
  }

  try {
    // Xóa refresh token khỏi database
    await RefreshToken.findOneAndDelete({ token: refreshToken });

    // Xóa cookie
    res.clearCookie("accessToken", { path: "/" });
    res.clearCookie("refreshToken", { path: "/" });
    res.clearCookie("user", { path: "/" });

    return res.status(200).json({ message: "Đăng xuất thành công." });
  } catch (error) {
    console.error("Error during logout:", error);
    return res.status(500).json({ message: "Đã xảy ra lỗi khi đăng xuất." });
  }
};

async function refreshToken(req, res) {
  const { refreshToken } = req.cookies; // Lấy refresh token từ cookie

  if (!refreshToken) {
    return res.status(401).json({ message: "Không có refresh token." });
  }

  try {
    // Kiểm tra refresh token trong database
    const tokenDoc = await RefreshToken.findOne({ token: refreshToken });
    if (!tokenDoc) {
      return res.status(403).json({ message: "Refresh token không hợp lệ." });
    }

    // Xác minh refresh token
    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
      if (err) {
        return res.status(403).json({ message: "Refresh token hết hạn." });
      }

      // Tạo accessToken mới
      const newAccessToken = jwt.sign(
        { userId: user.userId },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: "2h" }
      );

      // Gửi accessToken mới về client
      res.cookie("accessToken", newAccessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "Strict",
        maxAge: 2 * 60 * 60 * 1000, // 2 giờ
      });

      res.json({ accessToken: newAccessToken });
    });
  } catch (error) {
    res.status(500).json({ message: "Đã xảy ra lỗi khi làm mới token." });
  }
}

module.exports = { login, register, logout, refreshToken };
