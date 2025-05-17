import { API_BASE_URL, API_ENDPOINTS } from "./config";

class APIError extends Error {
  constructor(message, status, data) {
    super(message);
    this.name = "APIError";
    this.status = status;
    this.data = data;
  }
}

const handleResponse = async (response) => {
  let data;
  try {
    data = await response.json();
  } catch (error) {
    data = {};
  }

  if (!response.ok) {
    if (response.status === 400 && data.errors) {
      throw new APIError(
        data.message || "Validation failed",
        response.status,
        data
      );
    } else if (response.status === 401) {
      throw new APIError(
        data.message || "Authentication required",
        response.status,
        data
      );
    } else if (response.status === 403) {
      throw new APIError(
        data.message || "Permission denied",
        response.status,
        data
      );
    } else if (response.status === 404) {
      throw new APIError(
        data.message || "Resource not found",
        response.status,
        data
      );
    }
    throw new APIError(
      data.message || "Something went wrong",
      response.status,
      data
    );
  }

  return data;
};

export const authService = {
  login: async (credentials) => {
    try {
      const response = await fetch(
        `${API_BASE_URL}${API_ENDPOINTS.AUTH.LOGIN}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(credentials),
          credentials: "include",
        }
      );
      return handleResponse(response);
    } catch (error) {
      if (error instanceof APIError) throw error;
      throw new APIError("Failed to connect to the server", 0, {});
    }
  },

  register: async (userData) => {
    try {
      const response = await fetch(
        `${API_BASE_URL}${API_ENDPOINTS.AUTH.REGISTER}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(userData),
          credentials: "include",
        }
      );
      return handleResponse(response);
    } catch (error) {
      if (error instanceof APIError) throw error;
      throw new APIError("Failed to connect to the server", 0, {});
    }
  },

  logout: async () => {
    try {
      const response = await fetch(
        `${API_BASE_URL}${API_ENDPOINTS.AUTH.LOGOUT}`,
        {
          method: "POST",
          credentials: "include",
        }
      );
      return handleResponse(response);
    } catch (error) {
      if (error instanceof APIError) throw error;
      throw new APIError("Failed to connect to the server", 0, {});
    }
  },

  getCurrentUser: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.AUTH.ME}`, {
        credentials: "include",
      });
      return handleResponse(response);
    } catch (error) {
      if (error instanceof APIError) throw error;
      throw new APIError("Failed to connect to the server", 0, {});
    }
  },
};

export const gamesService = {
  getGames: async () => {
    try {
      const response = await fetch(
        `${API_BASE_URL}${API_ENDPOINTS.GAMES.LIST}`,
        {
          credentials: "include",
        }
      );
      return handleResponse(response);
    } catch (error) {
      if (error instanceof APIError) throw error;
      throw new APIError("Failed to fetch games", 0, {});
    }
  },

  getGame: async (id) => {
    try {
      const response = await fetch(
        `${API_BASE_URL}${API_ENDPOINTS.GAMES.DETAIL(id)}`,
        {
          credentials: "include",
        }
      );
      return handleResponse(response);
    } catch (error) {
      if (error instanceof APIError) throw error;
      throw new APIError("Failed to fetch game details", 0, {});
    }
  },

  createGame: async (gameData) => {
    try {
      const response = await fetch(
        `${API_BASE_URL}${API_ENDPOINTS.GAMES.CREATE}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(gameData),
          credentials: "include",
        }
      );
      return handleResponse(response);
    } catch (error) {
      if (error instanceof APIError) throw error;
      throw new APIError("Failed to create game", 0, {});
    }
  },

  updateGame: async (id, gameData) => {
    try {
      const response = await fetch(
        `${API_BASE_URL}${API_ENDPOINTS.GAMES.UPDATE(id)}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(gameData),
          credentials: "include",
        }
      );
      return handleResponse(response);
    } catch (error) {
      if (error instanceof APIError) throw error;
      throw new APIError("Failed to update game", 0, {});
    }
  },

  deleteGame: async (id) => {
    try {
      const response = await fetch(
        `${API_BASE_URL}${API_ENDPOINTS.GAMES.DELETE(id)}`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );
      return handleResponse(response);
    } catch (error) {
      if (error instanceof APIError) throw error;
      throw new APIError("Failed to delete game", 0, {});
    }
  },
};
