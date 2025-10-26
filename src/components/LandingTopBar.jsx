"use client";

import Link from "next/link";
import { SignedOut, SignInButton } from "@clerk/nextjs";
import SignedInNavMenu from "./SignedInNavMenu";
import { usePathname, useRouter } from "next/navigation";

export default function LandingTopBar() {
  const navItems = [
    {
      href: "#features",
      className: "hover:text-blue-600",
      text: "Features",
    },
    {
      href: "#pricing",
      className: "hover:text-blue-600",
      text: "Pricing",
    },
    {
      href: "#contact",
      className: "hover:text-blue-600",
      text: "Contact",
    },
  ];
  return (
    <header className="flex justify-between items-center px-8 py-5 bg-white/70 backdrop-blur shadow-sm sticky top-0 z-50">
      <h1 className="text-2xl font-bold text-blue-700">🏨 HotelEase</h1>

      <nav className="flex items-center gap-6 font-medium">
        {navItems.map((item) => (
          <Link key={item.href} href={item.href} className={item.className}>
            {item.text}
          </Link>
        ))}

        <SignedOut>
          <SignInButton mode="modal">
            <button className="px-5 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 shadow-sm">
              Sign In
            </button>
          </SignInButton>
        </SignedOut>

        <SignedInNavMenu />
      </nav>
    </header>
  );
}
