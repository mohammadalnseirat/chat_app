import express from "express";
import { verifyToken } from "../middlewares/auth.middleware.js";
import {
  getAllContactsForDmList,
  searchContacts,
} from "../controllers/contact.controller.js";

const router = express.Router();

router.post("/search-contacts", verifyToken, searchContacts);
router.get("/get-contacts-dm", verifyToken, getAllContactsForDmList);

export default router;
