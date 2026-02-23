import express from "express";
import {
  createTask,
  getTasks,
  updateTask,
  deleteTask
} from "../controllers/taskController.js";
import { protect, authorize } from "../middleware/authMiddleware.js";
import { validateTask } from "../middleware/validationMiddleware.js";

const router = express.Router();


router.post("/", protect, authorize("admin"), validateTask,createTask);


router.get("/", protect, getTasks);


router.put("/:id", protect, updateTask);


router.delete("/:id", protect, authorize("admin"), deleteTask);


export default router;
