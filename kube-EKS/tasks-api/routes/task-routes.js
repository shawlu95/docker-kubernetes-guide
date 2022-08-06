const express = require('express');

const taskActions = require('../controllers/task-actions');

const router = express.Router();

router.get('/tasks', taskActions.getTasks);

router.post('/tasks', taskActions.createTask);

router.delete('/tasks/:id', taskActions.deleteTask);

module.exports = router;