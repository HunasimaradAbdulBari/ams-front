export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    ME: '/auth/me'
  },
  USERS: {
    BASE: '/users',
    STUDENTS: '/users/students',
    TEACHERS: '/users/teachers',
    PARENTS: '/users/parents'
  },
  ATTENDANCE: {
    BASE: '/attendance',
    STUDENT: '/attendance/student',
    CLASS: '/attendance/class'
  },
  ANNOUNCEMENTS: '/announcements',
  TIMETABLE: '/timetable',
  LEAVES: '/leaves',
  HOLIDAYS: '/holidays'
};

export const CLASSES = ['10'];
export const SECTIONS = ['A', 'B', 'C'];
export const SUBJECTS = ['Mathematics', 'Science', 'English', 'History', 'Geography'];

export const ATTENDANCE_STATUS = {
  PRESENT: 'present',
  ABSENT: 'absent'
};

export const LEAVE_STATUS = {
  PENDING: 'pending',
  APPROVED: 'approved',
  REJECTED: 'rejected'
};

export const TARGET_AUDIENCE = {
  STUDENTS: 'students',
  PARENTS: 'parents',
  BOTH: 'both'
};
