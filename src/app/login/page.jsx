"use client";
import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import LoginForm from "@/components/auth/LoginForm";

function LoginPageContent() {
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get('redirectTo');
  return <LoginForm redirectTo={redirectTo} />;
}

export default function SignInPage() {
  return (
    <div className="min-h-screen bg-[#09090b]">
      <Suspense fallback={<div className="text-white text-center mt-20">Loading...</div>}>
        <LoginPageContent />
      </Suspense>
    </div>
  );
}