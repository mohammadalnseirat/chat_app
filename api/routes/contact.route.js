import express from "express";
import { verifyToken } from "../middlewares/auth.middleware.js";
import {
  getAllContacts,
  getAllContactsForDmList,
  searchContacts,
} from "../controllers/contact.controller.js";

const router = express.Router();

router.post("/search-contacts", verifyToken, searchContacts);
router.get("/get-contacts-dm", verifyToken, getAllContactsForDmList);
router.get("/get-all-contacts", verifyToken, getAllContacts);

export default router;
