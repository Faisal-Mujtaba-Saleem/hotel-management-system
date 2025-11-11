"use client";

import { useUser } from '@clerk/nextjs';
import { redirect } from 'next/navigation';

export default function Page() {
  // Replace this with your actual authentication check
  const { isSignedIn } = useUser(); // TODO: Replace with real auth logic

  if (!isSignedIn) {
    redirect('/sign-in');
  } else {
    redirect('/dashboard');
  }
  return null;
}