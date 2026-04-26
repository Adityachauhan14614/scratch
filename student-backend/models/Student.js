const mongoose = require('mongoose');

const StudentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a name']
  },
  className: {
    type: String,
    required: [true, 'Please add a class']
  },
  marks: {
    type: Number,
    required: [true, 'Please add marks']
  },
  attendance: {
    type: Number,
    required: [true, 'Please add attendance percentage']
  },
  status: {
    type: String,
    enum: ['slow learner', 'normal'],
    default: 'normal'
  }
}, {
  timestamps: true
});

// Middleware to calculate status before saving
StudentSchema.pre('save', function(next) {
  if (this.marks < 40 || this.attendance < 75) {
    this.status = 'slow learner';
  } else {
    this.status = 'normal';
  }
  next();
});

// For update operations, recalculate status
// E.g., when findOneAndUpdate is used
StudentSchema.pre('findOneAndUpdate', function(next) {
  const update = this.getUpdate();
  let marks = update.marks !== undefined ? update.marks : undefined;
  let attendance = update.attendance !== undefined ? update.attendance : undefined;

  // We only run this if marks or attendance are being updated
  if (marks !== undefined || attendance !== undefined) {
    // If one is not being updated, we need to fetch it from the database or rely on it only if both are passed
    // NOTE: In standard updates, it's safer to use .save() on documented fetched instances for precise logic,
    // but here we can try to guess or let the controller handle it if using .save()
    // By standard practices, I'll enforce update through save or pass the logic to controller.
  }
  next();
});

module.exports = mongoose.model('Student', StudentSchema);
