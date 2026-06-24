const API_BASE = "http://127.0.0.1:8000/api";

export const getToken = () => {
  return localStorage.getItem("access_token");
};

export const setToken = (token) => {
  localStorage.setItem("access_token", token);
};

export const logout = () => {
  localStorage.removeItem("access_token");
};

export const isLoggedIn = () => {
  return !!getToken();
};

// ✅ CLEAN & STABLE
export const authFetch = async (endpoint, options = {}) => {
  const token = getToken();

  try {
    const response = await fetch(`${API_BASE}${endpoint}`, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
        ...(options.headers || {}),
      },
    });

    if (response.status === 401) {
      logout();
      return null;
    }

    return response;
  } catch (err) {
    console.error("Fetch error:", err);
    return null;
  }
};