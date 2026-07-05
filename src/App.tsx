import { useState } from "react";
import { GraduationCap, BookOpen, Layers, Check, ShieldCheck, Cpu } from "lucide-react";
import { motion } from "motion/react";
import UniversityForm from "./components/UniversityForm";
import ConsoleOutputView from "./components/ConsoleOutputView";
import ThemeToggle from "./components/ThemeToggle";
import { FormValues } from "./types";

interface LogEntry {
  id: string;
  timestamp: string;
  data: FormValues;
}

export default function App() {
  const [logs, setLogs] = useState<LogEntry[]>([]);

  const handleFormSubmit = (data: FormValues) => {
    const newLog: LogEntry = {
      id: `log-${Date.now()}`,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" }),
      data,
    };
    // Prepend the latest logs
    setLogs((prev) => [newLog, ...prev]);
  };

  const handleClearLogs = () => {
    setLogs([]);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-zinc-950 text-slate-800 dark:text-zinc-50 transition-colors duration-200 selection:bg-blue-500/20 font-sans flex flex-col">
      
      {/* Header Section */}
      <header className="h-16 bg-white dark:bg-zinc-900 border-b border-slate-200 dark:border-zinc-800 px-6 md:px-8 flex items-center justify-between shrink-0 shadow-sm z-10">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center text-white font-bold text-sm shadow-sm">
            U
          </div>
          <h1 className="text-lg md:text-xl font-semibold text-slate-800 dark:text-zinc-50 tracking-tight flex items-center gap-2">
            UniForm Builder 
            <span className="text-slate-400 dark:text-zinc-500 font-normal text-xs bg-slate-100 dark:bg-zinc-800 px-2 py-0.5 rounded">
              v1.0
            </span>
          </h1>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="hidden sm:flex items-center gap-1.5 text-xs text-slate-500 dark:text-zinc-400 bg-slate-100 dark:bg-zinc-800 px-2.5 py-1 rounded font-medium">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            Engine Status: Ready
          </div>
          <ThemeToggle />
        </div>
      </header>

      {/* Main Content Layout */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-6 lg:p-8 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Column: Interactive Form Editor (Spans 7) */}
        <section className="lg:col-span-7 bg-white dark:bg-zinc-900 rounded-xl border border-slate-200 dark:border-zinc-800/80 shadow-sm flex flex-col overflow-hidden">
          <div className="p-6 border-b border-slate-100 dark:border-zinc-800/60 bg-white dark:bg-zinc-900">
            <h2 className="text-lg font-bold text-slate-800 dark:text-zinc-100 mb-1">Academic Credentials</h2>
            <p className="text-sm text-slate-500 dark:text-zinc-400">Add the universities where you have completed your higher education.</p>
          </div>
          <div className="p-6 bg-slate-50/30 dark:bg-zinc-900/40">
            <UniversityForm onSubmitSuccess={handleFormSubmit} />
          </div>
        </section>

        {/* Right Column: Console Log Viewer & Learning Notes (Spans 5) */}
        <section className="lg:col-span-5 space-y-6 lg:sticky lg:top-6">
          
          {/* Visual Interactive Terminal (Live Stream of Log Output) */}
          <ConsoleOutputView logs={logs} onClear={handleClearLogs} />

          {/* Requirements / Objectives Checklist */}
          <div className="bg-white dark:bg-zinc-900 rounded-xl border border-slate-200 dark:border-zinc-800 p-5 shadow-sm space-y-4">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Form Validation Checklist
            </h3>
            
            <ul className="space-y-3">
              <li className="flex items-start gap-3 text-sm text-slate-600 dark:text-zinc-300">
                <div className="w-5 h-5 bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center shrink-0">
                  <Check className="w-3.5 h-3.5 stroke-[3]" />
                </div>
                <div>
                  <span className="font-semibold block text-xs text-slate-700 dark:text-zinc-200">Formik FieldArray State Management</span>
                  <span className="text-xs text-slate-500 dark:text-zinc-400">Dynamically manages, appends, and cleans elements inside nested lists.</span>
                </div>
              </li>
              <li className="flex items-start gap-3 text-sm text-slate-600 dark:text-zinc-300">
                <div className="w-5 h-5 bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center shrink-0">
                  <Check className="w-3.5 h-3.5 stroke-[3]" />
                </div>
                <div>
                  <span className="font-semibold block text-xs text-slate-700 dark:text-zinc-200">Yup Validation Schema Arrays</span>
                  <span className="text-xs text-slate-500 dark:text-zinc-400">Runs type and length bounds checks on every list index in real-time.</span>
                </div>
              </li>
              <li className="flex items-start gap-3 text-sm text-slate-600 dark:text-zinc-300">
                <div className="w-5 h-5 bg-blue-100 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 rounded-full flex items-center justify-center shrink-0">
                  <div className="w-2 h-2 bg-blue-600 dark:bg-blue-400 rounded-full"></div>
                </div>
                <div>
                  <span className="font-semibold block text-xs text-slate-700 dark:text-zinc-200">Dynamic UI Motion controls</span>
                  <span className="text-xs text-slate-500 dark:text-zinc-400">Leverages layout animations to focus and choreograph dynamic field shifts.</span>
                </div>
              </li>
            </ul>
          </div>

          {/* Quick Helper Tooltips Banner */}
          <div className="bg-gradient-to-r from-blue-500/5 to-blue-600/5 dark:from-blue-950/10 dark:to-blue-900/5 border border-blue-100 dark:border-blue-950/50 rounded-xl p-5 flex items-start gap-3 shadow-sm">
            <span className="text-lg">💡</span>
            <div className="space-y-1">
              <h4 className="font-semibold text-xs text-blue-900 dark:text-blue-300">
                Professional Usability Tip
              </h4>
              <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed">
                Hover over standard control headers or deletion buttons to read live tips. Newly added universities auto-focus and trigger a smooth viewport scroll for clean workflow alignment.
              </p>
            </div>
          </div>

        </section>
      </main>

      {/* Footer / Status Bar */}
      <footer className="h-10 bg-slate-100 dark:bg-zinc-900 border-t border-slate-200 dark:border-zinc-800 px-6 flex items-center justify-between text-[10px] text-slate-400 dark:text-zinc-500 uppercase tracking-widest shrink-0 font-semibold mt-auto z-10">
        <div className="flex gap-4">
          <span>Validation: Active</span>
          <span>Engine: Formik + Yup</span>
        </div>
        <div>UniForm Builder &copy; 2026</div>
      </footer>
    </div>
  );
}
