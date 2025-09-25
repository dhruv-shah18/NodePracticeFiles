const express = require('express');
const router = express.Router();
const {
  getAllTasks,
  createTask,
  updateTask,
  deleteTask,
  getAllCompletedTask,
  getAllPriorityTask,
  getAllImpTask
} = require('../controllers/taskController');

router.get('/alltasks', getAllTasks);
router.get('/imptasks', getAllImpTask);
router.get('/prioritytask', getAllPriorityTask);
router.get('/completedtask', getAllCompletedTask);
router.post('/addnewtask', createTask);
router.put('/updatetask', updateTask);
router.delete('/deletetask/:id', deleteTask);

module.exports = router;
