import express from 'express'; 
import { verifyJWT } from '../middlewares/auth.middlewares.js';


const router = express.Router();
router.get('/verifyLogin',verifyJWT, (req, res) => {
    res.status(200).json({ message: 'User is Logged in' });
}); 
export default router;
