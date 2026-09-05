export interface TimelineItem {
  id: string;
  year: string;
  title: string;
  description: string;
  details?: string[];
}

export interface Department {
  id: string;
  name: string;
  description: string;
  iconName: string; // Lucide icon string
  details: string[];
  color: string; // e.g., 'blue', 'cyan', 'indigo'
  projectsCount: number;
  category: string;
}

export interface GalleryItem {
  id: string;
  title: string;
  category: string;
  imageUrl: string;
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  imageUrl: string;
  socials: {
    instagram?: string;
    linkedin?: string;
    twitter?: string;
    github?: string;
  };
}

export interface Achievement {
  id: string;
  label: string;
  value: number;
  suffix: string;
  iconName: string;
}

export interface EventItem {
  id: string;
  title: string;
  subtitle?: string;
  date: string;
  time?: string;
  venue?: string;
  status: 'upcoming' | 'ongoing' | 'completed';
  category: string;
  description: string;
  imageUrl: string; // Event poster image
  highlights?: string[];
  organizer?: string;
  tags?: string[];
}

export type UserRole = 'student_27' | 'usthad_fsl' | 'student_general' | 'usthad_general';

export interface AuthUser {
  id: string;
  username: string;
  name: string;
  role: UserRole;
  adNo?: string;
  email?: string;
  department?: string;
  batch?: string;
  photoUrl?: string;
  createdAt: string;
}

export interface Student27 {
  rollNo: number;
  adNo: string;
  name: string;
  status: string;
  house: string;
  attendance: number;
  roleTitle?: string;
  zehnuthPoints?: number;
}

export interface AnnouncementItem {
  id: string;
  title: string;
  content: string;
  authorName: string;
  authorRole: string;
  priority: 'normal' | 'urgent' | 'info';
  target: 'all' | 'students_27' | 'usthads';
  createdAt: string;
}

export interface ClassMessage {
  id: string;
  studentAdNo: string;
  studentName: string;
  studentHouse?: string;
  message: string;
  createdAt: string;
  status: 'unread' | 'read';
  reply?: string;
  replyAt?: string;
}

export interface StudentCredential {
  adNo: string;
  studentName: string;
  password: string;
  previousPassword?: string;
  updatedAt: string;
}

