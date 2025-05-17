export const API_BASE_URL = "http://localhost:3000";

export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: "/auth/login",
    REGISTER: "/auth/register",
    LOGOUT: "/auth/logout",
    ME: "/auth/me",
  },

  GAMES: {
    LIST: "/games",
    CREATE: "/games",
    DETAIL: (id) => `/games/${id}`,
    UPDATE: (id) => `/games/${id}`,
    DELETE: (id) => `/games/${id}`,
  },
};
