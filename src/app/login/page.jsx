import LoginForm from "@/components/auth/LoginForm";





export default function SignInPage() {
  return (
    <div className="min-h-screen bg-[#09090b]">
      {/* আপনি চাইলে এখানে নেভবার নাও দেখাতে পারেন সাইন ইন পেজে */}
      <LoginForm/>
    </div>
  );
}