import express from 'express';
import {protectRoute} from '../Middleware/auth.js';
import { getMessages,getUserForSidebar, markMessageAsSeen } from '../controllers/messageController.js';

const messageRouter = express.Router();

messageRouter.get('/user',protectRoute,getUserForSidebar);
messageRouter.get('/:id',protectRoute,getMessages);
messageRouter.put('mark/:id',protectRoute,markMessageAsSeen);

export default messageRouter;