import { Student27 } from '../types';

export const STUDENTS_27_ROSTER: Student27[] = [
  { rollNo: 1, adNo: '297', name: 'SHADI.V', status: 'Active', house: 'Manjeri', attendance: 100, roleTitle: 'BUREAU FOR REJUVENATED ACTIVITIES' },
  { rollNo: 2, adNo: '325', name: 'MUHAMMED SINAN.P', status: 'Active', house: 'Nilambur', attendance: 100, roleTitle: 'English & Arabic Wing' },
  { rollNo: 3, adNo: '326', name: 'MUHAMMED AS\'AD .K', status: 'Active', house: 'Nellikuth', attendance: 100, roleTitle: 'Academics Wing' },
  { rollNo: 4, adNo: '328', name: 'MUHAMMED HANAN.I', status: 'Active', house: 'Amayur', attendance: 100, roleTitle: 'Union President' },
  { rollNo: 5, adNo: '329', name: 'MUHAMMED HAMDAN.M', status: 'Active', house: 'Poolamanna', attendance: 100, roleTitle: 'BUREAU FOR REJUVENATED ACTIVITIES' },
  { rollNo: 6, adNo: '330', name: 'AJSAL V.P.', status: 'Active', house: 'Poolamanna', attendance: 100, roleTitle: 'Union Treasurer' },
  { rollNo: 7, adNo: '332', name: 'MUHAMMED AFNAN.T', status: 'Active', house: 'Velluvangad', attendance: 100, roleTitle: 'Malayalam & Urdu Wing' },
  { rollNo: 8, adNo: '333', name: 'MOHAMMED FAYIZ K.K.', status: 'Active', house: 'Melattur', attendance: 100, roleTitle: 'IT & Art Wing & Web Admin' },
  { rollNo: 9, adNo: '336', name: 'ABDUL RAHEEM E.K.', status: 'Active', house: 'Pattarkulam', attendance: 100, roleTitle: 'Sports Secretary' },
  { rollNo: 10, adNo: '337', name: 'MUHAMMED FARHAN K.M.', status: 'Active', house: 'Panthallur', attendance: 100, roleTitle: 'Malayalam & Urdu Wing' },
  { rollNo: 11, adNo: '338', name: 'MUHAMMED THOYYIB N.T.', status: 'Active', house: 'Karakkunu', attendance: 100, roleTitle: 'General Secretary' },
  { rollNo: 12, adNo: '339', name: 'MUHAMMED ASHBAL .C', status: 'Active', house: 'Chokkad', attendance: 100, roleTitle: 'Working Secretary' },
  { rollNo: 13, adNo: '341', name: 'RIMSHID SAJIN .N', status: 'Active', house: 'Perimbalam', attendance: 100, roleTitle: 'BUREAU FOR REJUVENATED ACTIVITIES' },
  { rollNo: 14, adNo: '342', name: 'MUHAMMED NOUFAN .N', status: 'Active', house: 'Irumbhuzhi', attendance: 100, roleTitle: 'Vice President' },
  { rollNo: 15, adNo: '343', name: 'MUHAMMED JASIM T.K.', status: 'Active', house: 'Melkulankara', attendance: 100, roleTitle: 'P.R.O.' },
  { rollNo: 16, adNo: '344', name: 'ASHFIN V.P.', status: 'Active', house: 'Payyanad', attendance: 100, roleTitle: 'Malayalam & Urdu Wing' },
  { rollNo: 17, adNo: '345', name: 'MUHAMMED SINAN .A', status: 'Active', house: 'Kalambadi', attendance: 100, roleTitle: 'SRDB Wing' },
  { rollNo: 18, adNo: '347', name: 'MUHAMMED SHIHAN P.P.', status: 'Active', house: 'Irumbuzhi', attendance: 100, roleTitle: 'BUREAU FOR REJUVENATED ACTIVITIES' },
  { rollNo: 19, adNo: '348', name: 'MUHAMMED ANAS P.P.', status: 'Active', house: 'Irumbuzhi', attendance: 100, roleTitle: 'English & Arabic Wing' },
  { rollNo: 20, adNo: '350', name: 'MUHAMMED SINAN .P', status: 'Active', house: 'Karakkunnu', attendance: 100, roleTitle: 'Academics Wing' },
  { rollNo: 21, adNo: '351', name: 'MUHAMMED ANSIL K.T.', status: 'Active', house: 'Chappanangadi', attendance: 100, roleTitle: 'IT & Art Wing' },
  { rollNo: 22, adNo: '352', name: 'MUHAMMED IYAS .V', status: 'Active', house: 'Mangada', attendance: 100, roleTitle: 'English & Arabic Wing' },
  { rollNo: 23, adNo: '355', name: 'MUHAMMED NIHAD .P', status: 'Active', house: 'Pallipuram, Mangada', attendance: 100, roleTitle: 'SRDB Wing' },
  { rollNo: 24, adNo: '356', name: 'MUHAMMED SWAFWAN .C', status: 'Active', house: 'Wandoor', attendance: 100, roleTitle: 'BUREAU FOR REJUVENATED ACTIVITIES' },
  { rollNo: 25, adNo: '357', name: 'MUHAMMED SHAHIN .V', status: 'Active', house: 'Pattikkad', attendance: 100, roleTitle: 'Thazkiya Wing' },
  { rollNo: 26, adNo: '375', name: 'MUHAMMED SWAFWAN .P', status: 'Active', house: 'Melattur', attendance: 100, roleTitle: 'Academics Wing' },
  { rollNo: 27, adNo: '487', name: 'SWALAHUDHEEN AYYOOBI K.M.', status: 'Active', house: 'Nenmini', attendance: 100, roleTitle: 'Thazkiya Wing' }
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

