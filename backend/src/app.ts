import express from "express";
import cors from "cors";
import path from "path";

import authRoutes from "./routes/auth.route";
import userRoutes from "./routes/user.route";
import categoryRoutes from "./routes/category.route";
import portfolioRoutes from "./routes/portfolio.route";

const app = express();

// 1. Middleware Akses Domain/Frontend
app.use(cors());

// 2. Middleware Parsing Body Data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 3. Akses Static Folder Uploads (Supaya Foto/Video Bisa Dilihat via Browser)
// Contoh URL Akses: http://localhost:5000/uploads/images/portfolios/thumbnail-123.webp
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);

app.use("/api/categories", categoryRoutes);
app.use("/api/portfolios", portfolioRoutes);

export default app;