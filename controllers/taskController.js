const Task = require("../models/Task.model");
const User = require("../models/User.model");

// Example: get all tasks
const getAllImpTask = async (req, res) => {
  try {
    const result = await Task.find({
      important: true,
      createdBy: req?.user?._id,
    });
    res.status(200).json({ result });
  } catch (err) {
    res.status(err.status).json({ msg: err.message });
  }
};

const getAllPriorityTask = async (req, res) => {
  try {
    const result = await Task.find({
      priority: "high",
      createdBy: req?.user?._id,
    });
    res.status(200).json({ result });
  } catch (err) {
    res.status(err.status).json({ msg: err.message });
  }
};

const getAllCompletedTask = async (req, res) => {
  try {
    const result = await Task.find({
      completed: true,
      createdBy: req?.user?._id,
    });
    res.status(200).json({ result });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};
const getAllTasks = async (req, res) => {
  const createdBy = req.user._id;
  const pagination = req.query.pagination === "true"; // explicitly check
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 3;
  const search = req.query.search || "";

  // Build query based on user and search
  const query = { createdBy };

  if (search) {
    query.taskname = { $regex: search, $options: "i" };
  }

  try {
    const totalItems = await Task.countDocuments(query);
    console.log(query)
    let result = [];

    if (pagination) {
      result = await Task.find(query)
        .populate({ path: "createdBy", select: "_id email" })
        .skip((page - 1) * limit)
        .limit(limit);
    } else {
      result = await Task.find(query).populate({
        path: "createdBy",
        select: "_id email",
      });
    }

    res.status(200).json({
      result,
      pageInfo: {
        totalItems,
        currentPage: page,
        totalPages: Math.ceil(totalItems / limit),
        totalRows: result.length,
      },
    });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

// const getAllTasks = async (req, res) => {
//   const createdBy = req.user._id;
//   const pagination = req.query.pagination || false;
//   const page = req.query.page || 1;
//   const limit = req.query.limit || 3;
//   const search = req.query.search || "";
//   try {
//     if (search) {
//       const result = await Task.find({
//         taskname: { $regex: search, $options: "i" },
//         createdBy: createdBy,
//       }).populate({ path: "createdBy", select: "_id email" });
//       res.status(200).json({ result });
//     }
//     if (pagination) {
//       const result = await Task.find({ createdBy: createdBy })
//         .populate({ path: "createdBy", select: "_id email" })
//         .skip((page - 1) * limit)
//         .limit(limit);
//       res.status(200).json({ result : result, pageInfo : {
//         totalPages: Math.ceil(result.length / limit),
//         currentPage: page,
//         totalItems: result.length,
//       }});
//     } 
//     const result = await Task.find({ createdBy: createdBy }).populate({
//       path: "createdBy",
//       select: "_id email",
//     });
//     res.status(200).json({ result });
//   } catch (err) {
//     res.status(500).json({ msg: err.message });
//   }
// };

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
      createdBy,
    });
    res.status(201).json({ msg: "Task created", task });
  } catch (err) {
    res.status(400).json({ msg: err.message });
  }
};

const updateTask = async (req, res) => {
  const { _id, taskname, completed, important, priority = "low" } = req.body;
  try {
    const updated = await Task.findByIdAndUpdate(
      _id,
      { taskname, completed, important, priority },
      { new: true }
    );
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

const getAllUser = async(req, res) => {
  try {
    const result = await User.find({}, { password: 0, __v: 0 });
    res.status(200).json({ result });
  } catch (err) {
    res.status(500).json({ msg: `SOMETHING WENT WRONG : ${err.message}` });
  }
};

const getUserById = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await User.findById(id, { password: 0, __v: 0 });
    res.status(200).json({ result });
  } catch (err) {
    res.status(500).json({ msg: `SOMETHING WENT WRONG : ${err.message}` });
  }
};

const getUserTaskSummary = async (req, res) => {
  try {
    const result = await Task.aggregate([
      {
        $group: {
          _id: "$createdBy", // Group by user ID
          taskCount: { $sum: 1 },
        },
      },
      {
        $lookup: {
          from: "users", // name of the user collection in MongoDB
          localField: "_id",
          foreignField: "_id",
          as: "userInfo",
        },
      },
      {
        $unwind: "$userInfo",
      },
      {
        $project: {
          _id: 0,
          userId: "$userInfo._id",
          name: "$userInfo.username",
          email: "$userInfo.email",
          taskCount: 1,
        },
      },
    ]);
    res.status(200).json({ users: result });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

const getAllSummary = async (req, res) => { 
  try {
    const result = await User.find({}, { password: 0, __v: 0 });
    const taskCount = await Task.countDocuments();
    const completedTask = await Task.countDocuments({ completed: true });
    const importantTask = await Task.countDocuments({ important: true });
    const highPriorityTask = await Task.countDocuments({ priority: "high" });
    res.status(200).json({ result, tasks : { taskCount, completedTask, importantTask, highPriorityTask }});
  } catch (err) { 
    res.status(500).json({ msg: err.message });
  }
};


module.exports = {
  getAllTasks,
  createTask,
  updateTask,
  deleteTask,
  getAllCompletedTask,
  getAllImpTask,
  getAllPriorityTask,
  getAllUser,
  getUserTaskSummary,
  getUserById,
  getAllSummary
};
