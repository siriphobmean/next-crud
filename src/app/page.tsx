import Image from "next/image";
import Link from "next/link";
import styles from "./page.module.css";

export default function Home() {
  return (
    <div className={styles.page}>
      <main className={styles.hero}>
        <div className={styles.logoContainer}>
          <Image
            className={styles.logo}
            src="/next.svg"
            alt="Next.js logo"
            width={180}
            height={38}
            priority
          />
          <div className={styles.brandText}>User Management System</div>
        </div>

        <div className={styles.heroContent}>
          <h1 className={styles.title}>
            Manage Users with Style
          </h1>
          <p className={styles.subtitle}>
            A modern, secure, and intuitive user management platform
          </p>
          <p className={styles.description}>
            Built with Next.js, featuring beautiful dark theme with orange accents. 
            Register new users, authenticate securely, and manage your user base 
            with our sleek dashboard interface.
          </p>
        </div>

        <div className={styles.ctaContainer}>
          <Link href="/login" className={`${styles.ctaButton} ${styles.primaryButton}`}>
            Sign In
          </Link>
          <Link href="/register" className={`${styles.ctaButton} ${styles.secondaryButton}`}>
            Create Account
          </Link>
        </div>

        <div className={styles.features}>
          <div className={styles.featureCard}>
            <span className={styles.featureIcon}>🔐</span>
            <h3 className={styles.featureTitle}>Secure Authentication</h3>
            <p className={styles.featureDescription}>
              Advanced security measures to protect user data and ensure safe access
            </p>
          </div>
          
          <div className={styles.featureCard}>
            <span className={styles.featureIcon}>👥</span>
            <h3 className={styles.featureTitle}>User Management</h3>
            <p className={styles.featureDescription}>
              Comprehensive dashboard to view, manage, and track all registered users
            </p>
          </div>
          
          <div className={styles.featureCard}>
            <span className={styles.featureIcon}>🎨</span>
            <h3 className={styles.featureTitle}>Modern Design</h3>
            <p className={styles.featureDescription}>
              Beautiful dark theme with orange accents for an exceptional user experience
            </p>
          </div>
        </div>
      </main>

      <footer className={styles.footer}>
        <p className={styles.footerText}>
          Powered by{" "}
          <a 
            href="https://nextjs.org" 
            target="_blank" 
            rel="noopener noreferrer"
            className={styles.footerLink}
          >
            Next.js
          </a>
          {" "}• Built with ❤️ for modern web applications
        </p>
      </footer>
    </div>
  );
}