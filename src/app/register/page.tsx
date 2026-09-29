import type { Metadata } from "next";
import RegisterForm from "@/components/RegisterForm";

export const metadata: Metadata = { title: "Create your free site" };

export default function RegisterPage() {
  return (
    <div className="mx-auto flex max-w-6xl justify-center px-4 py-12">
      <RegisterForm />
    </div>
  );
}