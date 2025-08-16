"use client";
import Link from "next/link";
import styles from "./Navbar.module.css";

export default function Navbar() {
  return (
    <nav className={styles.navbar}>
      <Link href="/" className={styles.titleLink}>
        <h1 className={styles.title}>User Management</h1>
      </Link>
      <div className={styles.navLinks}>
        <Link href="/register" className={styles.navLink}>
          Register
        </Link>
        <Link href="/login" className={styles.navLink}>
          Login
        </Link>
        <Link href="/user-management" className={styles.navLink}>
          User Management
        </Link>
      </div>
    </nav>
  );
}