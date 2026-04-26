const express = require('express');
const router = express.Router();
const teacherAIController = require('../controllers/teacherAIController');

// POST /api/teacher-ai
router.post('/', teacherAIController.generateTeacherAIResponse);

module.exports = router;
