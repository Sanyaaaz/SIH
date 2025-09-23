const mongoose = require('mongoose');

const InternshipSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  company: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // company user id
  location: String,
  stipend: String,
  duration: String,
  postedAt: { type: Date, default: Date.now },
  applicants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
});

module.exports = mongoose.model('Internship', InternshipSchema);
