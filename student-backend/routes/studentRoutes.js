const express = require('express');
const router = express.Router();
const { 
  getStudents, 
  addStudent, 
  updateStudent, 
  deleteStudent,
  generateReport,
  generatePdfReport
} = require('../controllers/studentController');

// Routes mapping
router.route('/')
  .get(getStudents)
  .post(addStudent);

router.route('/report').get(generateReport);
router.route('/report/pdf').get(generatePdfReport);

router.route('/:id')
  .put(updateStudent)
  .delete(deleteStudent);

module.exports = router;
