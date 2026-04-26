const Student = require('../models/Student');
const PDFDocument = require('pdfkit');

// @desc    Get all students
// @route   GET /api/students
const getStudents = async (req, res) => {
  try {
    const students = await Student.find();
    res.status(200).json(students);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Add new student
// @route   POST /api/students
const addStudent = async (req, res) => {
  console.log("--- Incoming POST /api/students Request ---");
  console.log("Body payload:", req.body);
  
  const { name, className, marks, attendance } = req.body;

  if (!name || !className || marks === undefined || marks === '' || attendance === undefined || attendance === '') {
    console.error("Backend Validation Error. Missing fields:", { name, className, marks, attendance });
    return res.status(400).json({ message: 'Please provide all required fields precisely' });
  }

  try {
    const student = new Student({
      name,
      className,
      marks: Number(marks),
      attendance: Number(attendance)
    });

    console.log("Attempting to save initialized student...", student);
    const savedStudent = await student.save();
    console.log("Successfully saved to MongoDB Atlas:", savedStudent);
    res.status(201).json(savedStudent);
  } catch (error) {
    console.error("Fatal exception during database save:", error);
    res.status(400).json({ message: `Database error: ${error.message}` });
  }
};

// @desc    Update student
// @route   PUT /api/students/:id
const updateStudent = async (req, res) => {
  console.log(`--- Incoming PUT /api/students/${req.params.id} Request ---`);
  console.log("Update Body payload:", req.body);
  try {
    const student = await Student.findById(req.params.id);

    if (!student) {
      console.warn("Student not found during update.");
      return res.status(404).json({ message: 'Student not found' });
    }

    const { name, className, marks, attendance } = req.body;
    
    if (name) student.name = name;
    if (className) student.className = className;
    if (marks !== undefined && marks !== '') student.marks = Number(marks);
    if (attendance !== undefined && attendance !== '') student.attendance = Number(attendance);

    console.log("Attempting to save updated student record...", student);
    const updatedStudent = await student.save();
    console.log("Successfully updated in MongoDB Atlas:", updatedStudent);

    res.status(200).json(updatedStudent);
  } catch (error) {
    console.error("Exception during database update:", error);
    res.status(400).json({ message: `Update database error: ${error.message}` });
  }
};

// @desc    Delete student
// @route   DELETE /api/students/:id
const deleteStudent = async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);

    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    await student.deleteOne();
    res.status(200).json({ id: req.params.id, message: 'Student removed successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Download students report (CSV)
// @route   GET /api/students/report
const generateReport = async (req, res) => {
  try {
    const students = await Student.find();
    
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=\"students_report.csv\"');
    
    let csvData = 'ID,Name,Class,Marks,Attendance,Status\n';
    
    students.forEach(student => {
      const safeName = student.name.includes(',') ? `"${student.name}"` : student.name;
      const safeClass = student.className.includes(',') ? `"${student.className}"` : student.className;
      csvData += `${student._id},${safeName},${safeClass},${student.marks},${student.attendance},${student.status}\n`;
    });

    res.status(200).send(csvData);
  } catch (error) {
    console.error("Failed to generate report:", error);
    res.status(500).json({ message: 'Failed to generate report' });
  }
};

// @desc    Download students report (PDF)
// @route   GET /api/students/report/pdf
const generatePdfReport = async (req, res) => {
  try {
    const students = await Student.find();
    
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename=\"students_report.pdf\"');
    
    const doc = new PDFDocument({ margin: 50 });
    doc.pipe(res);
    
    doc.fillColor('black').fontSize(22).font('Helvetica-Bold').text('Student Performance Report', { align: 'center' });
    doc.moveDown(1.5);

    // Filter and Count using the defined criteria
    const totalStudents = students.length;
    let slowLearnersCount = 0;
    students.forEach(s => {
      if (s.marks < 40 || s.attendance < 75) slowLearnersCount++;
    });

    // Write Top Summary
    doc.fontSize(12).font('Helvetica-Bold').fillColor('#333333');
    doc.text(`Total Students Evaluated: ${totalStudents}`, 50, doc.y);
    doc.fillColor('#e11d48').text(`Total Slow Learners Identified: ${slowLearnersCount}`, 50, doc.y + 15);
    doc.moveDown(2);

    const tableTop = doc.y;
    doc.fontSize(12).font('Helvetica-Bold').fillColor('black');
    doc.text('Name', 50, tableTop);
    doc.text('Class', 200, tableTop);
    doc.text('Marks', 280, tableTop);
    doc.text('Attendance', 360, tableTop);
    doc.text('Status', 450, tableTop);
    
    doc.moveTo(50, tableTop + 15).lineTo(550, tableTop + 15).stroke();

    let yPosition = tableTop + 25;
    students.forEach((student) => {
      if (yPosition > 700) {
        doc.addPage();
        yPosition = 50;
      }
      
      const isSlow = student.marks < 40 || student.attendance < 75;
      
      if (isSlow) {
        doc.fillColor('#ef4444').font('Helvetica-Bold'); // Red highlight
      } else {
        doc.fillColor('#475569').font('Helvetica'); // Normal slate color
      }
      
      doc.text(student.name, 50, yPosition);
      doc.text(student.className, 200, yPosition);
      doc.text(`${student.marks}%`, 280, yPosition);
      doc.text(`${student.attendance}%`, 360, yPosition);
      
      if (isSlow) {
        doc.text('Slow Learner', 450, yPosition);
      } else {
        // Green color for Normal Status
        doc.fillColor('#10b981').text('Normal', 450, yPosition); 
      }
      
      yPosition += 25;
    });

    doc.end();
  } catch (error) {
    console.error("Failed to generate PDF report:", error);
    if (!res.headersSent) {
      res.status(500).json({ message: 'Failed to generate PDF report' });
    }
  }
};

module.exports = {
  getStudents,
  addStudent,
  updateStudent,
  deleteStudent,
  generateReport,
  generatePdfReport
};
