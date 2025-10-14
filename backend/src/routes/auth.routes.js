import { Router } from "express";
import passport from "passport";
import { githubCallbackController, getCurrentUser, deleteAccount } from "../controllers/auth.controller.js";
import { verifyAuth } from "../middlewares/authMiddleware.js";

const router = Router();

router.get(
  "/github",
  passport.authenticate("github", { scope: ["user:email", "repo"] })
);

router.get(
  "/github/callback",
  passport.authenticate("github", {
    session: false,
  }),
  githubCallbackController
);

router.get("/me", verifyAuth, getCurrentUser);
router.delete("/account", verifyAuth, deleteAccount);

export default router;
