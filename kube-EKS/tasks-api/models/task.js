const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const taskSchema = new Schema({
  title: String,
  text: String,
  user: Schema.Types.ObjectId
})

module.exports = mongoose.model('Task', taskSchema);