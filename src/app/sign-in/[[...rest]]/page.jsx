"use client";

import { useUser, SignIn } from "@clerk/nextjs";
import Loading from "@/components/Loading";

export default function Home() {
  const { isLoaded } = useUser();

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      {!isLoaded ? (
        <Loading />
      ) : (
        <SignIn path="/sign-in" routing="path" signUpUrl="/sign-up" />
      )}
    </div>
  );
}