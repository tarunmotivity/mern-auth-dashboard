import express from "express";
import { registerUser, loginUser } from "../controllers/authController.js";
import { protect, authorize } from "../middleware/authMiddleware.js";
import { getUsers } from "../controllers/authController.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get(
  "/admin",
  protect,
  authorize("admin"),
  (req, res) => {
    res.json({
      message: "Welcome Admin!",
      user: req.user
    });
  }
);

router.get("/profile", protect, (req, res) => {
  res.json({
    message: "Protected profile accessed",
    user: req.user,
  });
});
router.get("/users", protect, authorize("admin"), getUsers);


export default router;

