import { Router } from "express";
import passport from "passport";
import { githubCallbackController } from "../controllers/auth.controller.js";

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

export default router;
