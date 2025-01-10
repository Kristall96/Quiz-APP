import { Router } from "express";
import {
  getHome,
  getAbout,
  getContact,
  getUserPanel,
  getRegister,
  getLogin,
  get404,
} from "../controllers/pageController.js";

const router = Router();

router.get("/", getHome);
router.get("/about", getAbout);
router.get("/contact", getContact);
router.get("/user-panel", getUserPanel);
router.get("/register", getRegister);
router.get("/login", getLogin);
router.use("*", get404);

export default router;
