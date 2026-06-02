import { type Metadata } from 'next';

import { LoginPage } from '@/features/auth';

export const metadata: Metadata = {
  title: 'Login | Admin Panel',
  description: 'Log in to the Admin Panel.',
};

export default function LoginPageContainer() {
  return <LoginPage />;
}
