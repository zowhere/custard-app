"use client";

const TOKEN_KEY = "abakcus_auth_token";

export interface AuthUser {
  id: string;
  email: string;
  name?: string;
  businessName?: string;
  onboardingCompleted: boolean;
  profileCompleted: boolean;
  businessCompleted: boolean;
}

class AuthManager {
  private token: string | null = null;

  constructor() {
    if (typeof window !== "undefined") {
      this.loadFromStorage();
    }
  }

  private loadFromStorage() {
    try {
      const token = localStorage.getItem(TOKEN_KEY);

      if (token) {
        const payload = JSON.parse(atob(token.split(".")[1]));
        if (payload.exp * 1000 > Date.now()) {
          this.token = token;
        } else {
          this.clearAuth();
        }
      }
    } catch (error) {
      console.error("Failed to load auth from storage:", error);
      this.clearAuth();
    }
  }

  setAuth(token: string) {
    this.token = token;
    if (typeof window !== "undefined") {
      localStorage.setItem(TOKEN_KEY, token);
    }
  }

  clearAuth() {
    this.token = null;
    if (typeof window !== "undefined") {
      localStorage.removeItem(TOKEN_KEY);
    }
  }

  getToken(): string | null {
    return this.token;
  }

  isAuthenticated(): boolean {
    return this.token !== null;
  }

  async makeAuthenticatedRequest(
    url: string,
    options: RequestInit = {},
  ): Promise<Response> {
    const token = this.getToken();

    if (!token) {
      throw new Error("No authentication token available");
    }

    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      ...options.headers,
    };

    const response = await fetch(url, {
      ...options,
      headers,
    });

    if (response.status === 401) {
      this.clearAuth();
      if (typeof window !== "undefined") {
        window.location.href = "/signin";
      }
      throw new Error("Authentication failed");
    }

    return response;
  }
}

export const authManager = new AuthManager();

export function useAuth() {
  return {
    token: authManager.getToken(),
    isAuthenticated: authManager.isAuthenticated(),
    setAuth: authManager.setAuth.bind(authManager),
    clearAuth: authManager.clearAuth.bind(authManager),
    makeAuthenticatedRequest:
      authManager.makeAuthenticatedRequest.bind(authManager),
  };
}
