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
<<<<<<< HEAD
          <div className="h-px flex-1 bg-gradient-to-r from-transparent to-emerald-500/40" />
          <span className="font-mono text-[10px] tracking-[0.2em] text-emerald-700 uppercase">
            Secure Access
          </span>
          <div className="h-px flex-1 bg-gradient-to-l from-transparent to-emerald-500/40" />
        </motion.div>

        {/* Main card */}
        <div className="bg-[#010805]/80 backdrop-blur-md border border-emerald-900/50 shadow-[0_0_50px_rgba(5,150,105,0.2)] rounded-lg p-8">
=======
          <div className="h-px flex-1 bg-gradient-to-r from-transparent to-[#14b870]/40" />
          <span className="font-['Orbitron',_sans-serif] text-[10px] tracking-[0.35em] text-[#628475] uppercase">
            Secure Access
          </span>
          <div className="h-px flex-1 bg-gradient-to-l from-transparent to-[#14b870]/40" />
        </motion.div>

        {/* Main card */}
        <div className="bg-[#050f0a]/60 backdrop-blur-[24px] saturate-[1.2] border border-[#173528] rounded-lg p-8 shadow-[0_0_20px_rgba(20,184,112,0.4),0_0_60px_rgba(20,184,112,0.1)]">
>>>>>>> 16b15b1205f7f6dd43a27b09764c1411085fc5ac
          {/* Icon */}
          <motion.div
            className="mb-6 flex justify-center"
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
          >
            <div className="relative">
<<<<<<< HEAD
              <ShieldAlert className="h-10 w-10 text-emerald-500" />
              <div className="absolute inset-0 blur-lg">
                <ShieldAlert className="h-10 w-10 text-emerald-500 opacity-60" />
=======
              <ShieldAlert className="h-10 w-10 text-[#14b870]" />
              <div className="absolute inset-0 blur-lg">
                <ShieldAlert className="h-10 w-10 text-[#14b870] opacity-60" />
>>>>>>> 16b15b1205f7f6dd43a27b09764c1411085fc5ac
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
<<<<<<< HEAD
            <h1 className="font-black text-2xl tracking-[0.2em] text-emerald-400 mb-2 uppercase">
              CLINICAL DASHBOARD
            </h1>
            <p className="text-[10px] tracking-[0.2em] text-emerald-700 uppercase">
=======
            <h1 className="font-['Orbitron',_sans-serif] text-sm tracking-[0.25em] text-[#c2e4d4] [text-shadow:0_0_10px_rgba(20,184,112,0.6),0_0_30px_rgba(20,184,112,0.2)] mb-2">
              CLINICAL DASHBOARD
            </h1>
            <p className="text-[10px] tracking-[0.35em] text-[#628475] uppercase">
>>>>>>> 16b15b1205f7f6dd43a27b09764c1411085fc5ac
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
<<<<<<< HEAD
              <label className="block text-[10px] tracking-[0.2em] text-emerald-600 font-bold uppercase mb-2">
=======
              <label className="block text-[10px] tracking-[0.25em] text-[#628475] uppercase mb-2">
>>>>>>> 16b15b1205f7f6dd43a27b09764c1411085fc5ac
                Authorized Medical Officer
              </label>
              <input
                type="text"
                value={officer}
                onChange={(e) => setOfficer(e.target.value)}
                placeholder="ENTER OFFICER ID"
                disabled={loading}
<<<<<<< HEAD
                className="w-full bg-[#022c22]/30 border border-emerald-900/60 rounded px-4 py-3 text-xs font-mono tracking-widest text-emerald-300 placeholder:text-emerald-900/60 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/30 transition-all disabled:opacity-50"
=======
                className="w-full bg-[#152820]/50 border border-[#173528] rounded px-4 py-3 text-xs font-['JetBrains_Mono',_monospace] tracking-widest text-[#c2e4d4] placeholder:text-[#628475]/40 focus:outline-none focus:border-[#14b870] focus:ring-1 focus:ring-[#14b870]/30 transition-all disabled:opacity-50"
>>>>>>> 16b15b1205f7f6dd43a27b09764c1411085fc5ac
              />
            </div>

            <button
              type="submit"
              disabled={loading || !officer.trim()}
<<<<<<< HEAD
              className="w-full relative overflow-hidden bg-emerald-900/40 border border-emerald-800 rounded px-4 py-3 font-black text-xs tracking-[0.2em] text-emerald-300 hover:bg-emerald-800/60 hover:border-emerald-500/60 transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed shadow-[0_0_15px_rgba(5,150,105,0.1)]"
=======
              className="w-full relative overflow-hidden bg-[#14b870]/10 border border-[#14b870]/40 rounded px-4 py-3 font-['Orbitron',_sans-serif] text-xs tracking-[0.25em] text-[#14b870] hover:bg-[#14b870]/20 hover:border-[#14b870]/60 transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed shadow-[0_0_20px_rgba(20,184,112,0.4),0_0_60px_rgba(20,184,112,0.1)]"
>>>>>>> 16b15b1205f7f6dd43a27b09764c1411085fc5ac
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
<<<<<<< HEAD
            className="mt-6 flex items-center justify-center gap-2 text-[9px] tracking-[0.2em] text-emerald-800 font-bold uppercase"
=======
            className="mt-6 flex items-center justify-center gap-2 text-[9px] tracking-[0.25em] text-[#628475]/80 uppercase"
>>>>>>> 16b15b1205f7f6dd43a27b09764c1411085fc5ac
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 0.5 }}
          >
<<<<<<< HEAD
            <div className="h-1.5 w-1.5 rounded-full bg-emerald-500/60 animate-pulse" />
=======
            <div className="h-1.5 w-1.5 rounded-full bg-[#14b870]/60 animate-pulse" />
>>>>>>> 16b15b1205f7f6dd43a27b09764c1411085fc5ac
            System Online — Awaiting Credentials
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}