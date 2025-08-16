"use client";
import Navbar from "../../components/Navbar";
import UserTable from "../../components/UserTable";

export default function Dashboard() {
  return (
    <div>
      <Navbar />
      <div className="p-6">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <UserTable />
      </div>
    </div>
  );
}