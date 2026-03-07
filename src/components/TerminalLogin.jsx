import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldAlert, Loader2 } from 'lucide-react';

export default function TerminalLogin({ onLogin }) {
  const [officer, setOfficer] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!officer.trim()) return;
    setLoading(true);
    setTimeout(() => onLogin(officer.trim()), 2500);
  };

  return (
    <div className="fixed inset-0 z-20 flex items-center justify-center p-4 pointer-events-none">
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-md pointer-events-auto"
      >
        {/* Scanline decoration */}
        <motion.div
          className="mb-6 flex items-center justify-center gap-3"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
        >
          <div className="h-px flex-1 bg-gradient-to-r from-transparent to-emerald-500/40" />
          <span className="font-mono text-[10px] tracking-[0.2em] text-emerald-700 uppercase">
            Secure Access
          </span>
          <div className="h-px flex-1 bg-gradient-to-l from-transparent to-emerald-500/40" />
        </motion.div>

        {/* Main card */}
        <div className="bg-[#010805]/80 backdrop-blur-md border border-emerald-900/50 shadow-[0_0_50px_rgba(5,150,105,0.2)] rounded-lg p-8">
          {/* Icon */}
          <motion.div
            className="mb-6 flex justify-center"
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
          >
            <div className="relative">
              <ShieldAlert className="h-10 w-10 text-emerald-500" />
              <div className="absolute inset-0 blur-lg">
                <ShieldAlert className="h-10 w-10 text-emerald-500 opacity-60" />
              </div>
            </div>
          </motion.div>

          {/* Title */}
          <motion.div
            className="mb-8 text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.6 }}
          >
            <h1 className="font-black text-2xl tracking-[0.2em] text-emerald-400 mb-2 uppercase">
              CLINICAL DASHBOARD
            </h1>
            <p className="text-[10px] tracking-[0.2em] text-emerald-700 uppercase">
              Terminal Authentication Required
            </p>
          </motion.div>

          {/* Form */}
          <motion.form
            onSubmit={handleSubmit}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.5 }}
            className="space-y-5"
          >
            <div>
              <label className="block text-[10px] tracking-[0.2em] text-emerald-600 font-bold uppercase mb-2">
                Authorized Medical Officer
              </label>
              <input
                type="text"
                value={officer}
                onChange={(e) => setOfficer(e.target.value)}
                placeholder="ENTER OFFICER ID"
                disabled={loading}
                className="w-full bg-[#022c22]/30 border border-emerald-900/60 rounded px-4 py-3 text-xs font-mono tracking-widest text-emerald-300 placeholder:text-emerald-900/60 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/30 transition-all disabled:opacity-50"
              />
            </div>

            <button
              type="submit"
              disabled={loading || !officer.trim()}
              className="w-full relative overflow-hidden bg-emerald-900/40 border border-emerald-800 rounded px-4 py-3 font-black text-xs tracking-[0.2em] text-emerald-300 hover:bg-emerald-800/60 hover:border-emerald-500/60 transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed shadow-[0_0_15px_rgba(5,150,105,0.1)]"
            >
              <AnimatePresence mode="wait">
                {loading ? (
                  <motion.span
                    key="loading"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="flex items-center justify-center gap-2"
                  >
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    GETTING DASHBOARD READY
                  </motion.span>
                ) : (
                  <motion.span
                    key="idle"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                  >
                    INITIATE TERMINAL
                  </motion.span>
                )}
              </AnimatePresence>
            </button>
          </motion.form>

          {/* Footer decoration */}
          <motion.div
            className="mt-6 flex items-center justify-center gap-2 text-[9px] tracking-[0.2em] text-emerald-800 font-bold uppercase"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 0.5 }}
          >
            <div className="h-1.5 w-1.5 rounded-full bg-emerald-500/60 animate-pulse" />
            System Online — Awaiting Credentials
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}