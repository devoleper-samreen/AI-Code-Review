import express from "express";
import { getRepos, connectRepo, getConnectedRepos, getRepoById, disconnectRepo } from "../controllers/repo.controller.js";
import { verifyAuth } from "../middlewares/authMiddleware.js";
const router = express.Router();

router.get("/", verifyAuth, getRepos);
router.get("/connected", verifyAuth, getConnectedRepos);
router.get("/:id", verifyAuth, getRepoById);
router.post("/connect-repo", verifyAuth, connectRepo);
router.delete("/:id", verifyAuth, disconnectRepo);

export default router;
