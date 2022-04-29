import { Router } from "express";
import {
  testRoute,
  registerUser,
  loginUser,
} from "../../../controllers/authController.js";
import protect from "../../../middlewares/protect.js";

const router = Router();

// @route  GET api/v1/auth/test
// @desc   tests auth route
// @access public
router.get("/test", (_, res) => {
  testRoute(_, res);
});

// @route  POST api/v1/auth/register
// @desc   register a new user
// @access public
router.post("/register", (req, res) => {
  registerUser(req, res);
});

// @route  POST api/v1/auth/login
// @desc   log in an user / return an access token and set refresh token in httpOnly cookie
// @access public
router.post("/login", (req, res) => {
  loginUser(req, res);
});

export default router;
