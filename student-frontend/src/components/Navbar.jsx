import React from 'react';
import { Bell, Search, Sun, Moon } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const Navbar = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="h-16 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 sticky top-0 z-10 flex items-center justify-between px-8 transition-colors duration-200">
      <div className="flex items-center gap-2 max-w-md w-full">
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500" size={18} />
          <input 
            type="text" 
            placeholder="Search students..." 
            className="w-full pl-10 pr-4 py-2 rounded-full bg-slate-100 dark:bg-slate-800 border-transparent focus:bg-white dark:focus:bg-slate-700 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900 dark:text-white outline-none transition-all text-sm"
          />
        </div>
      </div>

      <div className="flex items-center gap-5">
        {/* THEME TOGGLE */}
        <button 
          onClick={toggleTheme} 
          className="text-slate-500 dark:text-slate-400 hover:text-indigo-500 dark:hover:text-amber-400 transition-colors p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800"
          title="Toggle Theme"
        >
          {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
        </button>

        <button className="relative text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 transition-colors">
          <Bell size={20} />
          <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 dark:bg-red-600 rounded-full border-2 border-white dark:border-slate-900 flex items-center justify-center text-[10px] text-white font-bold transition-colors duration-200">2</span>
        </button>
        <div className="h-8 w-px bg-slate-200 dark:bg-slate-700 transition-colors duration-200"></div>
        <div className="flex items-center gap-3 cursor-pointer">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-semibold text-slate-700 dark:text-slate-200 leading-tight">Admin User</p>
            <p className="text-xs text-slate-500 dark:text-slate-400">Principal</p>
          </div>
          <img 
            src="https://ui-avatars.com/api/?name=Admin+User&background=0ea5e9&color=fff&rounded=true&bold=true" 
            alt="Profile container" 
            className="w-9 h-9 rounded-full ring-2 ring-slate-100 dark:ring-slate-800 transition-all"
          />
        </div>
      </div>
    </header>
  );
};

export default Navbar;
