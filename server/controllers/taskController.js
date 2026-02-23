import Task from "../models/Task.js";
import asyncHandler from "../middleware/asyncHandler.js";


export const createTask = asyncHandler(async (req, res) => {
  const { title, description, assignedTo } = req.body;

  if (!title) {
    res.status(400);
    throw new Error("Title is required");
  }

  const task = await Task.create({
    title,
    description,
    assignedTo
  });

  res.status(201).json({
    success: true,
    message: "Task created successfully",
    task
  });
});

export const getTasks = asyncHandler(async (req, res) => {
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 5;

  const skip = (page - 1) * limit;

  let query = req.user.role === "admin"
    ? {}
    : { assignedTo: req.user.id };

  const tasks = await Task.find(query)
    .populate("assignedTo", "name email")
    .skip(skip)
    .limit(limit);

  const total = await Task.countDocuments(query);

  res.json({
    success: true,
    page,
    pages: Math.ceil(total / limit),
    total,
    data: tasks
  });
});



export const updateTask = asyncHandler(async (req, res) => {
  const { status, title, description } = req.body;

  const task = await Task.findById(req.params.id);

  if (!task) {
    res.status(404);
    throw new Error("Task not found");
  }

  
  if (
    req.user.role !== "admin" &&
    task.assignedTo.toString() !== req.user.id
  ) {
    res.status(403);
    throw new Error("Not authorized to update this task");
  }

  task.title = title || task.title;
  task.description = description || task.description;
  task.status = status || task.status;

  const updatedTask = await task.save();

  res.json({
    success: true,
    message: "Task updated successfully",
    data: updatedTask
  });
});


export const deleteTask = asyncHandler(async (req, res) => {
  const task = await Task.findById(req.params.id);

  if (!task) {
    res.status(404);
    throw new Error("Task not found");
  }

  await task.deleteOne();

  res.json({
    success: true,
    message: "Task deleted successfully"
  });
});
