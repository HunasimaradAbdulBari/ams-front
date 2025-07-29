import api from './api';

export const userService = {
  getUsers: async () => {
    const response = await api.get('/users');
    return response.data;
  },

  createUser: async (userData) => {
    const response = await api.post('/users', userData);
    return response.data;
  },

  getStudents: async (classname, section) => {
    const response = await api.get(`/users/students?class=${classname}&section=${section}`);
    return response.data;
  },

  getTeachers: async () => {
    const response = await api.get('/users/teachers');
    return response.data;
  },

  getParents: async () => {
    const response = await api.get('/users/parents');
    return response.data;
  }
};
