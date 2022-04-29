import { Router } from "express";
import { updateUser, deleteUser } from "../../../controllers/userController.js";
import protect from "../../../middlewares/protect.js";

const router = Router();

// @route  POST api/v1/user
// @desc   update user
// @access private
router.put("/", protect, (req, res) => {
    updateUser(req, res);
  });

// @route  DELETE api/v1/user
// @desc   delete a user
// @access private
router.delete("/", protect, (req, res) => {
  deleteUser(req, res);
});

export default router;
