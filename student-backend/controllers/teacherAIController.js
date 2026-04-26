const { GoogleGenerativeAI } = require("@google/generative-ai");
const Student = require("../models/Student");

exports.generateTeacherAIResponse = async (req, res) => {
  try {
    // 1. Enforce strict role security (Headers check)
    const role = req.headers['x-user-role'];
    if (role !== 'teacher') {
      return res.status(403).json({ 
        message: "Forbidden Access. Only verified Teachers can connect to the Global AI Assistant." 
      });
    }

    const { message } = req.body;
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return res.status(400).json({ 
        message: "Google AI API Key is missing. Check backend .env configuration." 
      });
    }

    // 2. Fetch the entire classroom dataset holistically
    const students = await Student.find({});
    
    const totalStudents = students.length;
    const slowLearnersCount = students.filter(s => s.marks < 50 || s.status === 'slow learner').length;
    const avgMarks = totalStudents > 0 ? (students.reduce((acc, curr) => acc + curr.marks, 0) / totalStudents).toFixed(1) : 0;
    
    // Abstract the names out to protect privacy optionally, but here we can feed the models the names safely if requested.
    const classSummary = `Class Size: ${totalStudents}. 
Average Marks: ${avgMarks}%. 
Slow Learners Identified: ${slowLearnersCount}.
Class Roster Context: ${students.map(s => `${s.name} (Marks: ${s.marks}%, Attendance: ${s.attendance}%)`).join(', ')}`;

    // Initialize AI
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const systemPrompt = `You are the ultimate Global Teacher AI Assistant. You have full analytical access to the entire classroom.
Classroom Data Digest:
${classSummary}

Analyze this data holistically. If the teacher asks about overall performance, improvement strategies, classroom routines, or handling weak students, provide sharp, deeply insightful, encouraging, and data-backed guidance. Format the response cleanly.`;

    const fullPrompt = `${systemPrompt}\n\nTeacher Request: ${message}`;

    // Call the model utilizing explicit robust content payload
    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: fullPrompt }] }]
    });
    
    const responseText = result.response.text();

    return res.status(200).json({ reply: responseText });

  } catch (err) {
    console.error("Global AI System Error details:", err);
    return res.status(500).json({ 
      message: "The Global Teacher AI encountered a critical error analyzing the classroom data.",
      error: err.message || "Unknown error"
    });
  }
};
