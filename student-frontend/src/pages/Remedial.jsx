import React, { useState, useEffect } from 'react';
import { ShieldAlert, BookOpen, Clock, ArrowRight } from 'lucide-react';
import api from '../services/api';

const Remedial = () => {
  const [studentsList, setStudentsList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPlan, setSelectedPlan] = useState(null);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const res = await api.get('http://localhost:5000/api/students');
        setStudentsList(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchStudents();
  }, []);

  const showPlan = (student) => {
    console.log("showPlan called with student data:", student);
    if (!student) {
      console.error("Student data is undefined!");
      return;
    }
    setSelectedPlan(student);
    console.log("selectedPlan state successfully updated to:", student.name);
    
    // Ensure the UI is not hidden by scrolling it into view
    setTimeout(() => {
      document.getElementById('plan-container')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 100);
  };

  if (loading) return <div className="text-slate-500 animate-pulse">Loading vulnerable students...</div>;

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h2 className="text-2xl font-bold text-slate-800 dark:text-white tracking-tight">Remedial Action Center</h2>
        <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Review all student performances and formulate personalized improvement plans.</p>
      </div>

      {studentsList.length === 0 ? (
        <div className="bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-100 dark:border-emerald-900/50 rounded-2xl p-8 text-center mt-8 transition-colors">
          <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center mx-auto mb-4">
            <BookOpen size={32} />
          </div>
          <h3 className="text-lg font-bold text-emerald-800 dark:text-emerald-300">No Students Found</h3>
          <p className="text-emerald-600 dark:text-emerald-400 mt-2">There are no students in the database yet.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-6 mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {studentsList.map((student) => (
                <div key={student._id} className={`relative p-6 rounded-2xl border-2 shadow-sm transition-all duration-200 bg-white dark:bg-slate-800 ${student.marks < 50 ? 'border-red-100 hover:border-red-300 dark:border-red-900/50 dark:hover:border-red-700' : 'border-emerald-100 hover:border-emerald-300 dark:border-emerald-900/50 dark:hover:border-emerald-700'}`}>
                  <div className="absolute top-0 right-0 p-4 mt-2">
                     <div className="flex items-center gap-2">
                        <span className={`text-[10px] sm:text-xs font-bold px-2 py-1 rounded-md uppercase tracking-wider ${student.marks < 50 ? 'text-red-700 bg-red-100 dark:text-red-400 dark:bg-red-900/30' : 'text-emerald-700 bg-emerald-100 dark:text-emerald-400 dark:bg-emerald-900/30'}`}>
                          {student.marks < 50 ? "Slow Learner" : "Good Student"}
                        </span>
                        <div className={`h-2.5 w-2.5 rounded-full ${student.marks < 50 ? 'bg-red-500 animate-pulse' : 'bg-emerald-500'}`}></div>
                     </div>
                  </div>
                  
                  <h3 className="font-bold text-lg text-slate-800 dark:text-white">{student.name}</h3>
                  <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-4">Class: {student.className}</p>

                  <div className="space-y-3 mb-6">
                    <div className={`p-3 rounded-lg flex items-center gap-3 transition-colors ${student.marks < 40 ? 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400' : 'bg-slate-50 dark:bg-slate-700/50 text-slate-600 dark:text-slate-300'}`}>
                      <BookOpen size={18} />
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-wider opacity-80">Marks</p>
                        <p className="font-bold">{student.marks}%</p>
                      </div>
                    </div>
                    <div className={`p-3 rounded-lg flex items-center gap-3 transition-colors ${student.attendance < 60 ? 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400' : 'bg-slate-50 dark:bg-slate-700/50 text-slate-600 dark:text-slate-300'}`}>
                      <Clock size={18} />
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-wider opacity-80">Attendance</p>
                        <p className="font-bold">{student.attendance}%</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-3 w-full">
                    <button 
                      onClick={() => showPlan(student)} 
                      className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg border-2 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 font-bold hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                    >
                      View Plan
                    </button>
                  </div>
                </div>
            ))}
          </div>

          {/* Render plan inside a container div */}
          {selectedPlan && (
            <div id="plan-container" className="mt-4 p-6 border-2 border-red-100 dark:border-red-900/50 rounded-2xl bg-white dark:bg-slate-800 shadow-sm animate-in zoom-in-95 duration-300">
              <div className="flex justify-between items-center mb-4 border-b dark:border-slate-700 pb-4">
                <h3 className="text-xl font-bold text-slate-800 dark:text-white">Action Plan for {selectedPlan.name}</h3>
                <button onClick={() => setSelectedPlan(null)} className="text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white font-medium px-3 py-1 bg-slate-100 dark:bg-slate-700 rounded-md transition-colors">
                  Close Plan
                </button>
              </div>
              <div className="space-y-4">
                {selectedPlan.marks < 40 && (
                  <div className="p-4 bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 rounded-r-lg text-red-800 dark:text-red-300">
                    <h4 className="font-bold mb-1">Academic Intervention Required</h4>
                    <p>Schedule daily 30-minute tutoring sessions for core subjects. Monitor weekly quiz scores and provide alternative study materials.</p>
                  </div>
                )}
                {selectedPlan.attendance < 60 && (
                  <div className="p-4 bg-orange-50 dark:bg-orange-900/20 border-l-4 border-orange-500 rounded-r-lg text-orange-800 dark:text-orange-300">
                    <h4 className="font-bold mb-1">Attendance Intervention Required</h4>
                    <p>Contact parents/guardians to understand barriers to attendance. Setup weekly check-ins with school counselor.</p>
                  </div>
                )}
                {selectedPlan.marks >= 40 && selectedPlan.attendance >= 60 && (
                  <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-500 rounded-r-lg text-blue-800 dark:text-blue-300">
                    <h4 className="font-bold mb-1">General Monitoring</h4>
                    <p>Student is currently maintaining basic thresholds but assigned as slow learner. Continue standard classroom encouragement and peer-pairing.</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Remedial;
