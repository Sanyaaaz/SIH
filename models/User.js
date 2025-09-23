const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

// Define schema
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, unique: true, required: true },
  abcId: { type: String, unique: true, sparse: true },
  role: { type: String, enum: ['student', 'industry', 'faculty'], required: true },
  password: { type: String, required: true }
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// Compare password method
userSchema.methods.comparePassword = function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
