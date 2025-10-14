import express from "express";
import { getPRReviews, getPRReviewById } from "../controllers/pr.controller.js";
import { verifyAuth } from "../middlewares/authMiddleware.js";
const router = express.Router();

router.get("/", verifyAuth, getPRReviews);
router.get("/:id", verifyAuth, getPRReviewById);

export default router;
