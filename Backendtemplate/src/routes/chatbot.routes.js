// src/routes/chatbot.routes.js
import { Router } from "express";
import { handleChatbotQuery } from "../controllers/chatbot.controller.js";

const router = Router();

// POST /api/v1/chatbot/query
router.route("/query").post(handleChatbotQuery);

export default router;