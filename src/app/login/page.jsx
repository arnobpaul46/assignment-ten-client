import { Suspense } from 'react';
import LoginForm from "@/components/auth/LoginForm";

export default function SignInPage() {
  return (
    <div className="min-h-screen bg-[#09090b]">
      <Suspense fallback={<div className="text-white text-center mt-20">Loading...</div>}>
        <LoginForm />
      </Suspense>
    </div>
  );
}