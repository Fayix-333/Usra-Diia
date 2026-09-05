import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, LogOut, Shield, GraduationCap, Users, Bell, Plus, Trash2, Calendar, Award, CheckCircle, Search, Mail, ExternalLink, Sparkles, AlertTriangle, Send, Check } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { db, collection, addDoc } from '../firebase';

interface PortalDashboardProps {
  isOpen: boolean;
  onClose: () => void;
}

const TARGET_GMAIL = 'usradiia9@gmail.com';

export default function PortalDashboard({ isOpen, onClose }: PortalDashboardProps) {
  const { currentUser, logout, announcements, addAnnouncement, deleteAnnouncement, students27List } = useAuth();
  
  // Announcement creator state (Usthad)
  const [showAddNotice, setShowAddNotice] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');
  const [newPriority, setNewPriority] = useState<'normal' | 'urgent' | 'info'>('normal');
  const [newTarget, setNewTarget] = useState<'all' | 'students_27' | 'usthads'>('all');
  const [isPublishing, setIsPublishing] = useState(false);

  // Direct Message to usradiia9@gmail.com state
  const [showDirectMessage, setShowDirectMessage] = useState(false);
  const [directSubject, setDirectSubject] = useState('');
  const [directMessageText, setDirectMessageText] = useState('');
  const [isSendingDirect, setIsSendingDirect] = useState(false);
  const [directSentSuccess, setDirectSentSuccess] = useState(false);

  // Student search
  const [searchQuery, setSearchQuery] = useState('');

  if (!isOpen || !currentUser) return null;

  const isUsthad = currentUser.role === 'usthad_fsl';
  const isStudent27 = currentUser.role === 'student_27';
  const currentStudentData = isStudent27 ? students27List.find(s => s.adNo === currentUser.adNo) : null;

  const handleCreateAnnouncement = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newContent.trim()) return;

    setIsPublishing(true);
    await addAnnouncement(newTitle.trim(), newContent.trim(), newPriority, newTarget);
    setIsPublishing(false);
    setNewTitle('');
    setNewContent('');
    setShowAddNotice(false);
  };

  const handleSendDirectMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!directMessageText.trim()) return;

    setIsSendingDirect(true);
    const sub = directSubject.trim() || `Portal Note from ${currentUser.name} (${currentUser.role})`;
    const senderEmail = currentUser.email || `${currentUser.adNo || 'portal'}@darulirfan.edu`;

    try {
      // 1. Log to Firestore
      addDoc(collection(db, 'inquiries'), {
        name: currentUser.name,
        email: senderEmail,
        subject: sub,
        message: directMessageText.trim(),
        targetEmail: TARGET_GMAIL,
        senderRole: currentUser.role,
        adNo: currentUser.adNo || null,
        createdAt: new Date().toISOString(),
        source: 'portal_dashboard'
      }).catch(err => console.warn('Firestore portal message note:', err));

      // 2. Relay via server endpoint
      fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: currentUser.name,
          email: senderEmail,
          subject: sub,
          message: directMessageText.trim(),
          targetEmail: TARGET_GMAIL,
        })
      }).catch(err => console.warn('Server contact dispatch warning:', err));

      // 3. Relay via FormSubmit
      fetch(`https://formsubmit.co/ajax/${TARGET_GMAIL}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify({
          name: currentUser.name,
          email: senderEmail,
          subject: `[USRA Portal Direct] ${sub}`,
          message: directMessageText.trim(),
          _subject: `[USRA Portal Direct] ${sub}`,
          _replyto: senderEmail,
          _captcha: 'false'
        })
      }).catch(err => console.warn('FormSubmit portal relay warning:', err));

      setDirectSentSuccess(true);
      setTimeout(() => {
        setDirectMessageText('');
        setDirectSubject('');
        setDirectSentSuccess(false);
        setShowDirectMessage(false);
      }, 3500);
    } catch (e) {
      console.error('Failed to send direct message:', e);
    } finally {
      setIsSendingDirect(false);
    }
  };

  const directGmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(TARGET_GMAIL)}&su=${encodeURIComponent(`[USRA Portal] ${directSubject.trim() || 'Portal Message from ' + currentUser.name}`)}&body=${encodeURIComponent(`Sender: ${currentUser.name} (${currentUser.role})\n\nMessage:\n${directMessageText.trim()}`)}`;

  const filteredStudents = students27List.filter(s =>
    s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.adNo.includes(searchQuery) ||
    s.rollNo.toString().includes(searchQuery)
  );

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/85 backdrop-blur-md"
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 20 }}
          className="relative w-full max-w-5xl rounded-3xl bg-[#09090b] border border-white/10 shadow-[0_25px_70px_rgba(0,0,0,0.9)] overflow-hidden z-10 my-auto max-h-[92vh] flex flex-col"
        >
          {/* Header Bar */}
          <div className="p-6 pb-4 border-b border-white/10 flex flex-wrap items-center justify-between gap-4 bg-neutral-950/70">
            <div className="flex items-center gap-3">
              <div className={`w-11 h-11 rounded-2xl flex items-center justify-center border shadow-lg ${
                isUsthad 
                  ? 'bg-amber-500/10 border-amber-500/30 text-amber-400' 
                  : isStudent27 
                  ? 'bg-blue-500/10 border-blue-500/30 text-blue-400' 
                  : 'bg-cyan-500/10 border-cyan-500/30 text-cyan-400'
              }`}>
                {isUsthad ? <Shield className="w-5 h-5" /> : isStudent27 ? <GraduationCap className="w-5 h-5" /> : <Users className="w-5 h-5" />}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-0.5 rounded-full text-[9px] font-mono uppercase tracking-widest font-bold border ${
                    isUsthad
                      ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                      : isStudent27
                      ? 'bg-blue-500/20 text-blue-300 border-blue-500/40'
                      : 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40'
                  }`}>
                    {isUsthad ? 'Usthad Executive' : isStudent27 ? `27 Cohort • Ad No: ${currentUser.adNo}` : 'Campus Member'}
                  </span>
                  <span className="text-[10px] font-mono text-emerald-400 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    Authenticated
                  </span>
                </div>
                <h2 className="font-display font-black text-xl text-white tracking-wide mt-1">
                  {currentUser.name}
                </h2>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowDirectMessage(prev => !prev)}
                className={`px-3 py-2 rounded-xl text-xs font-mono flex items-center gap-1.5 transition-all border cursor-pointer ${
                  showDirectMessage
                    ? 'bg-blue-600 text-white border-blue-400 shadow-lg shadow-blue-500/25'
                    : 'bg-blue-500/10 hover:bg-blue-500/20 text-blue-300 border-blue-500/30'
                }`}
                title="Send direct message to usradiia9@gmail.com"
              >
                <Mail className="w-3.5 h-3.5 text-cyan-400" />
                <span className="hidden sm:inline">Message usradiia9@gmail.com</span>
                <span className="sm:hidden">Direct Mail</span>
              </button>
              <button
                onClick={() => {
                  logout();
                  onClose();
                }}
                className="px-3.5 py-2 rounded-xl bg-white/5 hover:bg-rose-500/20 border border-white/5 hover:border-rose-500/30 text-neutral-300 hover:text-rose-300 text-xs font-mono flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Sign Out</span>
              </button>
              <button
                onClick={onClose}
                className="p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 text-neutral-400 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Scrollable Dashboard Body */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">

            {/* DIRECT MESSAGE PANEL TO usradiia9@gmail.com */}
            <AnimatePresence>
              {showDirectMessage && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="overflow-hidden"
                >
                  <form
                    onSubmit={handleSendDirectMessage}
                    className="p-5 rounded-2xl bg-gradient-to-r from-blue-950/40 via-neutral-900/60 to-cyan-950/30 border border-blue-500/30 space-y-3 relative shadow-xl"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/10 pb-2.5">
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                        <h4 className="font-display font-bold text-sm text-white flex items-center gap-1.5">
                          <span>Direct Message to Union Administration</span>
                        </h4>
                      </div>
                      <div className="flex items-center gap-1.5 text-cyan-300 font-mono text-[11px] bg-white/5 px-2.5 py-1 rounded-lg border border-white/10">
                        <Mail className="w-3 h-3 text-cyan-400" />
                        <span>Destination: {TARGET_GMAIL}</span>
                      </div>
                    </div>

                    <p className="text-neutral-300 text-xs leading-relaxed">
                      Type your confidential request, notice, or note below. It will be routed directly to{' '}
                      <strong className="text-cyan-300 font-mono">{TARGET_GMAIL}</strong> from your authenticated student/faculty session ({currentUser.name}).
                    </p>

                    <div className="grid grid-cols-1 gap-2.5">
                      <input
                        type="text"
                        value={directSubject}
                        onChange={(e) => setDirectSubject(e.target.value)}
                        placeholder="Subject or Query Title (optional)"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs placeholder-neutral-500 focus:outline-none focus:border-cyan-500/50"
                      />
                      <textarea
                        required
                        rows={3}
                        value={directMessageText}
                        onChange={(e) => setDirectMessageText(e.target.value)}
                        placeholder="Type your message here..."
                        className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs placeholder-neutral-500 focus:outline-none focus:border-cyan-500/50 resize-none"
                      />
                    </div>

                    {directSentSuccess ? (
                      <div className="p-3 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-mono flex items-center gap-2">
                        <Check className="w-4 h-4 text-emerald-400" />
                        <span>Message successfully routed directly to {TARGET_GMAIL}!</span>
                      </div>
                    ) : (
                      <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
                        <a
                          href={directGmailUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="text-[11px] font-mono text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
                        >
                          <ExternalLink className="w-3 h-3" />
                          <span>Open pre-drafted in Gmail</span>
                        </a>
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => setShowDirectMessage(false)}
                            className="px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-neutral-400 text-xs font-mono"
                          >
                            Cancel
                          </button>
                          <button
                            type="submit"
                            disabled={isSendingDirect || !directMessageText.trim()}
                            className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white text-xs font-mono font-bold uppercase tracking-wider flex items-center gap-1.5 transition-colors cursor-pointer"
                          >
                            {isSendingDirect ? (
                              <span>Dispatching...</span>
                            ) : (
                              <>
                                <span>Send Direct to {TARGET_GMAIL}</span>
                                <Send className="w-3 h-3" />
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                    )}
                  </form>
                </motion.div>
              )}
            </AnimatePresence>
            
            {/* ROLE-BASED TOP BANNER */}
            {isStudent27 && (
              <div className="p-6 rounded-2xl bg-gradient-to-r from-blue-900/30 via-indigo-900/20 to-neutral-900/40 border border-blue-500/20 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-48 h-48 bg-blue-500/10 rounded-full blur-2xl pointer-events-none" />
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 relative z-10">
                  <div>
                    <span className="text-[10px] font-mono uppercase text-neutral-400 block">Admission Number</span>
                    <span className="text-xl font-bold font-mono text-blue-400">{currentUser.adNo}</span>
                  </div>
                  <div>
                    <span className="text-[10px] font-mono uppercase text-neutral-400 block">Academic Class</span>
                    <span className="text-sm font-semibold text-white">27-Student Cohort</span>
                  </div>
                  <div>
                    <span className="text-[10px] font-mono uppercase text-neutral-400 block">Department / House</span>
                    <span className="text-sm font-semibold text-cyan-300">{currentStudentData?.house || currentUser.department || 'Cordova'}</span>
                  </div>
                  <div>
                    <span className="text-[10px] font-mono uppercase text-neutral-400 block">Attendance Standing</span>
                    <span className="text-sm font-semibold text-emerald-400">{currentStudentData ? `${currentStudentData.attendance}% Regular` : '96% Regular'}</span>
                  </div>
                </div>
              </div>
            )}

            {isUsthad && (
              <div className="p-6 rounded-2xl bg-gradient-to-r from-amber-900/30 via-yellow-900/15 to-neutral-900/40 border border-amber-500/25 relative overflow-hidden">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2 text-amber-400 font-mono text-[11px] font-bold mb-1">
                      <Shield className="w-4 h-4" />
                      <span>FACULTY OVERSIGHT & MENTORING PORTAL</span>
                    </div>
                    <p className="text-neutral-300 text-xs">
                      Logged in as <span className="text-amber-200 font-semibold">Usthad Fazlu Rehman Hudawi</span> with faculty mentoring authority <span className="font-mono text-amber-300 font-semibold">[username: fsl]</span>. You have direct oversight over cohort notices, class records, and union broadcasts.
                    </p>
                  </div>
                  <button
                    onClick={() => setShowAddNotice(!showAddNotice)}
                    className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-mono text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-colors cursor-pointer shadow-lg shadow-amber-500/20"
                  >
                    <Plus className="w-4 h-4" />
                    <span>{showAddNotice ? 'Close Notice Form' : 'Post New Notice'}</span>
                  </button>
                </div>
              </div>
            )}

            {/* USTHAD NOTICE POSTING FORM */}
            {isUsthad && showAddNotice && (
              <motion.form
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                onSubmit={handleCreateAnnouncement}
                className="p-6 rounded-2xl bg-neutral-900/80 border border-amber-500/30 space-y-4 shadow-xl"
              >
                <div className="flex items-center justify-between border-b border-white/5 pb-2">
                  <h3 className="font-display font-bold text-sm text-white">Create Official Directive (Saves to Firestore Database)</h3>
                  <span className="font-mono text-[9px] uppercase tracking-wider text-amber-400">Usthad Directive</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="sm:col-span-2">
                    <label className="text-[10px] font-mono uppercase text-neutral-400 block mb-1">Notice Title</label>
                    <input
                      type="text"
                      required
                      value={newTitle}
                      onChange={(e) => setNewTitle(e.target.value)}
                      placeholder="e.g. Mandatory Class Review Session"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs focus:outline-none focus:border-amber-500/50"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-mono uppercase text-neutral-400 block mb-1">Priority</label>
                    <select
                      value={newPriority}
                      onChange={(e: any) => setNewPriority(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-900 border border-white/10 text-white text-xs focus:outline-none focus:border-amber-500/50"
                    >
                      <option value="normal">Normal</option>
                      <option value="urgent">Urgent</option>
                      <option value="info">Informational</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-[10px] font-mono uppercase text-neutral-400 block mb-1">Directive Details / Instructions</label>
                  <textarea
                    required
                    rows={3}
                    value={newContent}
                    onChange={(e) => setNewContent(e.target.value)}
                    placeholder="Write announcement details for the cohort..."
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs focus:outline-none focus:border-amber-500/50 resize-none"
                  />
                </div>

                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setShowAddNotice(false)}
                    className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-neutral-400 text-xs font-mono"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isPublishing}
                    className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-mono text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-colors"
                  >
                    {isPublishing ? 'Broadcasting...' : 'Broadcast to Firestore'}
                  </button>
                </div>
              </motion.form>
            )}

            {/* OFFICIAL ANNOUNCEMENTS SECTION */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Bell className="w-4 h-4 text-blue-400" />
                  <h3 className="font-display font-bold text-base text-white">
                    Official Directives & Announcements
                  </h3>
                </div>
                <span className="font-mono text-[10px] text-neutral-400">
                  {announcements.length} Active Directives
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {announcements.map((item) => (
                  <div
                    key={item.id}
                    className={`p-4 rounded-2xl border transition-all ${
                      item.priority === 'urgent'
                        ? 'bg-rose-950/20 border-rose-500/30'
                        : 'bg-white/[0.02] border-white/5 hover:border-blue-500/20'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <span className={`px-2 py-0.5 rounded-md text-[9px] font-mono font-bold uppercase tracking-wider ${
                        item.priority === 'urgent'
                          ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                          : 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                      }`}>
                        {item.priority}
                      </span>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-[9px] text-neutral-500">
                          {new Date(item.createdAt).toLocaleDateString()}
                        </span>
                        {isUsthad && (
                          <button
                            onClick={() => deleteAnnouncement(item.id)}
                            className="p-1 rounded text-neutral-500 hover:text-rose-400 transition-colors"
                            title="Delete announcement"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>
                    <h4 className="font-display font-bold text-sm text-white mb-1.5">{item.title}</h4>
                    <p className="text-neutral-300 text-xs leading-relaxed mb-3">{item.content}</p>
                    <div className="flex items-center justify-between pt-2 border-t border-white/5 text-[10px] font-mono text-neutral-400">
                      <span>Posted by: {item.authorName}</span>
                      <span className="text-blue-400">{item.authorRole}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 27-STUDENT COHORT ROSTER */}
            <div className="space-y-3 pt-4 border-t border-white/5">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div>
                  <h3 className="font-display font-bold text-base text-white flex items-center gap-2">
                    <GraduationCap className="w-4 h-4 text-cyan-400" />
                    <span>The 27-Student Cohort Roster</span>
                  </h3>
                  <p className="text-neutral-400 text-xs">
                    Academic Year 2026-27 • Username & Password matches each student&#39;s Admission Number
                  </p>
                </div>
                
                {/* Search Bar */}
                <div className="relative w-full sm:w-64">
                  <Search className="w-3.5 h-3.5 text-neutral-500 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search by Ad No or Name..."
                    className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs placeholder-neutral-500 focus:outline-none focus:border-cyan-500/50"
                  />
                </div>
              </div>

              {/* Table / Grid */}
              <div className="rounded-2xl border border-white/5 overflow-hidden bg-white/[0.01]">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-neutral-950/80 font-mono text-[10px] uppercase tracking-wider text-neutral-400 border-b border-white/5">
                      <tr>
                        <th className="p-3 pl-4">Roll</th>
                        <th className="p-3">Ad No (Login)</th>
                        <th className="p-3">Student Name</th>
                        <th className="p-3">House</th>
                        <th className="p-3">Union Designation</th>
                        <th className="p-3 text-right pr-4">Attendance</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5 font-sans">
                      {filteredStudents.map((stu) => {
                        const isThisUser = currentUser.adNo === stu.adNo;
                        return (
                          <tr
                            key={stu.adNo}
                            className={`hover:bg-white/[0.03] transition-colors ${
                              isThisUser ? 'bg-blue-500/10 font-medium' : ''
                            }`}
                          >
                            <td className="p-3 pl-4 font-mono text-neutral-400">#{stu.rollNo}</td>
                            <td className="p-3 font-mono text-cyan-400 font-semibold">
                              {stu.adNo}
                              {isThisUser && (
                                <span className="ml-1.5 px-1.5 py-0.5 rounded text-[9px] bg-blue-500/20 text-blue-300">You</span>
                              )}
                            </td>
                            <td className="p-3 text-white font-medium">{stu.name}</td>
                            <td className="p-3 text-neutral-300">{stu.house}</td>
                            <td className="p-3 text-neutral-400 text-[11px]">{stu.roleTitle || 'Class Member'}</td>
                            <td className="p-3 text-right pr-4 font-mono text-emerald-400">{stu.attendance}%</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
