import { SignUp } from "@clerk/nextjs";

export default function SignUpPage() {
  return (
    <main className="min-h-screen bg-void flex items-center justify-center p-4">
      <SignUp
        fallbackRedirectUrl="/dashboard"
        signInForceRedirectUrl="/dashboard"
        appearance={{
          elements: {
            rootBox: "mx-auto",
            card: "bg-surface border border-line shadow-2xl rounded-2xl",
          },
        }}
      />
    </main>
  );
}
