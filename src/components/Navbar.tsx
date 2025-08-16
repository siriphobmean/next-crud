"use client";
import Link from "next/link";
import styles from "./Navbar.module.css";

export default function Navbar() {
  return (
    <nav className={styles.navbar}>
      <h1 className={styles.title}>User Management</h1>
      <div className={styles.navLinks}>
        <Link href="/register" className={styles.navLink}>
          Register
        </Link>
        <Link href="/login" className={styles.navLink}>
          Login
        </Link>
        <Link href="/dashboard" className={styles.navLink}>
          Dashboard
        </Link>
      </div>
    </nav>
  );
}