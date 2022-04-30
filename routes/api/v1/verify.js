import { Router } from "express";
import {
  sendVerificationEmail,
  verifyEmail,
} from "../../../controllers/verifyEmailController.js";

const router = Router();

// @route  GET api/v1/verify/send
// @desc   verify email
// @access public
router.get("/send", (req, res) => {
  sendVerificationEmail(req, res);
});

// @route  GET api/v1/verify/:token
// @desc   verify email
// @access public
router.get("/:token", (req, res) => {
  verifyEmail(req, res);
});

export default router;
