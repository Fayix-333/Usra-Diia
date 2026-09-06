import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Shield, Target, Compass, Award, Search, Users, X, MapPin, CheckCircle2, Sparkles } from 'lucide-react';
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
  rollNo: number;
  adNo: string;
  admissionNo: string;
  name: string;
  status: string;
  house: string;
  attendance: number;
  roleTitle: string;
  zehnuthPoints: number;
  imageUrl?: string;
}

const STUDENT_IMAGES: Record<string, string> = {
  '325': 'https://images.unsplash.com/photo-1783659959902-eeda703b48fc?q=80&w=735&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  '328': 'https://images.unsplash.com/photo-1783651375211-7a7527b4b2f0?q=80&w=735&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  '330': 'https://images.unsplash.com/photo-1783656348207-3f95dfc02382?q=80&w=735&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  '332': 'https://images.unsplash.com/photo-1783656348061-d2d1fcb8c364?q=80&w=735&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  '333': 'https://images.unsplash.com/photo-1783655938800-a20974656824?q=80&w=735&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  '337': 'https://images.unsplash.com/photo-1783656386136-8188e5289973?q=80&w=735&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  '338': 'https://images.unsplash.com/photo-1783659998320-6f721f9b5d98?q=80&w=735&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  '339': 'https://images.unsplash.com/photo-1783656368832-0ecf5652e4ad?q=80&w=735&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  '341': 'https://images.unsplash.com/photo-1783659973465-19c07861a62f?q=80&w=735&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  '342': 'https://images.unsplash.com/photo-1783651375248-806790718442?q=80&w=735&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  '345': 'https://images.unsplash.com/photo-1783659666901-c9364ab9ed0a?q=80&w=735&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  '347': 'https://images.unsplash.com/photo-1783651312010-5587aa521a8e?q=80&w=735&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  '350': 'https://images.unsplash.com/photo-1783659998293-658661dc1d14?q=80&w=735&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  '352': 'https://images.unsplash.com/photo-1783656386141-a497474796fa?q=80&w=735&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  '356': 'https://images.unsplash.com/photo-1783659973415-7e659f70a495?q=80&w=735&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  '357': 'https://images.unsplash.com/photo-1783659973468-ac47d8f8e667?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  '375': 'https://images.unsplash.com/photo-1783659973118-a5066496de6a?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  '487': 'https://images.unsplash.com/photo-1783656368854-5b8633d691e5?q=80&w=735&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
};

const students: StudentMember[] = [
  { id: 'm-1', rollNo: 1, adNo: '297', admissionNo: '297', name: 'SHADI.V', status: 'Active', house: 'Manjeri', attendance: 100, roleTitle: 'BUREAU FOR REJUVENATED ACTIVITIES', zehnuthPoints: 75, imageUrl: STUDENT_IMAGES['297'] },
  { id: 'm-2', rollNo: 2, adNo: '325', admissionNo: '325', name: 'MUHAMMED SINAN.P', status: 'Active', house: 'Nilambur', attendance: 100, roleTitle: 'English & Arabic Wing', zehnuthPoints: 130, imageUrl: STUDENT_IMAGES['325'] },
  { id: 'm-3', rollNo: 3, adNo: '326', admissionNo: '326', name: 'MUHAMMED AS\'AD .K', status: 'Active', house: 'Nellikuth', attendance: 100, roleTitle: 'Academics Wing', zehnuthPoints: 66, imageUrl: STUDENT_IMAGES['326'] },
  { id: 'm-4', rollNo: 4, adNo: '328', admissionNo: '328', name: 'MUHAMMED HANAN.I', status: 'Active', house: 'Amayur', attendance: 100, roleTitle: 'Union President', zehnuthPoints: 21, imageUrl: STUDENT_IMAGES['328'] },
  { id: 'm-5', rollNo: 5, adNo: '329', admissionNo: '329', name: 'MUHAMMED HAMDAN.M', status: 'Active', house: 'Poolamanna', attendance: 100, roleTitle: 'BUREAU FOR REJUVENATED ACTIVITIES', zehnuthPoints: 22, imageUrl: STUDENT_IMAGES['329'] },
  { id: 'm-6', rollNo: 6, adNo: '330', admissionNo: '330', name: 'AJSAL V.P.', status: 'Active', house: 'Poolamanna', attendance: 100, roleTitle: 'Union Treasurer', zehnuthPoints: 44, imageUrl: STUDENT_IMAGES['330'] },
  { id: 'm-7', rollNo: 7, adNo: '332', admissionNo: '332', name: 'MUHAMMED AFNAN.T', status: 'Active', house: 'Velluvangad', attendance: 100, roleTitle: 'Malayalam & Urdu Wing', zehnuthPoints: 272, imageUrl: STUDENT_IMAGES['332'] },
  { id: 'm-8', rollNo: 8, adNo: '333', admissionNo: '333', name: 'MOHAMMED FAYIZ K.K.', status: 'Active', house: 'Melattur', attendance: 100, roleTitle: 'IT & Art Wing & Web Admin', zehnuthPoints: 216, imageUrl: STUDENT_IMAGES['333'] },
  { id: 'm-9', rollNo: 9, adNo: '336', admissionNo: '336', name: 'ABDUL RAHEEM E.K.', status: 'Active', house: 'Pattarkulam', attendance: 100, roleTitle: 'Sports Secretary', zehnuthPoints: 29, imageUrl: STUDENT_IMAGES['336'] },
  { id: 'm-10', rollNo: 10, adNo: '337', admissionNo: '337', name: 'MUHAMMED FARHAN K.M.', status: 'Active', house: 'Panthallur', attendance: 100, roleTitle: 'Malayalam & Urdu Wing', zehnuthPoints: 0, imageUrl: STUDENT_IMAGES['337'] },
  { id: 'm-11', rollNo: 11, adNo: '338', admissionNo: '338', name: 'MUHAMMED THOYYIB N.T.', status: 'Active', house: 'Karakkunu', attendance: 100, roleTitle: 'General Secretary', zehnuthPoints: 129, imageUrl: STUDENT_IMAGES['338'] },
  { id: 'm-12', rollNo: 12, adNo: '339', admissionNo: '339', name: 'MUHAMMED ASHBAL .C', status: 'Active', house: 'Chokkad', attendance: 100, roleTitle: 'Working Secretary', zehnuthPoints: 51, imageUrl: STUDENT_IMAGES['339'] },
  { id: 'm-13', rollNo: 13, adNo: '341', admissionNo: '341', name: 'RIMSHID SAJIN .N', status: 'Active', house: 'Perimbalam', attendance: 100, roleTitle: 'BUREAU FOR REJUVENATED ACTIVITIES', zehnuthPoints: 46, imageUrl: STUDENT_IMAGES['341'] },
  { id: 'm-14', rollNo: 14, adNo: '342', admissionNo: '342', name: 'MUHAMMED NOUFAN .N', status: 'Active', house: 'Irumbhuzhi', attendance: 100, roleTitle: 'Vice President', zehnuthPoints: 163, imageUrl: STUDENT_IMAGES['342'] },
  { id: 'm-15', rollNo: 15, adNo: '343', admissionNo: '343', name: 'MUHAMMED JASIM T.K.', status: 'Active', house: 'Melkulankara', attendance: 100, roleTitle: 'P.R.O.', zehnuthPoints: 85, imageUrl: STUDENT_IMAGES['343'] },
  { id: 'm-16', rollNo: 16, adNo: '344', admissionNo: '344', name: 'ASHFIN V.P.', status: 'Active', house: 'Payyanad', attendance: 100, roleTitle: 'Malayalam & Urdu Wing', zehnuthPoints: 0, imageUrl: STUDENT_IMAGES['344'] },
  { id: 'm-17', rollNo: 17, adNo: '345', admissionNo: '345', name: 'MUHAMMED SINAN .A', status: 'Active', house: 'Kalambadi', attendance: 100, roleTitle: 'SRDB Wing', zehnuthPoints: 55, imageUrl: STUDENT_IMAGES['345'] },
  { id: 'm-18', rollNo: 18, adNo: '347', admissionNo: '347', name: 'MUHAMMED SHIHAN P.P.', status: 'Active', house: 'Irumbuzhi', attendance: 100, roleTitle: 'BUREAU FOR REJUVENATED ACTIVITIES', zehnuthPoints: 63, imageUrl: STUDENT_IMAGES['347'] },
  { id: 'm-19', rollNo: 19, adNo: '348', admissionNo: '348', name: 'MUHAMMED ANAS P.P.', status: 'Active', house: 'Irumbuzhi', attendance: 100, roleTitle: 'English & Arabic Wing', zehnuthPoints: 60, imageUrl: STUDENT_IMAGES['348'] },
  { id: 'm-20', rollNo: 20, adNo: '350', admissionNo: '350', name: 'MUHAMMED SINAN .P', status: 'Active', house: 'Karakkunnu', attendance: 100, roleTitle: 'Academics Wing', zehnuthPoints: 0, imageUrl: STUDENT_IMAGES['350'] },
  { id: 'm-21', rollNo: 21, adNo: '351', admissionNo: '351', name: 'MUHAMMED ANSIL K.T.', status: 'Active', house: 'Chappanangadi', attendance: 100, roleTitle: 'IT & Art Wing', zehnuthPoints: 37, imageUrl: STUDENT_IMAGES['351'] },
  { id: 'm-22', rollNo: 22, adNo: '352', admissionNo: '352', name: 'MUHAMMED IYAS .V', status: 'Active', house: 'Mangada', attendance: 100, roleTitle: 'English & Arabic Wing', zehnuthPoints: 66, imageUrl: STUDENT_IMAGES['352'] },
  { id: 'm-23', rollNo: 23, adNo: '355', admissionNo: '355', name: 'MUHAMMED NIHAD .P', status: 'Active', house: 'Pallipuram, Mangada', attendance: 100, roleTitle: 'SRDB Wing', zehnuthPoints: 33, imageUrl: STUDENT_IMAGES['355'] },
  { id: 'm-24', rollNo: 24, adNo: '356', admissionNo: '356', name: 'MUHAMMED SWAFWAN .C', status: 'Active', house: 'Wandoor', attendance: 100, roleTitle: 'BUREAU FOR REJUVENATED ACTIVITIES', zehnuthPoints: 22, imageUrl: STUDENT_IMAGES['356'] },
  { id: 'm-25', rollNo: 25, adNo: '357', admissionNo: '357', name: 'MUHAMMED SHAHIN .V', status: 'Active', house: 'Pattikkad', attendance: 100, roleTitle: 'Thazkiya Wing', zehnuthPoints: 43, imageUrl: STUDENT_IMAGES['357'] },
  { id: 'm-26', rollNo: 26, adNo: '375', admissionNo: '375', name: 'MUHAMMED SWAFWAN .P', status: 'Active', house: 'Melattur', attendance: 100, roleTitle: 'Academics Wing', zehnuthPoints: 89, imageUrl: STUDENT_IMAGES['375'] },
  { id: 'm-27', rollNo: 27, adNo: '487', admissionNo: '487', name: 'SWALAHUDHEEN AYYOOBI K.M.', status: 'Active', house: 'Nenmini', attendance: 100, roleTitle: 'Thazkiya Wing', zehnuthPoints: 67, imageUrl: STUDENT_IMAGES['487'] }
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
    student.adNo.includes(searchQuery) ||
    student.admissionNo.includes(searchQuery) ||
    student.house.toLowerCase().includes(searchQuery.toLowerCase()) ||
    student.roleTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
    student.rollNo.toString().includes(searchQuery)
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
                className="glass-card p-4 rounded-2xl relative group overflow-hidden flex flex-col items-center text-center border border-white/5 bg-white/[0.02] hover:border-cyan-500/30 cursor-pointer select-none"
              >
                {/* Micro reflection sweep */}
                <div className="absolute top-0 inset-x-0 h-10 bg-gradient-to-b from-white/5 to-transparent pointer-events-none" />

                {/* Top Bar with Roll No & Ad No */}
                <div className="w-full flex items-center justify-between text-[10px] font-mono text-neutral-400 mb-2.5 px-0.5">
                  <span className="px-1.5 py-0.5 rounded bg-white/5 border border-white/5 text-neutral-300 font-bold">
                    #{student.rollNo}
                  </span>
                  <span className="text-cyan-400 font-semibold text-[10px]">
                    {student.adNo}
                  </span>
                </div>

                {/* Ambient backdrop aura */}
                <div className="absolute -top-10 -left-10 w-20 h-20 bg-cyan-500/5 group-hover:bg-cyan-500/10 rounded-full blur-xl transition-all duration-500 pointer-events-none" />

                {/* Stylized Avatar Placeholder with initials or custom photo */}
                <div className={`relative w-14 h-14 rounded-full overflow-hidden flex items-center justify-center font-display font-black text-sm text-white bg-gradient-to-tr ${getGradient(index)} shadow-[0_0_15px_rgba(6,182,212,0.1)] group-hover:shadow-[0_0_20px_rgba(6,182,212,0.3)] transition-all duration-500 mb-2.5`}>
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
                <h4 className="font-display font-bold text-xs text-white group-hover:text-cyan-400 transition-colors duration-200 line-clamp-1">
                  {student.name}
                </h4>

                {/* Role Title */}
                <span className="text-[10px] font-mono text-neutral-300 mt-1 line-clamp-1 max-w-full px-1">
                  {student.roleTitle}
                </span>

                {/* House / Hometown */}
                <div className="flex items-center gap-1 text-[10px] text-neutral-400 mt-1.5">
                  <MapPin className="w-2.5 h-2.5 text-cyan-400 shrink-0" />
                  <span className="truncate">{student.house}</span>
                </div>

                {/* Zehnuth Points Pill */}
                <div className="mt-2.5 flex items-center justify-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/25 text-amber-300 font-mono text-[10px] font-bold shadow-[0_0_10px_rgba(245,158,11,0.1)]">
                  <Sparkles className="w-3 h-3 text-amber-400 shrink-0" />
                  <span>{student.zehnuthPoints} Zehnuth Pts</span>
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
              className="relative w-full max-w-md bg-neutral-950 border border-white/10 rounded-[32px] overflow-hidden p-7 sm:p-8 flex flex-col items-center text-center shadow-[0_24px_50px_rgba(0,0,0,0.5)] z-10"
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
              <div className={`relative w-24 h-24 rounded-full overflow-hidden flex items-center justify-center font-display font-black text-3xl text-white bg-gradient-to-tr ${getGradient(selectedStudentIndex)} shadow-[0_0_30px_rgba(6,182,212,0.15)] mb-5`}>
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

              {/* Name */}
              <h3 className="font-display font-black text-2xl text-white tracking-tight">
                {selectedStudent.name}
              </h3>

              {/* Badges Row */}
              <div className="flex flex-wrap items-center justify-center gap-2 mt-3">
                <span className="font-mono text-xs text-neutral-300 bg-white/5 border border-white/10 px-3 py-1 rounded-full font-bold">
                  Roll #{selectedStudent.rollNo}
                </span>
                <span className="font-mono text-xs text-cyan-400 bg-cyan-500/10 border border-cyan-500/20 px-3 py-1 rounded-full font-bold">
                  AD NO: {selectedStudent.adNo}
                </span>
                <span className="font-mono text-xs text-amber-400 bg-amber-500/10 border border-amber-500/20 px-3 py-1 rounded-full font-bold flex items-center gap-1.5 shadow-[0_0_12px_rgba(245,158,11,0.15)]">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  {selectedStudent.zehnuthPoints} Zehnuth Points
                </span>
                <span className="font-mono text-xs text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded-full font-bold">
                  {selectedStudent.attendance}% Attendance
                </span>
              </div>

              {/* Interactive Student Details Info */}
              <div className="w-full mt-6 pt-5 border-t border-white/5 space-y-3.5 text-left">
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-widest text-neutral-500 block">Union Designation / Wing</span>
                  <span className="text-xs text-cyan-300 font-semibold font-sans mt-0.5 block">{selectedStudent.roleTitle}</span>
                </div>
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-widest text-neutral-500 block">Zehnuth Performance Record</span>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-sm font-bold font-mono text-amber-300 flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4 text-amber-400" />
                      {selectedStudent.zehnuthPoints} Points
                    </span>
                    <span className="text-[10px] text-neutral-400 font-sans bg-white/5 px-2 py-0.5 rounded border border-white/5">
                      Official Class 5 Evaluation
                    </span>
                  </div>
                </div>
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-widest text-neutral-500 block">House / Hometown</span>
                  <div className="flex items-center gap-1.5 mt-0.5 text-xs text-neutral-300 font-sans">
                    <MapPin className="w-3.5 h-3.5 text-cyan-400" />
                    <span>{selectedStudent.house}</span>
                  </div>
                </div>
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-widest text-neutral-500 block">Class Association</span>
                  <span className="text-xs text-neutral-300 font-sans mt-0.5 block">USRA 9th Batch • S5 Academic Session (The 27 Students)</span>
                </div>
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-widest text-neutral-500 block">Official Status</span>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                    <span className="text-xs text-emerald-400 font-mono font-bold uppercase tracking-wider">{selectedStudent.status} Member</span>
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
