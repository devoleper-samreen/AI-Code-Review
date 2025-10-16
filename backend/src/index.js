import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import passport from "./config/passport.js";
import authRoutes from "./routes/auth.routes.js";
import reposRoute from "./routes/repo.route.js";
import webhookRoute from "./routes/webhook.route.js";
import prRoute from "./routes/pr.route.js";
import analyticsRoute from "./routes/analytics.route.js";


dotenv.config()
const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({
  origin: process.env.FRONTEND_URL || "http://localhost:3000",
  credentials: true,
}));
app.use(passport.initialize());

app.use("/github", express.raw({ type: "application/json" }), webhookRoute);

app.use(express.json());
app.use("/auth", authRoutes);
app.use("/repos", reposRoute);
app.use("/reviews", prRoute);
app.use("/analytics", analyticsRoute);

app.listen(PORT, () => {
  console.log(`Server is running on ${PORT}`);
});

console.log("🔍 Using Redis URL:", process.env.REDIS_URL);

