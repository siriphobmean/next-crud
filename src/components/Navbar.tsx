"use client";
import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="w-full bg-blue-600 text-white px-6 py-3 flex justify-between items-center">
      <h1 className="text-xl font-bold">User Management</h1>
      <div className="space-x-4">
        <Link href="/register" className="hover:underline">
          Register
        </Link>
        <Link href="/login" className="hover:underline">
          Login
        </Link>
        <Link href="/dashboard" className="hover:underline">
          Dashboard
        </Link>
      </div>
    </nav>
  );
}