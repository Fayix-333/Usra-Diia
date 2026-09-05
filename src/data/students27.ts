import { Student27 } from '../types';

export const STUDENTS_27_ROSTER: Student27[] = [
  { rollNo: 1, adNo: '297', name: 'SHADI.V', status: 'Active', house: 'Cordova', attendance: 96, roleTitle: 'Student Member' },
  { rollNo: 2, adNo: '325', name: 'MUHAMMED SINAN.P', status: 'Active', house: 'Baghdad', attendance: 95, roleTitle: 'Media & Documentation' },
  { rollNo: 3, adNo: '326', name: 'MUHAMMED AS\'AD .K', status: 'Active', house: 'Al-Azhar', attendance: 94, roleTitle: 'Academic Wing' },
  { rollNo: 4, adNo: '328', name: 'MUHAMMED HANAN.I', status: 'Active', house: 'Cordova', attendance: 98, roleTitle: 'Union President' },
  { rollNo: 5, adNo: '329', name: 'MUHAMMED HAMDAN.M', status: 'Active', house: 'Baghdad', attendance: 93, roleTitle: 'Cultural Committee' },
  { rollNo: 6, adNo: '330', name: 'AJSAL V.P.', status: 'Active', house: 'Al-Azhar', attendance: 97, roleTitle: 'Union Treasurer' },
  { rollNo: 7, adNo: '332', name: 'MUHAMMED AFNAN.T', status: 'Active', house: 'Cordova', attendance: 92, roleTitle: 'Arts Convener' },
  { rollNo: 8, adNo: '333', name: 'MOHAMMED FAYIZ K.K.', status: 'Active', house: 'Baghdad', attendance: 99, roleTitle: 'Executive Member & Web Admin' },
  { rollNo: 9, adNo: '336', name: 'ABDUL RAHEEM E.K.', status: 'Active', house: 'Al-Azhar', attendance: 94, roleTitle: 'Sports Secretary' },
  { rollNo: 10, adNo: '337', name: 'MUHAMMED FARHAN K.M.', status: 'Active', house: 'Cordova', attendance: 95, roleTitle: 'Campus Welfare' },
  { rollNo: 11, adNo: '338', name: 'MUHAMMED THOYYIB N.T.', status: 'Active', house: 'Baghdad', attendance: 98, roleTitle: 'General Secretary' },
  { rollNo: 12, adNo: '339', name: 'MUHAMMED ASHBAL .C', status: 'Active', house: 'Al-Azhar', attendance: 97, roleTitle: 'Working Secretary' },
  { rollNo: 13, adNo: '341', name: 'RIMSHID SAJIN .N', status: 'Active', house: 'Cordova', attendance: 93, roleTitle: 'Library Representative' },
  { rollNo: 14, adNo: '342', name: 'MUHAMMED NOUFAN .N', status: 'Active', house: 'Baghdad', attendance: 98, roleTitle: 'Vice President' },
  { rollNo: 15, adNo: '343', name: 'MUHAMMED JASIM T.K.', status: 'Active', house: 'Al-Azhar', attendance: 96, roleTitle: 'P.R.O. (Public Relations)' },
  { rollNo: 16, adNo: '344', name: 'ASHFIN V.P.', status: 'Active', house: 'Cordova', attendance: 94, roleTitle: 'Stage Committee' },
  { rollNo: 17, adNo: '345', name: 'MUHAMMED SINAN .A', status: 'Active', house: 'Baghdad', attendance: 95, roleTitle: 'Language Club Lead' },
  { rollNo: 18, adNo: '347', name: 'MUHAMMED SHIHAN P.P.', status: 'Active', house: 'Al-Azhar', attendance: 93, roleTitle: 'Exhibition Wing' },
  { rollNo: 19, adNo: '348', name: 'MUHAMMED ANAS P.P.', status: 'Active', house: 'Cordova', attendance: 96, roleTitle: 'Creative Wing' },
  { rollNo: 20, adNo: '350', name: 'MUHAMMED SINAN .P', status: 'Active', house: 'Baghdad', attendance: 92, roleTitle: 'Audio-Visual Tech' },
  { rollNo: 21, adNo: '351', name: 'MUHAMMED ANSIL K.T.', status: 'Active', house: 'Al-Azhar', attendance: 95, roleTitle: 'Discipline Secretary' },
  { rollNo: 22, adNo: '352', name: 'MUHAMMED IYAS .V', status: 'Active', house: 'Cordova', attendance: 94, roleTitle: 'Publications Wing' },
  { rollNo: 23, adNo: '355', name: 'MUHAMMED NIHAD .P', status: 'Active', house: 'Baghdad', attendance: 96, roleTitle: 'Social Outreach' },
  { rollNo: 24, adNo: '356', name: 'MUHAMMED SWAFWAN .C', status: 'Active', house: 'Al-Azhar', attendance: 95, roleTitle: 'Irfan Square Coordinator' },
  { rollNo: 25, adNo: '357', name: 'MUHAMMED SHAHIN .V', status: 'Active', house: 'Cordova', attendance: 93, roleTitle: 'Events Coordinator' },
  { rollNo: 26, adNo: '375', name: 'MUHAMMED SWAFWAN .P', status: 'Active', house: 'Baghdad', attendance: 97, roleTitle: 'Student Mentor' },
  { rollNo: 27, adNo: '487', name: 'SWALAHUDHEEN AYYOOBI K.M.', status: 'Active', house: 'Al-Azhar', attendance: 99, roleTitle: 'Class Monitor' }
];

export function findStudentByAdNo(input: string): Student27 | undefined {
  if (!input) return undefined;
  const sanitized = input.trim().toLowerCase().replace(/^ad[-_:\s.]?/, '').trim();
  
  return STUDENTS_27_ROSTER.find(s => {
    const numericRoll = s.rollNo.toString();
    const cleanAdNo = s.adNo.toLowerCase();
    return cleanAdNo === sanitized ||
           cleanAdNo === input.trim().toLowerCase() ||
           `ad${cleanAdNo}` === sanitized ||
           numericRoll === sanitized ||
           s.name.toLowerCase() === input.trim().toLowerCase();
  });
}

