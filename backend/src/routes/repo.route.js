import express from "express";
import { getRepos, connectRepo, getConnectedRepos } from "../controllers/repo.controller.js";
import { verifyAuth } from "../middlewares/authMiddleware.js";
const router = express.Router();

router.get("/", verifyAuth, getRepos);
router.get("/connected", verifyAuth, getConnectedRepos);
router.post("/connect-repo", verifyAuth, connectRepo);

export default router;
