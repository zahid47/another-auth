import { Router } from "express";
import {
  forgotPass,
  resetPass,
} from "../../../controllers/passwordController.js";

const router = Router();

// @route  POST api/v1/password/forgot
// @desc   send a password reset link to email
// @access public
router.post("/forgot", (req, res) => {
  forgotPass(req, res);
});

// @route  POST api/v1/password/reset
// @desc   reset password
// @access public
router.post("/reset/:token", (req, res) => {
  resetPass(req, res);
});

export default router;
