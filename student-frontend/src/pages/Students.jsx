import React, { useState, useEffect } from "react";
import { Plus, Edit2, Trash2, X } from "lucide-react";
import api from "../services/api";

const Students = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    className: "",
    marks: "",
    attendance: "",
  });

  // FETCH
  const fetchStudents = async () => {
    try {
      const res = await api.get("/students");
      setStudents(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  // OPEN ADD
  const openAddModal = () => {
    setEditingStudent(null);
    setFormData({
      name: "",
      className: "",
      marks: "",
      attendance: "",
    });
    setIsModalOpen(true);
  };

  // OPEN EDIT
  const openEditModal = (student) => {
    setEditingStudent(student);
    setFormData({
      name: student.name,
      className: student.className,
      marks: student.marks,
      attendance: student.attendance,
    });
    setIsModalOpen(true);
  };

  // DELETE
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this student?")) return;
    try {
      await api.delete(`/students/${id}`);
      fetchStudents();
    } catch (err) {
      console.error(err);
    }
  };

  // SUBMIT
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...formData,
        marks: Number(formData.marks),
        attendance: Number(formData.attendance)
      };
      if (editingStudent) {
        await api.put(`/students/${editingStudent._id}`, payload);
      } else {
        await api.post("/students", payload);
      }
      setIsModalOpen(false);
      fetchStudents();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold dark:text-white">Students</h2>
        <button onClick={openAddModal} className="btn-primary flex gap-2">
          <Plus size={16} /> Add Student
        </button>
      </div>

      {/* CARD GRID */}
      {loading ? (
        <div className="text-center py-8 text-slate-400">Loading...</div>
      ) : students.length === 0 ? (
        <div className="text-center py-8 text-slate-400">No students found.</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {students.map((s) => {
            const isSlowLearner = s.marks < 40;
            return (
              <div key={s._id} className="p-6 bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700/50 shadow-sm rounded-2xl relative hover:shadow-md transition-all duration-200">
                <div className="absolute top-4 right-4">
                  {isSlowLearner ? (
                    <span className="text-[10px] font-bold px-2 py-1 bg-red-100 text-red-700 rounded-md uppercase tracking-wider">
                      SLOW LEARNER
                    </span>
                  ) : (
                    <span className="text-[10px] font-bold px-2 py-1 bg-emerald-100 text-emerald-700 rounded-md uppercase tracking-wider">
                      GOOD STUDENT
                    </span>
                  )}
                </div>

                <h3 className="font-bold text-lg text-slate-800 dark:text-white pr-24">{s.name}</h3>
                <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-4">Class: {s.className}</p>

                <div className="flex gap-4 mb-6">
                  <div>
                    <p className="text-xs uppercase font-semibold text-slate-400 dark:text-slate-500">Marks</p>
                    <p className={`font-bold ${isSlowLearner ? 'text-red-600 dark:text-red-400' : 'text-slate-700 dark:text-slate-200'}`}>{s.marks}%</p>
                  </div>
                  <div>
                    <p className="text-xs uppercase font-semibold text-slate-400 dark:text-slate-500">Attendance</p>
                    <p className="font-bold text-slate-700 dark:text-slate-200">{s.attendance}%</p>
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t border-slate-50 dark:border-slate-700/30">
                  <button onClick={() => openEditModal(s)} className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 transition-colors p-2 bg-blue-50 hover:bg-blue-100 dark:bg-blue-900/30 dark:hover:bg-blue-900/50 rounded-lg">
                    <Edit2 size={16} />
                  </button>
                  <button onClick={() => handleDelete(s._id)} className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 transition-colors p-2 bg-red-50 hover:bg-red-100 dark:bg-red-900/30 dark:hover:bg-red-900/50 rounded-lg">
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 dark:bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-800 rounded-2xl w-full max-w-md shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 border border-transparent dark:border-slate-700">
            <div className="px-6 py-5 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center bg-slate-50/50 dark:bg-slate-800/50">
              <h3 className="font-bold text-lg text-slate-800 dark:text-white">
                {editingStudent ? "Edit Student Record" : "Register New Student"}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 bg-white dark:bg-slate-700 hover:bg-slate-100 dark:hover:bg-slate-600 p-1.5 rounded-full transition-colors shadow-sm border border-slate-200 dark:border-slate-600">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Full Name</label>
                <input
                  placeholder="e.g. Jane Doe"
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none text-slate-800 text-sm transition-all shadow-sm placeholder:text-slate-400"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Class / Grade</label>
                <input
                  placeholder="e.g. 10th Grade - Sec A"
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none text-slate-800 text-sm transition-all shadow-sm placeholder:text-slate-400"
                  value={formData.className}
                  onChange={(e) =>
                    setFormData({ ...formData, className: e.target.value })
                  }
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Marks (%)</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    placeholder="0-100"
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none text-slate-800 text-sm transition-all shadow-sm placeholder:text-slate-400"
                    value={formData.marks}
                    onChange={(e) =>
                      setFormData({ ...formData, marks: e.target.value })
                    }
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Attendance (%)</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    placeholder="0-100"
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none text-slate-800 text-sm transition-all shadow-sm placeholder:text-slate-400"
                    value={formData.attendance}
                    onChange={(e) =>
                      setFormData({ ...formData, attendance: e.target.value })
                    }
                    required
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 dark:border-slate-700 flex gap-3">
                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 py-3 px-4 bg-white dark:bg-slate-700 border-2 border-slate-200 dark:border-transparent text-slate-700 dark:text-slate-200 font-bold rounded-xl hover:bg-slate-50 dark:hover:bg-slate-600 transition-colors">
                  Cancel
                </button>
                <button type="submit" className="flex-1 py-3 px-4 bg-indigo-600 dark:bg-indigo-500 text-white font-bold rounded-xl hover:bg-indigo-700 dark:hover:bg-indigo-600 shadow-md shadow-indigo-200 dark:shadow-none transition-all active:scale-95">
                  {editingStudent ? "Save Changes" : "Create Student"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Students;