import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, GraduationCap, Shield, Users, Lock, UserCheck, AlertCircle, ArrowRight, Sparkles, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type LoginTab = 'students27' | 'usthad' | 'general';

export default function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const { loginStudent27, loginUsthadFsl, loginGeneral, registerGeneral, loginWithGoogle, isLoading } = useAuth();
  
  const [activeTab, setActiveTab] = useState<LoginTab>('students27');
  
  // Student 27 Form
  const [studentAdNo, setStudentAdNo] = useState('');
  const [studentPass, setStudentPass] = useState('');

  // Usthad Form
  const [usthadUser, setUsthadUser] = useState('');
  const [usthadPass, setUsthadPass] = useState('');

  // General Form
  const [generalMode, setGeneralMode] = useState<'login' | 'register'>('login');
  const [generalRole, setGeneralRole] = useState<'student_general' | 'usthad_general'>('student_general');
  const [generalName, setGeneralName] = useState('');
  const [generalIdOrEmail, setGeneralIdOrEmail] = useState('');
  const [generalPass, setGeneralPass] = useState('');
  const [generalDepartment, setGeneralDepartment] = useState('');

  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  if (!isOpen) return null;

  const handleStudentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    const res = await loginStudent27(studentAdNo, studentPass);
    if (res.success) {
      setSuccessMsg(`Welcome, Student! Accessing 27-Cohort Portal...`);
      setTimeout(() => {
        onClose();
        setSuccessMsg('');
      }, 1000);
    } else {
      setErrorMsg(res.error || 'Login failed.');
    }
  };

  const handleUsthadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    const res = await loginUsthadFsl(usthadUser, usthadPass);
    if (res.success) {
      setSuccessMsg(`Marhaban, Usthad Fazlu Rehman Hudawi! Opening Faculty Command Center...`);
      setTimeout(() => {
        onClose();
        setSuccessMsg('');
      }, 1000);
    } else {
      setErrorMsg(res.error || 'Invalid Usthad credentials.');
    }
  };

  const handleGeneralSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (generalMode === 'login') {
      const res = await loginGeneral({
        idOrEmail: generalIdOrEmail,
        pass: generalPass,
        role: generalRole,
      });
      if (res.success) {
        setSuccessMsg(`Welcome to USRA Campus Portal!`);
        setTimeout(() => {
          onClose();
          setSuccessMsg('');
        }, 1000);
      } else {
        setErrorMsg(res.error || 'Authentication error.');
      }
    } else {
      if (!generalName.trim()) {
        setErrorMsg('Please enter your full name.');
        return;
      }
      const res = await registerGeneral({
        name: generalName,
        idOrEmail: generalIdOrEmail,
        pass: generalPass,
        role: generalRole,
        department: generalDepartment,
      });
      if (res.success) {
        setSuccessMsg(`Account created successfully!`);
        setTimeout(() => {
          onClose();
          setSuccessMsg('');
        }, 1000);
      } else {
        setErrorMsg(res.error || 'Registration error.');
      }
    }
  };

  const handleGoogleSignIn = async () => {
    setErrorMsg('');
    const res = await loginWithGoogle(generalRole);
    if (res.success) {
      setSuccessMsg('Authenticated with Google!');
      setTimeout(() => {
        onClose();
      }, 1000);
    } else {
      setErrorMsg(res.error || 'Google login failed.');
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/80 backdrop-blur-md"
        />

        {/* Modal Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ type: 'spring', stiffness: 300, damping: 28 }}
          className="relative w-full max-w-xl rounded-3xl bg-[#09090b] border border-white/10 shadow-[0_25px_60px_rgba(0,0,0,0.8)] overflow-hidden z-10 my-auto"
        >
          {/* Neon Glow Highlights */}
          <div className="absolute top-0 right-1/4 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-1/4 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

          {/* Header */}
          <div className="p-6 pb-4 border-b border-white/5 flex items-center justify-between relative">
            <div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                <span className="font-mono text-[9px] uppercase tracking-[0.25em] text-blue-400 font-bold">
                  USRA Central Gate
                </span>
              </div>
              <h2 className="font-display font-extrabold text-2xl text-white tracking-wide mt-1">
                Portal Authentication
              </h2>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 text-neutral-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Tabs */}
          <div className="grid grid-cols-3 p-2 bg-neutral-950/60 border-b border-white/5 gap-1 text-xs">
            <button
              onClick={() => { setActiveTab('students27'); setErrorMsg(''); setSuccessMsg(''); }}
              className={`py-3 px-2 rounded-xl font-mono text-[11px] font-semibold transition-all duration-200 flex flex-col sm:flex-row items-center justify-center gap-1.5 ${
                activeTab === 'students27'
                  ? 'bg-blue-600/20 text-blue-300 border border-blue-500/30 shadow-lg'
                  : 'text-neutral-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <GraduationCap className="w-4 h-4 text-blue-400" />
              <span className="truncate">27 Students</span>
            </button>

            <button
              onClick={() => { setActiveTab('usthad'); setErrorMsg(''); setSuccessMsg(''); }}
              className={`py-3 px-2 rounded-xl font-mono text-[11px] font-semibold transition-all duration-200 flex flex-col sm:flex-row items-center justify-center gap-1.5 ${
                activeTab === 'usthad'
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30 shadow-lg'
                  : 'text-neutral-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <Shield className="w-4 h-4 text-amber-400" />
              <span className="truncate">Usthad Login</span>
            </button>

            <button
              onClick={() => { setActiveTab('general'); setErrorMsg(''); setSuccessMsg(''); }}
              className={`py-3 px-2 rounded-xl font-mono text-[11px] font-semibold transition-all duration-200 flex flex-col sm:flex-row items-center justify-center gap-1.5 ${
                activeTab === 'general'
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 shadow-lg'
                  : 'text-neutral-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <Users className="w-4 h-4 text-cyan-400" />
              <span className="truncate">Other Students & Ustads</span>
            </button>
          </div>

          {/* Alert messages */}
          <div className="px-6 pt-4">
            {errorMsg && (
              <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}
            {successMsg && (
              <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>{successMsg}</span>
              </div>
            )}
          </div>

          {/* Form Content Area */}
          <div className="p-6">
            {/* TAB 1: 27 STUDENTS LOGIN */}
            {activeTab === 'students27' && (
              <form onSubmit={handleStudentSubmit} className="space-y-4">
                <div className="p-3.5 rounded-2xl bg-blue-500/5 border border-blue-500/15 mb-4">
                  <div className="flex items-center gap-2 text-blue-400 font-mono text-[11px] font-semibold mb-1">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>27-Student Cohort Credentials</span>
                  </div>
                  <p className="text-neutral-400 text-xs leading-relaxed">
                    Username: <span className="text-white font-mono">Admission Number (e.g. 297, 325, 333, 487)</span><br />
                    Password: <span className="text-white font-mono">Admission Number</span> (same as username).
                  </p>
                </div>

                <div className="space-y-2">
                  <label className="font-mono text-[10px] uppercase tracking-wider text-neutral-400 block">
                    Admission Number (Username)
                  </label>
                  <input
                    type="text"
                    required
                    value={studentAdNo}
                    onChange={(e) => {
                      setStudentAdNo(e.target.value);
                      if (!studentPass) setStudentPass(e.target.value);
                    }}
                    placeholder="e.g. 333"
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-neutral-500 text-sm focus:outline-none focus:border-blue-500/50"
                  />
                </div>

                <div className="space-y-2">
                  <label className="font-mono text-[10px] uppercase tracking-wider text-neutral-400 block">
                    Password (Admission Number)
                  </label>
                  <input
                    type="password"
                    required
                    value={studentPass}
                    onChange={(e) => setStudentPass(e.target.value)}
                    placeholder="Same as your admission number (e.g. 333)"
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-neutral-500 text-sm focus:outline-none focus:border-blue-500/50"
                  />
                </div>

                {/* Quick test picker */}
                <div className="pt-2">
                  <span className="font-mono text-[9px] uppercase tracking-wider text-neutral-500 block mb-2">
                    Quick Sample Students (Click to auto-fill):
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {['333 (Fayiz)', '328 (Hanan)', '297 (Shadi)', '338 (Thoyyib)', '342 (Noufan)', '487 (Swalahudheen)'].map((s) => {
                      const ad = s.split(' ')[0];
                      return (
                        <button
                          key={ad}
                          type="button"
                          onClick={() => {
                            setStudentAdNo(ad);
                            setStudentPass(ad);
                          }}
                          className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-blue-500/10 border border-white/5 hover:border-blue-500/20 text-[10px] font-mono text-neutral-300 hover:text-blue-300 transition-colors cursor-pointer"
                        >
                          {s}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full mt-4 py-3.5 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white font-mono text-xs font-bold uppercase tracking-wider shadow-lg shadow-blue-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  <span>Enter 27-Student Portal</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            )}

            {/* TAB 2: USTHAD LOGIN */}
            {activeTab === 'usthad' && (
              <form onSubmit={handleUsthadSubmit} className="space-y-4">
                <div className="p-3.5 rounded-2xl bg-amber-500/5 border border-amber-500/20 mb-4">
                  <div className="flex items-center gap-2 text-amber-400 font-mono text-[11px] font-semibold mb-1">
                    <Shield className="w-3.5 h-3.5" />
                    <span>Usthad Fazlu Rehman Hudawi • Faculty Credentials</span>
                  </div>
                  <p className="text-neutral-400 text-xs leading-relaxed">
                    Username: <span className="text-white font-mono font-bold">fsl</span><br />
                    Password: <span className="text-white font-mono font-bold">fsl</span>
                  </p>
                </div>

                <div className="space-y-2">
                  <label className="font-mono text-[10px] uppercase tracking-wider text-neutral-400 block">
                    Usthad Username
                  </label>
                  <input
                    type="text"
                    required
                    value={usthadUser}
                    onChange={(e) => setUsthadUser(e.target.value)}
                    placeholder="Enter 'fsl'"
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-neutral-500 text-sm focus:outline-none focus:border-amber-500/50"
                  />
                </div>

                <div className="space-y-2">
                  <label className="font-mono text-[10px] uppercase tracking-wider text-neutral-400 block">
                    Usthad Password
                  </label>
                  <input
                    type="password"
                    required
                    value={usthadPass}
                    onChange={(e) => setUsthadPass(e.target.value)}
                    placeholder="Enter 'fsl'"
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-neutral-500 text-sm focus:outline-none focus:border-amber-500/50"
                  />
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setUsthadUser('fsl');
                    setUsthadPass('fsl');
                  }}
                  className="w-full py-2 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-300 font-mono text-[11px] hover:bg-amber-500/20 transition-colors"
                >
                  Auto-fill Usthad credentials (fsl / fsl)
                </button>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full mt-4 py-3.5 rounded-xl bg-gradient-to-r from-amber-600 to-yellow-500 hover:from-amber-500 hover:to-yellow-400 text-white font-mono text-xs font-bold uppercase tracking-wider shadow-lg shadow-amber-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  <span>Enter Usthad Command Center</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            )}

            {/* TAB 3: OTHER ALL STUDENTS & USTADS */}
            {activeTab === 'general' && (
              <div className="space-y-4">
                {/* Role Switcher */}
                <div className="flex items-center gap-2 p-1.5 rounded-xl bg-white/5 border border-white/5">
                  <button
                    type="button"
                    onClick={() => setGeneralRole('student_general')}
                    className={`flex-1 py-2 rounded-lg font-mono text-[11px] font-semibold transition-all ${
                      generalRole === 'student_general'
                        ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                        : 'text-neutral-400 hover:text-white'
                    }`}
                  >
                    Campus Student
                  </button>
                  <button
                    type="button"
                    onClick={() => setGeneralRole('usthad_general')}
                    className={`flex-1 py-2 rounded-lg font-mono text-[11px] font-semibold transition-all ${
                      generalRole === 'usthad_general'
                        ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'
                        : 'text-neutral-400 hover:text-white'
                    }`}
                  >
                    Campus Usthad
                  </button>
                </div>

                <form onSubmit={handleGeneralSubmit} className="space-y-3">
                  {generalMode === 'register' && (
                    <div className="space-y-1">
                      <label className="font-mono text-[10px] uppercase tracking-wider text-neutral-400 block">
                        Full Name
                      </label>
                      <input
                        type="text"
                        required
                        value={generalName}
                        onChange={(e) => setGeneralName(e.target.value)}
                        placeholder="e.g. Zaid Bin Thabit"
                        className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs focus:outline-none focus:border-cyan-500/50"
                      />
                    </div>
                  )}

                  <div className="space-y-1">
                    <label className="font-mono text-[10px] uppercase tracking-wider text-neutral-400 block">
                      {generalRole === 'student_general' ? 'Student ID or Email' : 'Staff / Usthad ID or Email'}
                    </label>
                    <input
                      type="text"
                      required
                      value={generalIdOrEmail}
                      onChange={(e) => setGeneralIdOrEmail(e.target.value)}
                      placeholder={generalRole === 'student_general' ? 'e.g. STU-2041 or student@diia.edu' : 'e.g. UST-08 or ustad@diia.edu'}
                      className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs focus:outline-none focus:border-cyan-500/50"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-mono text-[10px] uppercase tracking-wider text-neutral-400 block">
                      Password
                    </label>
                    <input
                      type="password"
                      required
                      value={generalPass}
                      onChange={(e) => setGeneralPass(e.target.value)}
                      placeholder="Password"
                      className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs focus:outline-none focus:border-cyan-500/50"
                    />
                  </div>

                  {generalMode === 'register' && (
                    <div className="space-y-1">
                      <label className="font-mono text-[10px] uppercase tracking-wider text-neutral-400 block">
                        Department / Batch
                      </label>
                      <input
                        type="text"
                        value={generalDepartment}
                        onChange={(e) => setGeneralDepartment(e.target.value)}
                        placeholder="e.g. Sharia & Arts, Batch B"
                        className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs focus:outline-none focus:border-cyan-500/50"
                      />
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full mt-2 py-3 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-mono text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    <span>{generalMode === 'login' ? 'Sign In to Campus Hub' : 'Register Account'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </form>

                {/* Google Sign-In with Firebase Auth */}
                <div className="pt-2 border-t border-white/5 text-center">
                  <button
                    type="button"
                    onClick={handleGoogleSignIn}
                    className="w-full py-2.5 px-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-medium text-neutral-200 hover:text-white flex items-center justify-center gap-2.5 transition-colors"
                  >
                    <svg className="w-4 h-4" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                    </svg>
                    <span>Sign in with Google (Firebase Auth)</span>
                  </button>
                </div>

                {/* Switch between Login and Register */}
                <div className="text-center pt-1">
                  <button
                    type="button"
                    onClick={() => {
                      setGeneralMode(generalMode === 'login' ? 'register' : 'login');
                      setErrorMsg('');
                    }}
                    className="text-[11px] font-mono text-cyan-400 hover:text-cyan-300 underline underline-offset-4"
                  >
                    {generalMode === 'login'
                      ? "Don't have an account? Register as student or ustad"
                      : "Already registered? Switch to Sign In"}
                  </button>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
