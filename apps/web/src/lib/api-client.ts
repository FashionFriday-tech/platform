import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor
api.interceptors.request.use(
  (config) => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('accessToken');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// Add a response interceptor for handling token expiration
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If the error is 401 and not already retried
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem('refreshToken');
        if (!refreshToken) {
          throw new Error('No refresh token available');
        }

        // Call the refresh endpoint
        const response = await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/auth/refresh`,
          {},
          {
            headers: {
              Authorization: `Bearer ${refreshToken}`,
            },
          },
        );

        const { accessToken, refreshToken: newRefreshToken } = response.data;

        // Store new tokens
        localStorage.setItem('accessToken', accessToken);
        localStorage.setItem('refreshToken', newRefreshToken);

        // Update the original request with the new access token
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;

        // Retry the original request
        return api(originalRequest);
      } catch (refreshError) {
        // If refresh fails, clear tokens and redirect to login
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        if (typeof window !== 'undefined') {
          window.location.href = '/';
        }
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  },
);

export interface SendOtpResponse {
  message: string;
}

export interface VerifyOtpResponse {
  isNewUser: boolean;
  otpToken: string;
  accessToken?: string;
  refreshToken?: string;
  user?: {
    id: string;
    phone: string;
    name: string;
    email: string;
    role: string;
    avatarUrl?: string;
    loyaltyPoints?: number;
  };
}

export interface SignupResponse {
  accessToken: string;
  refreshToken: string;
  user: {
    id: string;
    phone: string;
    name: string;
    email: string;
    role: string;
    avatarUrl?: string;
    loyaltyPoints?: number;
  };
}

export const authApi = {
  sendOtp: async (phone: string): Promise<SendOtpResponse> => {
    const response = await api.post('/auth/send-otp', { phone });
    return response.data;
  },

  verifyOtp: async (phone: string, otp: string): Promise<VerifyOtpResponse> => {
    const response = await api.post('/auth/verify-otp', { phone, otp });
    return response.data;
  },

  sendEmailOtp: async (): Promise<SendOtpResponse> => {
    const response = await api.post('/auth/email/send-otp');
    return response.data;
  },

  verifyEmailOtp: async (otp: string): Promise<{ success: boolean; message: string; user: SignupResponse['user'] }> => {
    const response = await api.post('/auth/email/verify-otp', { otp });
    return response.data;
  },

  signup: async (
    phone: string,
    name: string,
    email: string,
    otpToken: string,
  ): Promise<SignupResponse> => {
    const response = await api.post('/auth/signup', {
      phone,
      name,
      email,
      otpToken,
    });
    return response.data;
  },

  getMe: async (): Promise<SignupResponse['user']> => {
    const response = await api.get('/auth/me');
    return response.data;
  },

  deleteAccount: async (): Promise<{ success: boolean; message: string }> => {
    const response = await api.delete('/auth/account');
    return response.data;
  },

  updateProfile: async (data: any): Promise<SignupResponse['user']> => {
    const response = await api.patch('/auth/profile', data);
    return response.data;
  },

  logout: async (): Promise<{ success: boolean; message: string }> => {
    try {
      const accessToken =
        typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;
      if (!accessToken) {
        return { success: true, message: 'Already logged out' };
      }
      const response = await api.post('/auth/logout', {});
      return response.data;
    } catch (error: unknown) {
      if (
        error &&
        typeof error === 'object' &&
        'response' in error &&
        (error as any).response?.status === 401
      ) {
        return { success: true, message: 'Logged out (Session already expired)' };
      }
      throw error;
    }
  },
};

export default api;
