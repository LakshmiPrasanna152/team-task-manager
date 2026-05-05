const express = require('express');
const { authenticate } = require('../middlewares/auth.middleware');
const {
  createTask,
  updateTask,
  deleteTask,
  getDashboard
} = require('../controllers/task.controller');

const router = express.Router();
router.use(authenticate);

router.get('/dashboard', getDashboard);
router.post('/',         createTask);
router.put('/:id',       updateTask);
router.delete('/:id',    deleteTask);

module.exports = router;