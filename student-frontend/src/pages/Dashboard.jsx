import React, { useEffect, useState } from 'react';
import { Users, AlertTriangle, TrendingUp, CheckCircle } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import api from '../services/api';
import TeacherAIModal from '../components/TeacherAIModal';

const Dashboard = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAIOpen, setIsAIOpen] = useState(false);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const res = await api.get('http://localhost:5000/api/students');
        setStudents(res.data);
      } catch (err) {
        console.error("Failed to fetch students", err);
      } finally {
        setLoading(false);
      }
    };
    fetchStudents();
  }, []);

  const handleDownloadReport = async () => {
    try {
      const response = await api.get('http://localhost:5000/api/students/report/pdf', {
        responseType: 'blob', // Expect binary response
      });
      
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'student-report.pdf');
      document.body.appendChild(link);
      link.click();
      
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Download failed:", error);
      alert("Failed to download report");
    }
  };

  // Calculate stats
  const totalStudents = students.length;
  const slowLearners = students.filter(s => s.status === 'slow learner').length;
  
  const avgMarks = totalStudents > 0 
    ? (students.reduce((acc, curr) => acc + curr.marks, 0) / totalStudents).toFixed(1)
    : 0;
    
  const avgAttendance = totalStudents > 0 
    ? (students.reduce((acc, curr) => acc + curr.attendance, 0) / totalStudents).toFixed(1)
    : 0;

  // Chart Data preparation
  const pieData = [
    { name: 'Normal', value: totalStudents - slowLearners },
    { name: 'Slow Learner', value: slowLearners }
  ];
  const COLORS = ['#10b981', '#ef4444']; // emerald-500, red-500

  // Mock Performance trend (usually this would be time-series, for now we map students marks)
  const lineData = students.map((s, index) => ({
    name: `S${index + 1}`,
    marks: s.marks,
    attendance: s.attendance
  })).slice(0, 15); // Show first 15 for readability 

  if (loading) return <div className="animate-pulse space-y-6">Loading...</div>;

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 dark:text-white tracking-tight">Dashboard Overview</h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Real-time statistics for Student Performance.</p>
        </div>
        <div className="flex gap-3">
          <button onClick={() => setIsAIOpen(true)} className="flex items-center gap-2 py-2 px-4 rounded-lg bg-indigo-600/10 text-indigo-700 font-bold hover:bg-indigo-600/20 border border-indigo-200 transition-colors shadow-sm">
            ✨ AI Assistant
          </button>
          <button onClick={handleDownloadReport} className="btn-primary flex items-center gap-2">
            Download Report
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Total Students" value={totalStudents} icon={Users} color="bg-blue-100/80 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400" />
        <StatCard title="Slow Learners" value={slowLearners} icon={AlertTriangle} color="bg-red-100/80 dark:bg-red-500/20 text-red-600 dark:text-red-400" />
        <StatCard title="Avg. Marks" value={`${avgMarks}%`} icon={TrendingUp} color="bg-emerald-100/80 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400" />
        <StatCard title="Total Attendance" value={`${avgAttendance}%`} icon={CheckCircle} color="bg-purple-100/80 dark:bg-purple-500/20 text-purple-600 dark:text-purple-400" />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="card lg:col-span-2">
          <h3 className="font-semibold text-slate-800 dark:text-slate-100 mb-4">Student Performance Trends</h3>
          <div className="h-72">
            {lineData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={lineData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} dx={-10} />
                  <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                  <Legend />
                  <Line type="monotone" dataKey="marks" stroke="#0ea5e9" strokeWidth={3} dot={{r: 4, strokeWidth: 2}} activeDot={{r: 6}} />
                  <Line type="monotone" dataKey="attendance" stroke="#8b5cf6" strokeWidth={3} dot={{r: 4, strokeWidth: 2}} />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-slate-400">No data available</div>
            )}
          </div>
        </div>

        <div className="card">
          <h3 className="font-semibold text-slate-800 dark:text-slate-100 mb-4">Learner Distribution</h3>
          <div className="h-72">
            {totalStudents > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={70}
                    outerRadius={90}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                  <Legend verticalAlign="bottom" height={36} />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-slate-400">No data available</div>
            )}
          </div>
        </div>
      </div>

      <TeacherAIModal isOpen={isAIOpen} onClose={() => setIsAIOpen(false)} />
    </div>
  );
};

const StatCard = ({ title, value, icon: Icon, color }) => (
  <div className="card flex items-center gap-4 hover:shadow-md transition-shadow group">
    <div className={`h-12 w-12 rounded-xl flex items-center justify-center ${color} group-hover:scale-110 transition-transform`}>
      <Icon size={24} />
    </div>
    <div>
      <p className="text-sm font-medium text-slate-500 dark:text-slate-400 transition-colors">{title}</p>
      <h4 className="text-2xl font-bold text-slate-800 dark:text-white transition-colors">{value}</h4>
    </div>
  </div>
);

export default Dashboard;
