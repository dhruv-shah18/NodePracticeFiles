const express = require('express');
const router = express.Router();
const {
  getAllTasks,
  createTask,
  updateTask,
  deleteTask,
  getAllCompletedTask,
  getAllPriorityTask,
  getAllImpTask,
  getAllUser,
  getUserTaskSummary,
  getUserById,
  getAllSummary
} = require('../controllers/taskController');

router.get('/alltasks', getAllTasks);
// router.get('/alltasks/:pagination/:page/:limit', getAllTasks); 
router.get('/admin', getAllUser);
router.get('/admin/summary', getUserTaskSummary);
router.get('/admin/usertask/summary', getAllSummary);
router.get('/admin/:id', getUserById);
router.get('/imptasks', getAllImpTask);
router.get('/prioritytask', getAllPriorityTask);
router.get('/completedtask', getAllCompletedTask);
router.post('/addnewtask', createTask);
router.put('/updatetask', updateTask);
router.delete('/deletetask/:id', deleteTask);

module.exports = router;
