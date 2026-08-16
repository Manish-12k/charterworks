import { Suspense } from 'react';
import LoginForm from '@/components/LoginForm';

export const metadata = { title: 'Login / Register — LEGOFIN' };

export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginForm />
    </Suspense>
  );
}
