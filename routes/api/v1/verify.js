import { Router } from "express";
import { verifyEmail } from "../../../controllers/verifyEmailController.js";

const router = Router();

// @route  GET api/v1/user/me
// @desc   verify email
// @access public
router.get("/:token", (req, res) => {
  verifyEmail(req, res);
});

export default router;
