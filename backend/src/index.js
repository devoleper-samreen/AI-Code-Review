import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import passport from "./config/passport.js";
import authRoutes from "./routes/auth.routes.js";
import reposRoute from "./routes/repo.route.js";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(cors());
app.use(passport.initialize());

app.use("/auth", authRoutes);
app.use("/repos", reposRoute);

app.listen(PORT, () => {
  console.log(`Server is running on ${PORT}`);
});
