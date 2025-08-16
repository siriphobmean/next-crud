"use client";
import { useState, useEffect } from "react";
import Navbar from "../../components/Navbar";
import UserTable from "../../components/UserTable";
import styles from "./Dashboard.module.css";

interface DashboardStats {
  totalUsers: number;
  activeUsers: number;
  newUsersToday: number;
}

export default function Dashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 0,
    activeUsers: 0,
    newUsersToday: 0
  });
  const [loading, setLoading] = useState(true);

  const fetchDashboardStats = async () => {
    try {
      setLoading(true);
      // Simulate API call for stats
      // In real app, you'd fetch from your API
      const res = await fetch("/api/users");
      if (res.ok) {
        const users = await res.json();
        setStats({
          totalUsers: users.length,
          activeUsers: Math.floor(users.length * 0.8), // Simulate 80% active
          newUsersToday: Math.floor(Math.random() * 5) // Simulate random new users
        });
      }
    } catch (error) {
      console.error("Error fetching stats:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  return (
    <div className={styles.pageContainer}>
      <Navbar />
      <div className={styles.container}>
        <div className={styles.header}>
          <h1 className={styles.title}>Dashboard</h1>
          <p className={styles.subtitle}>
            Monitor your user management system and track key metrics
          </p>
        </div>

        <div className={styles.welcomeMessage}>
          <h3>Welcome to Your Dashboard! 👋</h3>
          <p>Here you can view all users and track system statistics</p>
        </div>

        <div className={styles.statsContainer}>
          <div className={styles.statCard}>
            <span className={styles.statNumber}>
              {loading ? "..." : stats.totalUsers}
            </span>
            <span className={styles.statLabel}>Total Users</span>
          </div>
          
          <div className={styles.statCard}>
            <span className={styles.statNumber}>
              {loading ? "..." : stats.activeUsers}
            </span>
            <span className={styles.statLabel}>Active Users</span>
          </div>
          
          <div className={styles.statCard}>
            <span className={styles.statNumber}>
              {loading ? "..." : stats.newUsersToday}
            </span>
            <span className={styles.statLabel}>New Today</span>
          </div>
        </div>

        <div className={styles.contentSection}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>User Management</h2>
          </div>
          <UserTable />
        </div>
      </div>
    </div>
  );
}