import React, { createContext, useContext, useState, useEffect } from 'react';
import { AuthUser, AnnouncementItem, Student27, ClassMessage } from '../types';
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
  // Class 27 Exclusive Directives & Teacher Chat
  classMessages: ClassMessage[];
  sendClassMessage: (message: string, autoExpire1Day?: boolean) => Promise<{ success: boolean; error?: string }>;
  replyClassMessage: (messageId: string, reply: string) => Promise<{ success: boolean; error?: string }>;
  deleteClassMessage: (messageId: string) => Promise<{ success: boolean; error?: string }>;
  purgeClassMessagesOlderThan1Day: () => Promise<{ success: boolean; count: number; error?: string }>;
  autoPurge1DayEnabled: boolean;
  setAutoPurge1DayEnabled: (enabled: boolean) => void;
  refreshClassMessages: () => Promise<void>;
  // Student Password Modification (Recorded to Firestore for Admin)
  changeStudentPassword: (adNo: string, newPassword: string) => Promise<{ success: boolean; error?: string }>;
}

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
  const [announcements, setAnnouncements] = useState<AnnouncementItem[]>([]);
  const [classMessages, setClassMessages] = useState<ClassMessage[]>([]);
  const [autoPurge1DayEnabled, setAutoPurge1DayState] = useState<boolean>(() => {
    try {
      const stored = localStorage.getItem('usra_auto_purge_1day');
      return stored === null ? true : stored === 'true'; // Enabled by default for convenient 1-day cleanup
    } catch {
      return true;
    }
  });

  const setAutoPurge1DayEnabled = (enabled: boolean) => {
    setAutoPurge1DayState(enabled);
    try {
      localStorage.setItem('usra_auto_purge_1day', enabled ? 'true' : 'false');
    } catch (e) {
      console.warn('LocalStorage error:', e);
    }
    if (enabled) {
      purgeClassMessagesOlderThan1Day();
    }
  };

  // Load class messages between 27 students & Class Teacher
  const refreshClassMessages = async () => {
    try {
      const q = query(collection(db, 'classMessages'), orderBy('createdAt', 'desc'));
      const snap = await getDocs(q);
      if (!snap.empty) {
        let msgs: ClassMessage[] = snap.docs.map(d => ({
          id: d.id,
          ...(d.data() as Omit<ClassMessage, 'id'>)
        }));

        // Check 1-day retention auto-purge
        const isAutoPurge = localStorage.getItem('usra_auto_purge_1day') !== 'false';
        if (isAutoPurge) {
          const oneDayAgo = Date.now() - 24 * 60 * 60 * 1000;
          const expired = msgs.filter(m => {
            const time = new Date(m.createdAt).getTime();
            return !isNaN(time) && time < oneDayAgo;
          });

          if (expired.length > 0) {
            for (const exp of expired) {
              try {
                await deleteDoc(doc(db, 'classMessages', exp.id));
              } catch (e) {
                console.warn('Auto-purge Firestore note:', exp.id, e);
              }
            }
            msgs = msgs.filter(m => {
              const time = new Date(m.createdAt).getTime();
              return isNaN(time) || time >= oneDayAgo;
            });
          }
        }

        setClassMessages(msgs);
      } else {
        setClassMessages([]);
      }
    } catch (err) {
      console.log('[Firestore] Class messages note:', err);
    }
  };

  useEffect(() => {
    refreshClassMessages();
  }, [currentUser]);

  // Load announcements from Firestore
  useEffect(() => {
    async function loadAnnouncements() {
      try {
        const q = query(collection(db, 'announcements'), orderBy('createdAt', 'desc'));
        const snap = await getDocs(q);
        if (!snap.empty) {
          const list: AnnouncementItem[] = snap.docs
            .map(d => ({
              id: d.id,
              ...(d.data() as Omit<AnnouncementItem, 'id'>)
            }))
            .filter(a => 
              a.id !== 'ann-1' && 
              a.id !== 'ann-2' && 
              !a.title?.toLowerCase().includes('urgent: submission of union media portfolios') &&
              !a.title?.toLowerCase().includes('welcome to usra central digital portal')
            );
          setAnnouncements(list);
        } else {
          setAnnouncements([]);
        }
      } catch (err) {
        console.log('[Firestore] Announcements query note:', err);
        setAnnouncements([]);
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
        error: 'Invalid admission number or student record not found.' 
      };
    }

    // Check if custom password was saved in Firestore or local cache
    let customPassword = '';
    try {
      const localCache = localStorage.getItem('usra_student_passwords');
      if (localCache) {
        const parsed = JSON.parse(localCache);
        if (parsed[matchedStudent.adNo]) {
          customPassword = parsed[matchedStudent.adNo];
        }
      }

      // Check Firestore studentCredentials
      const credSnap = await getDoc(doc(db, 'studentCredentials', matchedStudent.adNo));
      if (credSnap.exists()) {
        const data = credSnap.data();
        if (data?.password) {
          customPassword = data.password;
          // sync local cache
          const existing = localCache ? JSON.parse(localCache) : {};
          existing[matchedStudent.adNo] = data.password;
          localStorage.setItem('usra_student_passwords', JSON.stringify(existing));
        }
      }
    } catch (err) {
      console.log('[Auth] Credentials check note:', err);
    }

    if (customPassword) {
      if (cleanPass !== customPassword) {
        setIsLoading(false);
        return { success: false, error: 'Incorrect password entered.' };
      }
    } else {
      // Default: Password matches admission number or roll number
      const validMatches = [
        matchedStudent.adNo.toLowerCase(),
        `ad${matchedStudent.adNo.toLowerCase()}`,
        matchedStudent.rollNo.toString(),
        cleanAdNo.toLowerCase()
      ];

      if (!validMatches.includes(cleanPass.toLowerCase())) {
        setIsLoading(false);
        return { success: false, error: 'Password must match your Admission Number (or updated password).' };
      }
    }

    const studentUser: AuthUser = {
      id: `student-27-${matchedStudent.adNo}`,
      username: matchedStudent.adNo,
      name: matchedStudent.name,
      role: 'student_27',
      adNo: matchedStudent.adNo,
      batch: '27 Students (Session 2026-27)',
      department: matchedStudent.house,
      createdAt: new Date().toISOString()
    };

    await saveUserSession(studentUser);
    setIsLoading(false);
    return { success: true };
  };

  // Password Changing function for 27 students - persists to Firestore studentCredentials
  const changeStudentPassword = async (adNo: string, newPassword: string): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true);
    const cleanAdNo = adNo.trim();
    const cleanPass = newPassword.trim();

    if (!cleanPass || cleanPass.length < 4) {
      setIsLoading(false);
      return { success: false, error: 'Password must be at least 4 characters.' };
    }

    const matched = findStudentByAdNo(cleanAdNo);
    const studentName = matched?.name || currentUser?.name || cleanAdNo;

    try {
      // Write to Firestore studentCredentials (accessible to admin via Firebase console)
      await setDoc(doc(db, 'studentCredentials', cleanAdNo), {
        adNo: cleanAdNo,
        studentName,
        password: cleanPass,
        updatedAt: new Date().toISOString()
      }, { merge: true });

      // Save to local cache as well
      const localCache = localStorage.getItem('usra_student_passwords');
      const existing = localCache ? JSON.parse(localCache) : {};
      existing[cleanAdNo] = cleanPass;
      localStorage.setItem('usra_student_passwords', JSON.stringify(existing));

      setIsLoading(false);
      return { success: true };
    } catch (err: any) {
      console.warn('[Firestore] Storing credentials fallback:', err);
      // Even if offline, save locally
      const localCache = localStorage.getItem('usra_student_passwords');
      const existing = localCache ? JSON.parse(localCache) : {};
      existing[cleanAdNo] = cleanPass;
      localStorage.setItem('usra_student_passwords', JSON.stringify(existing));

      setIsLoading(false);
      return { success: true };
    }
  };

  // Send message to Class Teacher
  const sendClassMessage = async (messageText: string, autoExpire1Day: boolean = true): Promise<{ success: boolean; error?: string }> => {
    if (!currentUser || currentUser.role !== 'student_27') {
      return { success: false, error: 'Only class students can send messages to the Class Teacher.' };
    }
    const cleanText = messageText.trim();
    if (!cleanText) {
      return { success: false, error: 'Please enter a message.' };
    }

    const newMsg: ClassMessage = {
      id: `msg-${Date.now()}`,
      studentAdNo: currentUser.adNo || '',
      studentName: currentUser.name,
      studentHouse: currentUser.department || 'Cordova',
      message: cleanText,
      status: 'unread',
      autoExpire1Day: autoExpire1Day,
      createdAt: new Date().toISOString()
    };

    try {
      const docRef = await addDoc(collection(db, 'classMessages'), newMsg);
      const savedMsg = { ...newMsg, id: docRef.id };
      setClassMessages(prev => [savedMsg, ...prev]);
      return { success: true };
    } catch (err) {
      console.warn('[Firestore] Message sent locally:', err);
      setClassMessages(prev => [newMsg, ...prev]);
      return { success: true };
    }
  };

  // Delete an individual class message
  const deleteClassMessage = async (messageId: string): Promise<{ success: boolean; error?: string }> => {
    try {
      await deleteDoc(doc(db, 'classMessages', messageId));
    } catch (err) {
      console.warn('[Firestore] Delete message error:', err);
    }
    setClassMessages(prev => prev.filter(m => m.id !== messageId));
    return { success: true };
  };

  // Explicitly purge messages older than 1 day (24 hours)
  const purgeClassMessagesOlderThan1Day = async (): Promise<{ success: boolean; count: number; error?: string }> => {
    const oneDayAgo = Date.now() - 24 * 60 * 60 * 1000;
    const toDelete = classMessages.filter(m => {
      const time = new Date(m.createdAt).getTime();
      return !isNaN(time) && time < oneDayAgo;
    });

    if (toDelete.length === 0) {
      return { success: true, count: 0 };
    }

    let deletedCount = 0;
    for (const msg of toDelete) {
      try {
        await deleteDoc(doc(db, 'classMessages', msg.id));
        deletedCount++;
      } catch (err) {
        console.warn('[Firestore] Purge message error:', err);
      }
    }
    setClassMessages(prev => prev.filter(m => {
      const time = new Date(m.createdAt).getTime();
      return isNaN(time) || time >= oneDayAgo;
    }));
    return { success: true, count: deletedCount };
  };

  // Class Teacher reply to a student message
  const replyClassMessage = async (messageId: string, replyText: string): Promise<{ success: boolean; error?: string }> => {
    if (!currentUser || currentUser.role !== 'usthad_fsl') {
      return { success: false, error: 'Only the Class Teacher can reply.' };
    }
    const cleanReply = replyText.trim();
    if (!cleanReply) {
      return { success: false, error: 'Please enter a reply.' };
    }

    const updates = {
      reply: cleanReply,
      replyAt: new Date().toISOString(),
      status: 'read' as const
    };

    try {
      await setDoc(doc(db, 'classMessages', messageId), updates, { merge: true });
      setClassMessages(prev => prev.map(m => m.id === messageId ? { ...m, ...updates } : m));
      return { success: true };
    } catch (err) {
      console.warn('[Firestore] Reply saved locally:', err);
      setClassMessages(prev => prev.map(m => m.id === messageId ? { ...m, ...updates } : m));
      return { success: true };
    }
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
    return { success: false, error: 'Invalid username or password.' };
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
        students27List: STUDENTS_27_ROSTER,
        classMessages,
        sendClassMessage,
        replyClassMessage,
        deleteClassMessage,
        purgeClassMessagesOlderThan1Day,
        autoPurge1DayEnabled,
        setAutoPurge1DayEnabled,
        refreshClassMessages,
        changeStudentPassword
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
