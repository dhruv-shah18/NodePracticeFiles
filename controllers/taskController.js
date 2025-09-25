const Task = require("../models/Task.model");

// Example: get all tasks
const getAllImpTask = async (req, res) => {
  try {
    const result = await Task.find({ important: true, createdBy : req?.user?._id });
    res.status(200).json({ result });
  } catch (err) {
    res.status(err.status).json({ msg: err.message });
  }
};

const getAllPriorityTask = async (req, res) => {
  try {
    const result = await Task.find({ priority: "high", createdBy : req?.user?._id });
    res.status(200).json({ result });
  } catch (err) {
    res.status(err.status).json({ msg: err.message });
  }
};

const getAllCompletedTask = async (req, res) => {
  try {
    const result = await Task.find({ completed: true, createdBy : req?.user?._id });
    res.status(200).json({ result });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

const getAllTasks = async (req, res) => {
  const createdBy = req.user._id;
  try {
    const result = await Task.find({ createdBy : createdBy }).populate({ path: 'createdBy', select: '_id email' });
    res.status(200).json({ result });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

const createTask = async (req, res) => {
  const {
    taskname,
    completed = false,
    important = false,
    priority = "low",
  } = req.body;
  const createdBy = req.user.id;
  try {
    const task = await Task.create({
      taskname,
      completed,
      important,
      priority,
      createdBy 
    });
    res.status(201).json({ msg: "Task created", task });
  } catch (err) {
    res.status(400).json({ msg: err.message });
  }
};

const updateTask = async (req, res) => {
  const { _id, taskname, completed, important, priority = 'low'  } = req.body;
  try {
    const updated = await Task.findByIdAndUpdate(_id, { taskname, completed, important, priority } , { new: true });
    res.status(200).json({ msg: "Task updated", updated });
  } catch (err) {
    res.status(400).json({ msg: err.message });
  }
};

const deleteTask = async (req, res) => {
  const { id } = req.params;
  try {
    await Task.findByIdAndDelete(id);
    res.status(200).json({ msg: "Task deleted" });
  } catch (err) {
    res.status(400).json({ msg: err.message });
  }
};

module.exports = {
  getAllTasks,
  createTask,
  updateTask,
  deleteTask,
  getAllCompletedTask,
  getAllImpTask,
  getAllPriorityTask
  // Add other functions (getImportant, getPriority, etc.)
};
