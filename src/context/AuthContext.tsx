import React, { createContext, useContext, useState, useEffect } from 'react';
import { AuthUser, AnnouncementItem, Student27 } from '../types';
import { STUDENTS_27_ROSTER, findStudentByAdNo } from '../data/students27';
import { db, auth, googleProvider } from '../firebase';
import { doc, setDoc, getDoc, collection, getDocs, addDoc, query, orderBy, deleteDoc } from 'firebase/firestore';
import { signInWithPopup, signOut as firebaseSignOut } from 'firebase/auth';

interface AuthContextType {
  currentUser: AuthUser | null;
  isLoading: boolean;
  loginStudent27: (adNo: string, pass: string) => Promise<{ success: boolean; error?: string }>;
  loginUsthadFsl: (username: string, pass: string) => Promise<{ success: boolean; error?: string }>;
  loginGeneral: (credentials: { idOrEmail: string; pass: string; role: 'student_general' | 'usthad_general'; name?: string }) => Promise<{ success: boolean; error?: string }>;
  registerGeneral: (data: { name: string; idOrEmail: string; pass: string; role: 'student_general' | 'usthad_general'; department?: string }) => Promise<{ success: boolean; error?: string }>;
  loginWithGoogle: (preferredRole?: 'student_general' | 'usthad_general') => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  // Announcements
  announcements: AnnouncementItem[];
  addAnnouncement: (title: string, content: string, priority: 'normal' | 'urgent' | 'info', target: 'all' | 'students_27' | 'usthads') => Promise<void>;
  deleteAnnouncement: (id: string) => Promise<void>;
  students27List: Student27[];
}

const DEFAULT_ANNOUNCEMENTS: AnnouncementItem[] = [
  {
    id: 'ann-1',
    title: 'Urgent: Submission of Union Media Portfolios',
    content: 'All 27 cohort members are directed to submit their media portfolio documentation to the academic council before Friday evening.',
    authorName: 'Usthad Fazlu Rehman Hudawi',
    authorRole: 'Chief Mentor & Faculty Supervisor',
    priority: 'urgent',
    target: 'students_27',
    createdAt: new Date(Date.now() - 3600000 * 5).toISOString()
  },
  {
    id: 'ann-2',
    title: 'Welcome to USRA Central Digital Portal',
    content: 'The centralized union portal is now active for all Darul Irfan students, Usthad council members, and the 27 student cohort.',
    authorName: 'Usthad Fazlu Rehman Hudawi',
    authorRole: 'Faculty In-Charge',
    priority: 'info',
    target: 'all',
    createdAt: new Date(Date.now() - 3600000 * 24).toISOString()
  }
];

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(() => {
    try {
      const saved = localStorage.getItem('usra_active_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [isLoading, setIsLoading] = useState(false);
  const [announcements, setAnnouncements] = useState<AnnouncementItem[]>(DEFAULT_ANNOUNCEMENTS);

  // Load announcements from Firestore
  useEffect(() => {
    async function loadAnnouncements() {
      try {
        const q = query(collection(db, 'announcements'), orderBy('createdAt', 'desc'));
        const snap = await getDocs(q);
        if (!snap.empty) {
          const list: AnnouncementItem[] = snap.docs.map(d => ({
            id: d.id,
            ...(d.data() as Omit<AnnouncementItem, 'id'>)
          }));
          setAnnouncements(list);
        }
      } catch (err) {
        console.log('[Firestore] Using fallback announcements:', err);
      }
    }
    loadAnnouncements();
  }, []);

  const saveUserSession = async (user: AuthUser) => {
    setCurrentUser(user);
    localStorage.setItem('usra_active_user', JSON.stringify(user));
    
    // Also mirror to Firestore users collection
    try {
      await setDoc(doc(db, 'users', user.id), {
        id: user.id,
        username: user.username,
        name: user.name,
        role: user.role,
        adNo: user.adNo || null,
        email: user.email || null,
        batch: user.batch || null,
        createdAt: user.createdAt,
        lastLoginAt: new Date().toISOString()
      }, { merge: true });
    } catch (e) {
      console.warn('[Firestore] Could not sync user record:', e);
    }
  };

  // 1. Login for the 27 Students
  const loginStudent27 = async (adNo: string, pass: string): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true);
    const cleanAdNo = adNo.trim();
    const cleanPass = pass.trim();

    if (!cleanAdNo || !cleanPass) {
      setIsLoading(false);
      return { success: false, error: 'Admission Number and Password are required.' };
    }

    const matchedStudent = findStudentByAdNo(cleanAdNo);
    if (!matchedStudent) {
      setIsLoading(false);
      return { 
        success: false, 
        error: `Admission number "${cleanAdNo}" not found in the 27-student cohort. (e.g. 297, 325, 333, etc.)` 
      };
    }

    // Password must match admission number or roll number or exact entry
    const validMatches = [
      matchedStudent.adNo.toLowerCase(),
      `ad${matchedStudent.adNo.toLowerCase()}`,
      matchedStudent.rollNo.toString(),
      cleanAdNo.toLowerCase()
    ];

    if (!validMatches.includes(cleanPass.toLowerCase())) {
      setIsLoading(false);
      return { success: false, error: 'Password must match your Admission Number.' };
    }

    const studentUser: AuthUser = {
      id: `student-27-${matchedStudent.adNo}`,
      username: matchedStudent.adNo,
      name: matchedStudent.name,
      role: 'student_27',
      adNo: matchedStudent.adNo,
      batch: '27-Student Cohort (Session 2026-27)',
      department: matchedStudent.house,
      createdAt: new Date().toISOString()
    };

    await saveUserSession(studentUser);
    setIsLoading(false);
    return { success: true };
  };

  // 2. Login for Usthad (fsl / fsl)
  const loginUsthadFsl = async (username: string, pass: string): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true);
    const cleanUser = username.trim().toLowerCase();
    const cleanPass = pass.trim().toLowerCase();

    if (cleanUser === 'fsl' && cleanPass === 'fsl') {
      const usthadUser: AuthUser = {
        id: 'usthad-fsl',
        username: 'fsl',
        name: 'Usthad Fazlu Rehman Hudawi',
        role: 'usthad_fsl',
        batch: 'Faculty Supervisory Board',
        department: 'Islamic Studies & Media Directorate',
        createdAt: new Date().toISOString()
      };

      await saveUserSession(usthadUser);
      setIsLoading(false);
      return { success: true };
    }

    setIsLoading(false);
    return { success: false, error: 'Invalid credentials. For Usthad login use username "fsl" and password "fsl".' };
  };

  // 3. Login for Other All Students & Ustads
  const loginGeneral = async ({ idOrEmail, pass, role }: { idOrEmail: string; pass: string; role: 'student_general' | 'usthad_general' }): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true);
    const cleanId = idOrEmail.trim();
    const cleanPass = pass.trim();

    if (!cleanId || !cleanPass) {
      setIsLoading(false);
      return { success: false, error: 'Username/Email and Password are required.' };
    }

    // Check stored general users in localStorage or Firestore
    const generalUsersRaw = localStorage.getItem('usra_general_users');
    const generalUsers: Record<string, any> = generalUsersRaw ? JSON.parse(generalUsersRaw) : {};

    const existing = generalUsers[cleanId.toLowerCase()];
    if (existing && existing.pass === cleanPass) {
      const user: AuthUser = {
        id: existing.id,
        username: existing.username,
        name: existing.name,
        role: existing.role,
        email: existing.email,
        department: existing.department || 'Campus Community',
        createdAt: existing.createdAt
      };
      await saveUserSession(user);
      setIsLoading(false);
      return { success: true };
    }

    // If not registered locally, allow default demo entry with supplied details
    const newUser: AuthUser = {
      id: `gen-${Date.now()}`,
      username: cleanId,
      name: cleanId.includes('@') ? cleanId.split('@')[0] : cleanId,
      role: role,
      email: cleanId.includes('@') ? cleanId : undefined,
      department: role === 'usthad_general' ? 'Faculty Department' : 'General Student Body',
      createdAt: new Date().toISOString()
    };

    // Save credentials
    generalUsers[cleanId.toLowerCase()] = { ...newUser, pass: cleanPass };
    localStorage.setItem('usra_general_users', JSON.stringify(generalUsers));

    await saveUserSession(newUser);
    setIsLoading(false);
    return { success: true };
  };

  // 4. Registration for General Students & Ustads
  const registerGeneral = async (data: { name: string; idOrEmail: string; pass: string; role: 'student_general' | 'usthad_general'; department?: string }): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true);
    const cleanId = data.idOrEmail.trim().toLowerCase();
    
    const generalUsersRaw = localStorage.getItem('usra_general_users');
    const generalUsers: Record<string, any> = generalUsersRaw ? JSON.parse(generalUsersRaw) : {};

    const newUser: AuthUser = {
      id: `gen-${Date.now()}`,
      username: data.idOrEmail.trim(),
      name: data.name.trim(),
      role: data.role,
      email: cleanId.includes('@') ? cleanId : undefined,
      department: data.department || (data.role === 'usthad_general' ? 'Faculty Board' : 'General Campus Cohort'),
      createdAt: new Date().toISOString()
    };

    generalUsers[cleanId] = { ...newUser, pass: data.pass.trim() };
    localStorage.setItem('usra_general_users', JSON.stringify(generalUsers));

    await saveUserSession(newUser);
    setIsLoading(false);
    return { success: true };
  };

  // 5. Firebase Google Sign-In
  const loginWithGoogle = async (preferredRole: 'student_general' | 'usthad_general' = 'student_general'): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const fbUser = result.user;
      
      const user: AuthUser = {
        id: fbUser.uid,
        username: fbUser.email || fbUser.displayName || 'GoogleUser',
        name: fbUser.displayName || 'Campus Member',
        role: preferredRole,
        email: fbUser.email || undefined,
        photoUrl: fbUser.photoURL || undefined,
        department: preferredRole === 'usthad_general' ? 'Faculty Member' : 'Campus Student Body',
        createdAt: new Date().toISOString()
      };

      await saveUserSession(user);
      setIsLoading(false);
      return { success: true };
    } catch (err: any) {
      console.error('Google Sign-in error:', err);
      setIsLoading(false);
      return { success: false, error: err.message || 'Google authentication failed.' };
    }
  };

  // Logout
  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('usra_active_user');
    try {
      firebaseSignOut(auth);
    } catch (e) {
      console.warn('Signout warning:', e);
    }
  };

  // Add Announcement (stored in Firestore)
  const addAnnouncement = async (title: string, content: string, priority: 'normal' | 'urgent' | 'info', target: 'all' | 'students_27' | 'usthads') => {
    const newNotice: Omit<AnnouncementItem, 'id'> = {
      title,
      content,
      authorName: currentUser?.name || 'Usthad Fazlu Rehman Hudawi',
      authorRole: currentUser?.role === 'usthad_fsl' ? 'Chief Mentor & Faculty Supervisor' : 'Union Authority',
      priority,
      target,
      createdAt: new Date().toISOString()
    };

    try {
      const docRef = await addDoc(collection(db, 'announcements'), newNotice);
      setAnnouncements(prev => [{ id: docRef.id, ...newNotice }, ...prev]);
    } catch (err) {
      console.warn('[Firestore] Storing announcement locally:', err);
      const localNotice: AnnouncementItem = {
        id: `ann-${Date.now()}`,
        ...newNotice
      };
      setAnnouncements(prev => [localNotice, ...prev]);
    }
  };

  const deleteAnnouncement = async (id: string) => {
    setAnnouncements(prev => prev.filter(a => a.id !== id));
    try {
      await deleteDoc(doc(db, 'announcements', id));
    } catch (err) {
      console.warn('[Firestore] Delete warning:', err);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        isLoading,
        loginStudent27,
        loginUsthadFsl,
        loginGeneral,
        registerGeneral,
        loginWithGoogle,
        logout,
        announcements,
        addAnnouncement,
        deleteAnnouncement,
        students27List: STUDENTS_27_ROSTER
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
