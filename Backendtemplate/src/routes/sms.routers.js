import express from 'express';
import { sendSMSToParent } from '../controllers/sms.controllers.js';

const router = express.Router();

router.post("/send-sms", sendSMSToParent);

export default router;