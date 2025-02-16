import express from "express"; 
import {getMessage, sendMessage} from "../controllers/message-controller.js"
import { isAuthenticated } from "../middlewares/auth-mid.js";
import {upload} from "../middlewares/multer-mid.js";

const router = express.Router();

router.route('/send/:id').post(isAuthenticated, sendMessage);
router.route('/all/:id').get(isAuthenticated, getMessage);

export default router;