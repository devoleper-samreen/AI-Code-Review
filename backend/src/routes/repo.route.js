import express from "express";
import { getRepos } from "../controllers/repo.controller.js";
import { verifyAuth } from "../middlewares/authMiddleware.js";
const router = express.Router();

router.get("/", verifyAuth, getRepos);

export default router;
