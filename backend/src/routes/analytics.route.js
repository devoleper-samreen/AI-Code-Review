import express from "express";
import { getAnalytics } from "../controllers/analytics.controller.js";
import { verifyAuth } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/", verifyAuth, getAnalytics);

export default router;
