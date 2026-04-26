import React from 'react';
import { Mail, Phone, MapPin, ShieldCheck, Award, Briefcase, GraduationCap, Edit3 } from 'lucide-react';

const Profile = () => {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-5xl mx-auto">
      {/* Header Info */}
      <div>
        <h2 className="text-2xl font-bold text-slate-800 dark:text-white tracking-tight">User Profile</h2>
        <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Manage your administrative credentials and viewing preferences.</p>
      </div>

      {/* Main Profile Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
        
        {/* Left Column - ID Card */}
        <div className="card lg:col-span-1 border-t-4 border-t-blue-600 dark:border-t-blue-500 py-8 relative">
          <div className="absolute right-4 top-4">
            <span className="bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider flex items-center gap-1 shadow-sm">
              <ShieldCheck size={14} /> Active
            </span>
          </div>

          <div className="flex flex-col items-center">
            <div className="relative">
              <img 
                src="https://ui-avatars.com/api/?name=Admin+User&background=0ea5e9&color=fff&rounded=true&bold=true&size=150" 
                alt="Principal Profile" 
                className="w-32 h-32 rounded-full ring-4 ring-slate-50 dark:ring-slate-800 shadow-xl mb-4"
              />
              <button 
                className="absolute bottom-4 right-0 p-2 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-lg transition-transform hover:scale-110"
                title="Edit Photo"
              >
                <Edit3 size={16} />
              </button>
            </div>
            
            <h3 className="text-2xl font-bold text-slate-800 dark:text-white mb-1">Admin User</h3>
            <p className="text-blue-600 dark:text-blue-400 font-semibold mb-4">School Principal</p>
            
            <p className="text-sm text-slate-500 dark:text-slate-400 text-center max-w-xs mb-6">
              Leading modern educational strategies to ensure no student is left behind.
            </p>

            <div className="w-full space-y-3">
              <div className="flex items-center gap-3 text-sm text-slate-600 dark:text-slate-300">
                <Mail size={16} className="text-slate-400" />
                <span>principal@slowlearner.edu</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-slate-600 dark:text-slate-300">
                <Phone size={16} className="text-slate-400" />
                <span>+1 (555) 987-6543</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-slate-600 dark:text-slate-300">
                <MapPin size={16} className="text-slate-400" />
                <span>Valley Stream, NY</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Stats and Details */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Quick Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div className="p-4 bg-blue-50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-900/30 rounded-xl">
               <Briefcase size={20} className="text-blue-600 dark:text-blue-400 mb-2" />
               <p className="text-xl font-bold text-slate-800 dark:text-white">12 Yrs</p>
               <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Experience</p>
            </div>
            <div className="p-4 bg-purple-50 dark:bg-purple-900/10 border border-purple-100 dark:border-purple-900/30 rounded-xl">
               <Award size={20} className="text-purple-600 dark:text-purple-400 mb-2" />
               <p className="text-xl font-bold text-slate-800 dark:text-white">Edu. Master</p>
               <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Certification</p>
            </div>
            <div className="p-4 bg-emerald-50 dark:bg-emerald-900/10 border border-emerald-100 dark:border-emerald-900/30 rounded-xl">
               <GraduationCap size={20} className="text-emerald-600 dark:text-emerald-400 mb-2" />
               <p className="text-xl font-bold text-slate-800 dark:text-white">Stanford</p>
               <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Alumni</p>
            </div>
          </div>

          {/* Configuration Card */}
          <div className="card">
            <div className="flex items-center justify-between mb-6">
               <h3 className="font-bold text-lg text-slate-800 dark:text-white">System Privileges</h3>
               <span className="text-xs font-semibold px-2 py-1 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 rounded uppercase">Read Only</span>
            </div>
            
            <div className="space-y-4">
              <div className="flex justify-between items-center py-3 border-b border-slate-50 dark:border-slate-700/50">
                <div>
                  <h4 className="font-semibold text-slate-800 dark:text-white">Student Records Access</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400">View and edit capabilities for all classrooms.</p>
                </div>
                <div className="w-10 h-5 bg-blue-600 rounded-full relative">
                  <div className="w-4 h-4 bg-white rounded-full absolute right-0.5 top-0.5 shadow-sm transform transition-transform"></div>
                </div>
              </div>

              <div className="flex justify-between items-center py-3 border-b border-slate-50 dark:border-slate-700/50">
                <div>
                  <h4 className="font-semibold text-slate-800 dark:text-white">AI Automation Usage</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Enable Gemini Teacher AI processing.</p>
                </div>
                <div className="w-10 h-5 bg-blue-600 rounded-full relative">
                  <div className="w-4 h-4 bg-white rounded-full absolute right-0.5 top-0.5 shadow-sm transform transition-transform"></div>
                </div>
              </div>

              <div className="flex justify-between items-center py-3">
                <div>
                  <h4 className="font-semibold text-slate-800 dark:text-white opacity-60">System Security Configs</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Admin route lockdowns.</p>
                </div>
                <div className="w-10 h-5 bg-slate-200 dark:bg-slate-700 rounded-full relative">
                  <div className="w-4 h-4 bg-white rounded-full absolute left-0.5 top-0.5 shadow-sm"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile
