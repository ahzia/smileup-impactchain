/**
 * API Client with automatic authentication
 * Handles token management and automatic refresh
 */

class ApiClient {
  private baseUrl: string;

  constructor() {
    this.baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || '/api';
  }

  private async getAuthHeaders(): Promise<Record<string, string>> {
    const token = localStorage.getItem('smileup_token');
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    
    return headers;
  }

  private async handleResponse<T>(response: Response): Promise<T> {
    if (response.status === 401) {
      // Token expired, try to refresh
      const refreshToken = localStorage.getItem('smileup_refresh_token');
      if (refreshToken) {
        try {
          const refreshResponse = await fetch(`${this.baseUrl}/auth/refresh`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ refreshToken }),
          });

          if (refreshResponse.ok) {
            const refreshData = await refreshResponse.json();
            if (refreshData.success && refreshData.data) {
              // Update tokens in localStorage
              localStorage.setItem('smileup_token', refreshData.data.accessToken);
              localStorage.setItem('smileup_refresh_token', refreshData.data.refreshToken);
              
              // Retry the original request with new token
              const newHeaders = await this.getAuthHeaders();
              const retryResponse = await fetch(response.url, {
                method: response.method,
                headers: newHeaders,
                body: response.body,
              });
              
              if (retryResponse.ok) {
                return await retryResponse.json();
              }
            }
          }
        } catch (error) {
          console.error('Token refresh failed:', error);
        }
      }
      
      // If refresh fails, redirect to login
      localStorage.removeItem('smileup_token');
      localStorage.removeItem('smileup_refresh_token');
      localStorage.removeItem('smileup_user');
      window.location.href = '/login';
      throw new Error('Authentication required');
    }

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  }

  async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    const headers = await this.getAuthHeaders();
    
    const config: RequestInit = {
      headers: {
        ...headers,
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      return await this.handleResponse<T>(response);
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // Auth endpoints
  async login(credentials: { email: string; password: string }) {
    return this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  }

  async register(userData: { email: string; password: string; name: string }) {
    return this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  // Feed endpoints
  async getFeedPosts(params?: { page?: number; limit?: number }) {
    const searchParams = new URLSearchParams();
    if (params?.page) searchParams.append('page', params.page.toString());
    if (params?.limit) searchParams.append('limit', params.limit.toString());
    
    return this.request(`/feed?${searchParams.toString()}`);
  }

  async donateSmiles(postId: string, amount: number) {
    return this.request(`/feed/${postId}/donate`, {
      method: 'POST',
      body: JSON.stringify({ amount }),
    });
  }

  // Missions endpoints
  async getMissions() {
    return this.request('/missions');
  }

  async acceptMission(missionId: string) {
    return this.request(`/missions/${missionId}/accept`, {
      method: 'POST',
    });
  }

  // User endpoints
  async getUserProfile() {
    return this.request('/user/profile');
  }

  async updateUserProfile(updates: any) {
    return this.request('/user/profile', {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  }
}

export const apiClient = new ApiClient(); 