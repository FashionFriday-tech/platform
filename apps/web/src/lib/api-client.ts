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

export interface SendOtpResponse {
  message: string;
}

export interface VerifyOtpResponse {
  isNewUser: boolean;
  otpToken: string;
  accessToken?: string;
  refreshToken?: string;
}

export interface SignupResponse {
  accessToken: string;
  refreshToken: string;
  user: {
    id: string;
    phone: string;
    name: string;
    email: string;
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

  logout: async (): Promise<{ success: boolean; message: string }> => {
    try {
      const accessToken = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;
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
