import axios from 'axios';

const API_BASE_URL = 'http://localhost:5200/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

const authAPI = {
  signup: (userData) => api.post('/auth/signup', userData),
  login: (credentials) => api.post('/auth/login', credentials),
};

const pollsAPI = {
  getAllPolls: () => api.get('/polls'),
  getPollById: (pollId) => api.get(`/polls/${pollId}`),
  createPoll: (pollData) => api.post('/polls', pollData),
  vote: (pollId, voteData) => api.post(`/polls/${pollId}/vote`, voteData),
  updatePollStatus: (pollId, status) => api.patch(`/polls/${pollId}/status`, { status }),
};

export default api;
export { authAPI, pollsAPI };
