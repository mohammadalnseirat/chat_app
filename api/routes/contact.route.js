import express from "express";
import { verifyToken } from "../middlewares/auth.middleware.js";
import { searchContacts } from "../controllers/contact.controller.js";

const router = express.Router();

router.post("/search-contacts", verifyToken, searchContacts);

export default router;
