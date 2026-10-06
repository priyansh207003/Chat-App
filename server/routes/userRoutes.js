import express from 'express'
import { checkAuth, login, signup, updateprofile } from '../controllers/userController.js';
import { protectRoute } from '../Middleware/auth.js';



const userrouter = express.Router();
userrouter.post("/signup",signup);
userrouter.post("/login",login);
userrouter.put("/update-profile",protectRoute,updateprofile);
userrouter.get("/check",protectRoute,checkAuth);

export default userrouter;
