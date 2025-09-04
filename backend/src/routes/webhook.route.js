import express from "express";
import { webhookPR } from "../controllers/webhook.controller.js";

const router = express.Router();
console.log("I am from PR webhook route");

router.post("/webhook", webhookPR);

export default router;
