import { Router } from "express";
import { refreshAccessToken } from "../../../controllers/refreshControllers.js";

const router = Router();

// @route  POST api/v1/refresh
// @desc   sign new accessToken using a valid refreshToken
// @access public
router.post("/", (req, res) => {
  refreshAccessToken(req, res);
});

export default router;
