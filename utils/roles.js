export const ROLES = {
  ADMIN: 'admin',
  TEACHER: 'teacher',
  STUDENT: 'student',
  PARENT: 'parent'
};

export const getRoleDisplayName = (role) => {
  const roleNames = {
    [ROLES.ADMIN]: 'Administrator',
    [ROLES.TEACHER]: 'Teacher',
    [ROLES.STUDENT]: 'Student',
    [ROLES.PARENT]: 'Parent'
  };
  return roleNames[role] || role;
};

export const getRoleRoutes = (role) => {
  const routes = {
    [ROLES.ADMIN]: [
      { name: 'Dashboard', path: '/admin/dashboard', icon: 'dashboard' },
      { name: 'Users', path: '/admin/users', icon: 'users' },
      { name: 'Timetable', path: '/admin/timetable', icon: 'timetable' }
    ],
    [ROLES.TEACHER]: [
      { name: 'Dashboard', path: '/teacher/dashboard', icon: 'dashboard' },
      { name: 'Attendance', path: '/teacher/attendance', icon: 'attendance' },
      { name: 'Announcements', path: '/teacher/announcements', icon: 'announcements' },
      { name: 'Leave Requests', path: '/teacher/leaves', icon: 'calendar' }
    ],
    [ROLES.STUDENT]: [
      { name: 'Dashboard', path: '/student/dashboard', icon: 'dashboard' },
      { name: 'Attendance', path: '/student/attendance', icon: 'attendance' },
      { name: 'Announcements', path: '/student/announcements', icon: 'announcements' },
      { name: 'Timetable', path: '/student/timetable', icon: 'timetable' },
      { name: 'Apply Leave', path: '/student/leave-application', icon: 'calendar' }
    ],
    [ROLES.PARENT]: [
      { name: 'Dashboard', path: '/parent/dashboard', icon: 'dashboard' },
      { name: 'Child Attendance', path: '/parent/child-attendance', icon: 'attendance' }
    ]
  };
  return routes[role] || [];
};
