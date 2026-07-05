import { useState, useEffect } from "react";
import { Terminal, Copy, Check, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import Tooltip from "./Tooltip";

interface ConsoleOutputViewProps {
  logs: any[];
  onClear: () => void;
}

export default function ConsoleOutputView({ logs, onClear }: ConsoleOutputViewProps) {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const copyToClipboard = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div className="w-full bg-[#1e293b] text-slate-100 rounded-xl border border-slate-700 shadow-xl overflow-hidden font-mono text-sm">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-3 bg-[#0f172a] border-b border-slate-700">
        <div className="flex items-center space-x-2.5">
          <div className="flex space-x-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500 block" />
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500 block" />
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 block" />
          </div>
          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest flex items-center gap-1.5 ml-2">
            <Terminal className="w-3.5 h-3.5 text-blue-400" />
            Browser Console Output
          </span>
        </div>
        {logs.length > 0 && (
          <button
            onClick={onClear}
            className="text-xs text-rose-400 hover:text-rose-300 transition-colors font-semibold px-2.5 py-1 rounded hover:bg-rose-950/40 border border-rose-950/60 cursor-pointer"
          >
            Clear logs
          </button>
        )}
      </div>

      {/* Content */}
      <div className="p-5 max-h-[350px] overflow-y-auto space-y-4">
        <AnimatePresence initial={false}>
          {logs.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center py-10 text-slate-400 text-center space-y-2"
            >
              <Terminal className="w-8 h-8 text-slate-500 stroke-[1.5]" />
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-300">No submissions logged yet</p>
              <p className="text-[11px] text-slate-400 max-w-xs leading-relaxed">
                Fill out the academic credentials form and submit to stream structured JSON outputs here.
              </p>
            </motion.div>
          ) : (
            logs.map((log, index) => {
              const formattedJson = JSON.stringify(log.data, null, 2);
              return (
                <motion.div
                  key={log.id}
                  initial={{ opacity: 0, y: 15, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -15, scale: 0.98 }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                  className="bg-[#0f172a]/60 rounded-lg border border-slate-700/80 overflow-hidden"
                >
                  <div className="flex items-center justify-between px-4 py-2 bg-[#0f172a]/40 border-b border-slate-700/40 text-xs text-slate-400">
                    <span className="flex items-center gap-1.5 font-semibold text-[11px]">
                      <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                      &gt; Log: Submission #{logs.length - index} • {log.timestamp}
                    </span>
                    <button
                      onClick={() => copyToClipboard(formattedJson, index)}
                      className="text-slate-400 hover:text-slate-200 transition-colors flex items-center gap-1 cursor-pointer"
                    >
                      {copiedIndex === index ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                          <span className="text-[10px] text-emerald-400 font-semibold">Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span className="text-[10px]">Copy</span>
                        </>
                      )}
                    </button>
                  </div>
                  <pre className="p-4 text-xs text-slate-300 overflow-x-auto whitespace-pre-wrap leading-relaxed max-h-[220px]">
                    <code>{formattedJson}</code>
                  </pre>
                </motion.div>
              );
            })
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
