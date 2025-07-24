import express from "express";
import { createAnnouncement,getAnnouncements } from "../controllers/announcecontrollers/Announcement.controller.js";

const router = express.Router();

router.post("/", createAnnouncement);
router.get("/", getAnnouncements);

export default router;
