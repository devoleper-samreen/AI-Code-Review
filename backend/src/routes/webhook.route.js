import express from "express";
import { webhookPR } from "../controllers/webhook.controller.js";

const router = express.Router();

router.post("/webhook", webhookPR);

export default router;
