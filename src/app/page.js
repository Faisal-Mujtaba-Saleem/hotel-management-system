"use client";

import Link from "next/link";
import { SignInButton, SignedOut, SignedIn, UserButton } from "@clerk/nextjs";
import {
  ChartBarIcon,
  ClipboardDocumentListIcon,
  BuildingOfficeIcon,
  UserGroupIcon,
  ArrowRightIcon,
} from "@heroicons/react/24/outline";
import LandingTopBar from "@/components/LandingTopBar";
import ViewerModal from "@/components/ViewerModal";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col bg-gradient-to-b from-blue-50 via-white to-blue-100 text-gray-800">
      <LandingTopBar />

      {/* 🧭 Hero Section */}
      <section className="text-center px-6 py-24 flex flex-col items-center">
        <h2 className="text-5xl md:text-6xl font-extrabold text-blue-800 leading-tight max-w-3xl">
          Simplify Your Hotel Operations with{" "}
          <span className="text-blue-600">HotelEase</span>
        </h2>
        <p className="text-gray-600 text-lg md:text-xl mt-6 max-w-2xl">
          Manage bookings, staff, guests, reports, and finances — all from one
          powerful dashboard. Designed for hotel owners and managers.
        </p>
        <div className="mt-8 flex gap-4">
          <SignedOut>
            <SignInButton mode="modal">
              <button className="bg-blue-600 text-white px-8 py-3 rounded-md font-medium hover:bg-blue-700 flex items-center gap-2">
                Get Started <ArrowRightIcon className="h-5 w-5" />
              </button>
            </SignInButton>
          </SignedOut>

          <Link
            href="#features"
            className="border border-blue-600 text-blue-600 hover:bg-blue-50 px-8 py-3 rounded-md font-medium"
          >
            Learn More
          </Link>
        </div>
      </section>

      {/* 🚀 Features Section */}
      <section
        id="features"
        className="bg-white px-8 py-24 border-t border-gray-100"
      >
        <h3 className="text-3xl font-bold text-center text-blue-700 mb-16">
          Everything You Need to Run Your Hotel Smoothly
        </h3>

        <div className="grid md:grid-cols-3 gap-10 max-w-6xl mx-auto">
          {[
            {
              icon: <ClipboardDocumentListIcon className="h-10 w-10 text-blue-600" />,
              title: "Booking Management",
              desc: "Handle room reservations, check-ins, and cancellations effortlessly.",
            },
            {
              icon: <UserGroupIcon className="h-10 w-10 text-blue-600" />,
              title: "Staff Coordination",
              desc: "Assign tasks, manage shifts, and monitor staff activity in real-time.",
            },
            {
              icon: <ChartBarIcon className="h-10 w-10 text-blue-600" />,
              title: "Analytics & Reports",
              desc: "Get detailed insights on occupancy, revenue, and guest satisfaction.",
            },
            {
              icon: <BuildingOfficeIcon className="h-10 w-10 text-blue-600" />,
              title: "Multi-Property Support",
              desc: "Easily manage multiple hotels or branches under one account.",
            },
            {
              icon: <ClipboardDocumentListIcon className="h-10 w-10 text-blue-600" />,
              title: "Inventory Control",
              desc: "Track room supplies, maintenance schedules, and service requests.",
            },
            {
              icon: <ChartBarIcon className="h-10 w-10 text-blue-600" />,
              title: "Finance Overview",
              desc: "Monitor expenses, profits, and generate monthly performance reports.",
            },
          ].map((feature, i) => (
            <div
              key={i}
              className="p-8 rounded-2xl border hover:shadow-lg hover:-translate-y-1 transition bg-blue-50/50"
            >
              <div className="flex justify-center mb-4">{feature.icon}</div>
              <h4 className="text-xl font-semibold text-blue-700 text-center mb-2">
                {feature.title}
              </h4>
              <p className="text-gray-600 text-center">{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 💸 Pricing Section */}
      <section id="pricing" className="px-8 py-24 bg-blue-50 text-center">
        <h3 className="text-3xl font-bold text-blue-700 mb-8">
          Simple Pricing, No Hidden Fees
        </h3>
        <p className="text-gray-600 mb-12">
          Start free — upgrade only when you’re ready to grow.
        </p>

        <div className="flex flex-col md:flex-row justify-center gap-8">
          {[
            {
              plan: "Starter",
              price: "Free",
              features: [
                "1 Hotel Property",
                "Basic Room Management",
                "Email Support",
              ],
            },
            {
              plan: "Professional",
              price: "$49/mo",
              features: [
                "Up to 5 Properties",
                "Analytics Dashboard",
                "Priority Support",
              ],
            },
            {
              plan: "Enterprise",
              price: "Custom",
              features: [
                "Unlimited Properties",
                "Dedicated Account Manager",
                "24/7 Premium Support",
              ],
            },
          ].map((pkg, i) => (
            <div
              key={i}
              className="bg-white rounded-2xl shadow-sm hover:shadow-md transition p-8 w-80 border border-gray-100"
            >
              <h4 className="text-2xl font-bold text-blue-700 mb-2">
                {pkg.plan}
              </h4>
              <p className="text-3xl font-extrabold text-gray-800 mb-6">
                {pkg.price}
              </p>
              <ul className="text-gray-600 text-left space-y-2 mb-6">
                {pkg.features.map((f, j) => (
                  <li key={j}>✅ {f}</li>
                ))}
              </ul>
              <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-md">
                Get Started
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* 📞 Contact Section */}
      <section id="contact" className="px-8 py-24 bg-white text-center">
        <h3 className="text-3xl font-bold text-blue-700 mb-6">
          Ready to Transform Your Hotel?
        </h3>
        <p className="text-gray-600 mb-6">
          Join hundreds of hotels using HotelEase to save time and increase
          profits.
        </p>
        <Link
          href="#"
          className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-md font-medium"
        >
          Request a Demo
        </Link>
      </section>

      {/* ⚓ Footer */}
      <footer className="py-6 bg-blue-700 text-white text-center text-sm">
        © {new Date().getFullYear()} HotelEase — Hotel Management System.
        Crafted with ❤️ for Hotel Owners.
      </footer>
    </main>
  );
}
