const express = require("express");
const app = express();
const connectDB = require("./config/db");
const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/users");
const documentRoutes = require("./routes/document");
const categoryRoutes = require("./routes/category");
const subjectRoutes = require("./routes/subject");
const typefileRoutes = require("./routes/typefile");
const favoriteRoutes = require("./routes/favorite");
const downloadRoutes = require("./routes/download");
const questionRoutes = require("./routes/question");
const examRoutes = require("./routes/exam");
const reportRoutes = require("./routes/report");
const statisticRoutes = require("./routes/statistic");
const notificationRoutes = require("./routes/notification");
const cors = require("cors");
const cookieParser = require("cookie-parser");

// Sử dụng cookie-parser
app.use(cookieParser());
// Kết nối tới MongoDB
connectDB();

// Khởi tạo ứng dụng Express

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(
  cors({
    origin: ["http://localhost:3000", "http://localhost:3004"],
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

app.use("/auth", authRoutes);
app.use("/users", userRoutes);
app.use("/documents", documentRoutes);
app.use("/typefile", typefileRoutes);
app.use("/subject", subjectRoutes);
// app.use("/v2", uploadRoutes);
app.use("/category", categoryRoutes);
app.use("/favorite", favoriteRoutes);
app.use("/download", downloadRoutes);
app.use("/questions", questionRoutes);
app.use("/exams", examRoutes);
app.use("/report", reportRoutes);
app.use("/statistic", statisticRoutes);
app.use("/notification", notificationRoutes);

// Routes

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
