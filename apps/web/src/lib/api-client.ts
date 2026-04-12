import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001',
  headers: {
    'Content-Type': 'application/json',
  },
});

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
};

export default api;
