import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Shield, Target, Compass, Award, Search, Users, X } from 'lucide-react';
import { TimelineItem } from '../types';

const timelineData: TimelineItem[] = [
  {
    id: 'vision',
    year: '01',
    title: 'Our Vision',
    description: 'To cultivate a generation of confident Muslim students who combine Islamic values, academic excellence, and creative media skills to positively influence society through meaningful storytelling and innovation.',
    details: [
      'Empowering student voices through ethical media.',
      'Promoting creativity rooted in Islamic principles.',
      'Building future-ready leaders with purpose.'
    ]
  },
  {
    id: 'mission',
    year: '02',
    title: 'Our Mission',
    description: 'To document, celebrate, and amplify every milestone of our class while strengthening unity, brotherhood, and collaboration through high-quality digital content, events, and responsible communication.',
    details: [
      'Delivering professional event coverage.',
      'Encouraging transparent and respectful communication.',
      'Preserving our class\'s memories and achievements.'
    ]
  },
  {
    id: 'objectives',
    year: '03',
    title: 'Core Objectives',
    description: 'Providing every student with opportunities to develop leadership, creativity, teamwork, and technical skills while contributing to the growth of our class and the wider LISAN Students\' Union community.',
    details: [
      'Organizing impactful educational and creative programs.',
      'Developing skills in design, photography, videography, and media.',
      'Encouraging collaboration, discipline, and innovation.'
    ]
  },
  {
    id: 'commitment',
    year: '04',
    title: 'Our Commitment',
    description: 'Creating an inspiring environment where every member feels valued, connected, and motivated to contribute with sincerity, excellence (Ihsan), and responsibility in service of our academy and community.',
    details: [
      'Strengthening unity and brotherhood.',
      'Upholding Islamic ethics in every initiative.',
      'Inspiring continuous learning, service, and excellence.'
    ]
  }
];

interface StudentMember {
  id: string;
  name: string;
  admissionNo: string;
  imageUrl?: string;
}

const students: StudentMember[] = [
  { id: 'm-1', name: 'Sinan.P', admissionNo: '325', imageUrl: 'https://images.unsplash.com/photo-1783659959902-eeda703b48fc?q=80&w=735&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' },
  { id: 'm-2', name: 'Asad', admissionNo: '326' },
  { id: 'm-3', name: 'Hanan', admissionNo: '328', imageUrl: 'https://images.unsplash.com/photo-1783651375211-7a7527b4b2f0?q=80&w=735&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' },
  { id: 'm-4', name: 'Hamdan', admissionNo: '329' },
  { id: 'm-5', name: 'Ajsal', admissionNo: '330', imageUrl: 'https://images.unsplash.com/photo-1783656348207-3f95dfc02382?q=80&w=735&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' },
  { id: 'm-6', name: 'Afnan.T', admissionNo: '332', imageUrl: 'https://images.unsplash.com/photo-1783656348061-d2d1fcb8c364?q=80&w=735&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' },
  { id: 'm-7', name: 'Fayiz', admissionNo: '333', imageUrl: 'https://images.unsplash.com/photo-1783655938800-a20974656824?q=80&w=735&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' },
  { id: 'm-8', name: 'Raheem', admissionNo: '336' },
  { id: 'm-9', name: 'Farhan', admissionNo: '337', imageUrl: 'https://images.unsplash.com/photo-1783656386136-8188e5289973?q=80&w=735&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' },
  { id: 'm-10', name: 'Thoyyib', admissionNo: '338', imageUrl: 'https://images.unsplash.com/photo-1783659998320-6f721f9b5d98?q=80&w=735&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' },
  { id: 'm-11', name: 'Ashbal', admissionNo: '339', imageUrl: 'https://images.unsplash.com/photo-1783656368832-0ecf5652e4ad?q=80&w=735&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' },
  { id: 'm-12', name: 'Rimshid Sajin', admissionNo: '341', imageUrl: 'https://images.unsplash.com/photo-1783659973465-19c07861a62f?q=80&w=735&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' },
  { id: 'm-13', name: 'Noufan', admissionNo: '342', imageUrl: 'https://images.unsplash.com/photo-1783651375248-806790718442?q=80&w=735&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' },
  { id: 'm-14', name: 'Jasim', admissionNo: '343' },
  { id: 'm-15', name: 'Ashfin', admissionNo: '344' },
  { id: 'm-16', name: 'Sinan.A', admissionNo: '345', imageUrl: 'https://images.unsplash.com/photo-1783659666901-c9364ab9ed0a?q=80&w=735&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' },
  { id: 'm-17', name: 'Shihan', admissionNo: '347', imageUrl: 'https://images.unsplash.com/photo-1783651312010-5587aa521a8e?q=80&w=735&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' },
  { id: 'm-18', name: 'Anas', admissionNo: '348' },
  { id: 'm-19', name: 'Sinan.P', admissionNo: '350', imageUrl: 'https://images.unsplash.com/photo-1783659998293-658661dc1d14?q=80&w=735&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' },
  { id: 'm-20', name: 'Ansil', admissionNo: '351' },
  { id: 'm-21', name: 'Iyas', admissionNo: '352', imageUrl: 'https://images.unsplash.com/photo-1783656386141-a497474796fa?q=80&w=735&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' },
  { id: 'm-22', name: 'Nihad.P', admissionNo: '355' },
  { id: 'm-23', name: 'Swafvan.C', admissionNo: '356', imageUrl: 'https://images.unsplash.com/photo-1783659973415-7e659f70a495?q=80&w=735&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' },
  { id: 'm-24', name: 'Shahin', admissionNo: '357', imageUrl: 'https://images.unsplash.com/photo-1783659973468-ac47d8f8e667?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' },
  { id: 'm-25', name: 'Swafvan.P', admissionNo: '375', imageUrl: 'https://images.unsplash.com/photo-1783659973118-a5066496de6a?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' },
  { id: 'm-26', name: 'Shadi', admissionNo: '297' },
  { id: 'm-27', name: 'Ayyoobi', admissionNo: '487', imageUrl: 'https://images.unsplash.com/photo-1783656368854-5b8633d691e5?q=80&w=735&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' },
];

const gradients = [
  'from-blue-600 to-cyan-500',
  'from-cyan-500 to-blue-600',
  'from-indigo-600 to-blue-500',
  'from-purple-600 to-indigo-500',
  'from-blue-500 to-teal-400',
  'from-cyan-400 to-indigo-500',
];

const getGradient = (index: number) => gradients[index % gradients.length];

const getInitials = (name: string) => {
  const parts = name.replace('.', ' ').trim().split(/\s+/);
  if (parts.length >= 2) {
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }
  return parts[0].substring(0, 2).toUpperCase();
};

export default function About() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStudent, setSelectedStudent] = useState<StudentMember | null>(null);
  const [selectedStudentIndex, setSelectedStudentIndex] = useState<number | null>(null);

  const filteredStudents = students.filter(student => 
    student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    student.admissionNo.includes(searchQuery)
  );

  const getIcon = (id: string) => {
    switch (id) {
      case 'vision': return <Compass className="w-5 h-5 text-blue-400" />;
      case 'mission': return <Shield className="w-5 h-5 text-cyan-400" />;
      case 'objectives': return <Target className="w-5 h-5 text-blue-500" />;
      default: return <Award className="w-5 h-5 text-indigo-400" />;
    }
  };

  return (
    <section id="about" className="relative py-28 overflow-hidden bg-[#030303]">
      {/* Background soft lighting glows */}
      <div className="absolute top-1/3 left-0 w-[450px] h-[450px] bg-blue-600/5 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-1/3 right-0 w-[450px] h-[450px] bg-cyan-600/5 rounded-full blur-[140px] pointer-events-none" />

      <div className="container mx-auto px-6 relative z-10 max-w-6xl">
        {/* Section Heading */}
        <div className="text-center mb-20">
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.6 }}
            className="font-mono text-[10px] uppercase tracking-[0.3em] text-blue-500 font-bold mb-3"
          >
            Aesthetic Heritage
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="font-display font-black text-4xl md:text-6xl text-white tracking-tight"
          >
            The Foundations of USRA
          </motion.h2>
          <motion.div
            initial={{ width: 0 }}
            whileInView={{ width: 80 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="h-1 bg-gradient-to-r from-blue-600 to-cyan-400 mx-auto mt-6 rounded-full"
          />
        </div>

        {/* Elegant Timeline Layout */}
        <div className="relative border-l border-white/5 md:border-l-0 md:grid md:grid-cols-2 md:gap-x-12 md:gap-y-16 md:before:absolute md:before:top-0 md:before:bottom-0 md:before:left-1/2 md:before:-translate-x-1/2 md:before:w-px md:before:bg-gradient-to-b md:before:from-blue-600/20 md:before:via-white/10 md:before:to-cyan-400/20">
          
          {timelineData.map((item, index) => {
            const isEven = index % 2 === 0;

            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-100px' }}
                transition={{ duration: 0.8, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
                className={`relative pl-8 md:pl-0 md:w-full flex ${
                  isEven ? 'md:justify-end md:pr-12' : 'md:justify-start md:pl-12'
                }`}
              >
                {/* Timeline center node/dot */}
                <div className={`absolute top-0 left-0 w-3 h-3 rounded-full bg-neutral-950 border-2 border-blue-500/80 -translate-x-[6px] md:left-1/2 md:-translate-x-[6px] shadow-[0_0_12px_#3b82f6] z-20`} />

                {/* Main Card */}
                <div className="max-w-md w-full glass-card p-8 rounded-3xl relative group overflow-hidden">
                  {/* Subtle inner card glass reflection shine */}
                  <div className="absolute top-0 inset-x-0 h-20 bg-gradient-to-b from-white/5 to-transparent pointer-events-none" />

                  {/* Top Header */}
                  <div className="flex items-center justify-between mb-6 relative z-10">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center">
                        {getIcon(item.id)}
                      </div>
                      <h3 className="font-display font-bold text-xl text-white group-hover:text-blue-400 transition-colors duration-300">
                        {item.title}
                      </h3>
                    </div>
                    <span className="font-mono text-3xl font-extrabold text-neutral-800 tracking-tighter select-none">
                      {item.year}
                    </span>
                  </div>

                  {/* Body description */}
                  <p className="text-neutral-400 text-sm leading-relaxed mb-6">
                    {item.description}
                  </p>

                  {/* Additional Bullet Details */}
                  {item.details && (
                    <ul className="space-y-2 text-xs text-neutral-500 border-t border-white/5 pt-4">
                      {item.details.map((detail, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-blue-500/60 mt-1.5 shrink-0" />
                          <span>{detail}</span>
                        </li>
                      ))}
                    </ul>
                  )}

                  {/* Glowing hover accent boundary */}
                  <div className="absolute -bottom-10 -right-10 w-24 h-24 bg-blue-500/5 group-hover:bg-blue-500/10 rounded-full blur-2xl transition-all duration-500 pointer-events-none" />
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Class Registry / Members Section */}
        <div id="members-registry" className="mt-32 pt-20 border-t border-white/5">
          {/* Section Sub-heading */}
          <div className="text-center mb-12">
            <motion.p
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-100px' }}
              transition={{ duration: 0.6 }}
              className="font-mono text-[10px] uppercase tracking-[0.3em] text-cyan-400 font-bold mb-3"
            >
              Class Registry
            </motion.p>
            <motion.h3
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-100px' }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="font-display font-black text-3xl md:text-5xl text-white tracking-tight uppercase"
            >
              USRA Class Members
            </motion.h3>
            <motion.div
              initial={{ width: 0 }}
              whileInView={{ width: 80 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="h-1 bg-gradient-to-r from-cyan-500 to-blue-500 mx-auto mt-4 rounded-full"
            />
          </div>

          {/* Search bar & Statistics */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-10 max-w-2xl mx-auto">
            {/* Search Input Container */}
            <div className="relative w-full sm:max-w-md">
              <span className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                <Search className="w-4 h-4 text-neutral-500" />
              </span>
              <input
                type="text"
                placeholder="Search member by name or Ad. No..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-11 pr-4 py-3 text-sm bg-neutral-950/80 border border-white/5 rounded-2xl text-white placeholder-neutral-500 focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/20 transition-all"
              />
            </div>

            {/* Total Badge */}
            <div className="flex items-center gap-2 px-4 py-2.5 rounded-2xl border border-white/5 bg-neutral-950/40 text-xs font-mono text-neutral-400">
              <Users className="w-3.5 h-3.5 text-cyan-400" />
              <span>TOTAL MEMBERS: <span className="text-white font-bold">{filteredStudents.length}</span></span>
            </div>
          </div>

          {/* Members Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {filteredStudents.map((student, index) => (
              <motion.div
                key={student.id}
                initial={{ opacity: 0, y: 24, scale: 0.95 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true, margin: '-40px' }}
                whileHover={{ y: -6, scale: 1.035 }}
                whileTap={{ scale: 0.96 }}
                transition={{ 
                  type: 'spring', 
                  stiffness: 280, 
                  damping: 24, 
                  mass: 0.6,
                  delay: (index % 12) * 0.035 
                }}
                onClick={() => {
                  setSelectedStudent(student);
                  setSelectedStudentIndex(index);
                }}
                className="glass-card p-5 rounded-2xl relative group overflow-hidden flex flex-col items-center text-center border border-white/5 bg-white/[0.02] hover:border-cyan-500/30 cursor-pointer select-none"
              >
                {/* Micro reflection sweep */}
                <div className="absolute top-0 inset-x-0 h-10 bg-gradient-to-b from-white/5 to-transparent pointer-events-none" />

                {/* Ambient backdrop aura */}
                <div className="absolute -top-10 -left-10 w-20 h-20 bg-cyan-500/5 group-hover:bg-cyan-500/10 rounded-full blur-xl transition-all duration-500 pointer-events-none" />

                {/* Stylized Avatar Placeholder with initials or custom photo */}
                <div className={`relative w-14 h-14 rounded-full overflow-hidden flex items-center justify-center font-display font-black text-sm text-white bg-gradient-to-tr ${getGradient(index)} shadow-[0_0_15px_rgba(6,182,212,0.1)] group-hover:shadow-[0_0_20px_rgba(6,182,212,0.3)] transition-all duration-500 mb-3`}>
                  {student.imageUrl ? (
                    <img
                      src={student.imageUrl}
                      alt={student.name}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                  ) : (
                    <span>{getInitials(student.name)}</span>
                  )}
                </div>

                {/* Student Details */}
                <h4 className="font-display font-bold text-xs text-white group-hover:text-cyan-400 transition-colors duration-200">
                  {student.name}
                </h4>
                <div className="font-mono text-[9px] text-cyan-400 bg-cyan-500/10 border border-cyan-500/20 px-2.5 py-0.5 rounded-full mt-2 font-bold select-none">
                  AD. NO: {student.admissionNo}
                </div>

                {/* Bottom line accent */}
                <div className="absolute bottom-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-cyan-500 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500" />
              </motion.div>
            ))}
          </div>

          {/* No Results Message */}
          {filteredStudents.length === 0 && (
            <div className="text-center py-12 text-neutral-500 font-mono text-xs">
              No class members found matching your search.
            </div>
          )}
        </div>
      </div>

      {/* Member Modal Popup */}
      <AnimatePresence>
        {selectedStudent && selectedStudentIndex !== null && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              onClick={() => {
                setSelectedStudent(null);
                setSelectedStudentIndex(null);
              }}
              className="absolute inset-0 bg-black/85 backdrop-blur-md"
            />

            {/* Modal Container */}
            <motion.div
              initial={{ opacity: 0, scale: 0.94, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.94, y: 30 }}
              transition={{ type: 'spring', damping: 30, stiffness: 320 }}
              className="relative w-full max-w-sm bg-neutral-950 border border-white/10 rounded-[32px] overflow-hidden p-8 flex flex-col items-center text-center shadow-[0_24px_50px_rgba(0,0,0,0.5)] z-10"
            >
              {/* Close Button */}
              <button
                onClick={() => {
                  setSelectedStudent(null);
                  setSelectedStudentIndex(null);
                }}
                className="absolute top-5 right-5 p-2 rounded-full bg-white/5 border border-white/5 text-neutral-400 hover:text-white hover:bg-white/10 hover:border-white/10 transition-all cursor-pointer"
                aria-label="Close modal"
              >
                <X className="w-4 h-4" />
              </button>

              {/* Top decorative glass effect */}
              <div className="absolute top-0 inset-x-0 h-28 bg-gradient-to-b from-white/5 to-transparent pointer-events-none" />

              {/* Glow Backdrop aura */}
              <div className="absolute -top-12 -left-12 w-48 h-48 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none animate-pulse" />

              {/* Avatar with gradient or custom photo */}
              <div className={`relative w-24 h-24 rounded-full overflow-hidden flex items-center justify-center font-display font-black text-3xl text-white bg-gradient-to-tr ${getGradient(selectedStudentIndex)} shadow-[0_0_30px_rgba(6,182,212,0.15)] mb-6`}>
                {selectedStudent.imageUrl ? (
                  <img
                    src={selectedStudent.imageUrl}
                    alt={selectedStudent.name}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span>{getInitials(selectedStudent.name)}</span>
                )}
              </div>

              {/* Name & Admission Info */}
              <h3 className="font-display font-black text-2xl text-white tracking-tight">
                {selectedStudent.name}
              </h3>
              <div className="font-mono text-xs text-cyan-400 bg-cyan-500/10 border border-cyan-500/20 px-4 py-1.5 rounded-full mt-3 font-bold select-none">
                ADMISSION NO: {selectedStudent.admissionNo}
              </div>

              {/* Interactive Student Details Info */}
              <div className="w-full mt-8 pt-6 border-t border-white/5 space-y-4 text-left">
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-widest text-neutral-500 block">Class Association</span>
                  <span className="text-xs text-neutral-300 font-sans mt-1 block">USRA Batch • S5 Academic Session</span>
                </div>
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-widest text-neutral-500 block">Official Status</span>
                  <div className="flex items-center gap-2 mt-1.5">
                    <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
                    <span className="text-xs text-cyan-400 font-mono font-bold uppercase tracking-wider">Active Member</span>
                  </div>
                </div>
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-widest text-neutral-500 block">Commitment Statement</span>
                  <p className="text-xs text-neutral-400 italic font-sans mt-1 leading-relaxed">
                    "Striving for academic brilliance, moral perfection, and proactive societal contributions in unity & brotherhood."
                  </p>
                </div>
              </div>

              {/* Decorative Bottom highlight line */}
              <div className="absolute bottom-0 inset-x-0 h-[3px] bg-gradient-to-r from-transparent via-cyan-500 to-transparent" />
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}
