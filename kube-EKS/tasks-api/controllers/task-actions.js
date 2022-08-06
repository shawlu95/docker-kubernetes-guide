const mongoose = require('mongoose');

const Task = require('../models/task');
const { createError } = require('../helpers/error');

const getTasks = async (req, res, next) => {
  let tasks;

  try {
    tasks = await Task.find({ user: req.userId });
  } catch (err) {
    const error = createError('Failed to fetch tasks.', 500);
    return next(error);
  }

  res
    .status(200)
    .json({ tasks: tasks.map((task) => task.toObject({ getters: true })) });
};

const deleteTask = async (req, res, next) => {
  const taskId = req.params.id;
  let task;
  try {
    task = await Task.findOne({ _id: taskId });
  } catch (err) {
    const error = createError('Failed to delete task.', 500);
    return next(error);
  }

  if (task.user.toString() !== req.userId) {
    const error = createError(
      'You are not authorized to delete this task.',
      403
    );
    return next(error);
  }

  try {
    await Task.deleteOne({ _id: taskId });
  } catch (err) {
    const error = createError('Failed to delete task.', 500);
    return next(error);
  }

  res.status(200).json({ message: 'Task deleted!' });
};

const createTask = async (req, res, next) => {
  const title = req.body.title;
  const text = req.body.text;
  const newTask = new Task({
    title,
    text,
    user: mongoose.Types.ObjectId(req.userId),
  });

  let savedTask;

  try {
    savedTask = await newTask.save();
  } catch (err) {
    const error = createError('Failed to save task.', 500);
    return next(error);
  }

  res.status(201).json({ task: savedTask.toObject() });
};

exports.getTasks = getTasks;
exports.deleteTask = deleteTask;
exports.createTask = createTask;
