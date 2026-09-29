import type { Metadata } from "next";
import LoginForm from "@/components/LoginForm";

export const metadata: Metadata = { title: "Login" };

export default function LoginPage() {
  return (
    <div className="mx-auto flex max-w-6xl justify-center px-4 py-12">
      <LoginForm />
    </div>
  );
}