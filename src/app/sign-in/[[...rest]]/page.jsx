"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUser, SignIn } from "@clerk/nextjs";
import Loading from "@/components/Loading";

export default function Home() {
  const { isLoaded } = useUser();

  if (!isLoaded) {
    return <Loading />; // or show a loading spinner
  }

  return <SignIn />
}
