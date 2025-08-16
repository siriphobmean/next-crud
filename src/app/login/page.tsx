"use client";
import { useState } from "react";
import Navbar from "../../components/Navbar";
import Toast from "../../components/Toast"; // เพิ่มการ import Toast
import styles from "./Login.module.css";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  
  // เปลี่ยนจาก message และ messageType เป็น toast state
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error";
    isVisible: boolean;
  }>({
    message: "",
    type: "error",
    isVisible: false
  });

  // ฟังก์ชันใหม่สำหรับแสดง toast
  const showToast = (message: string, type: "success" | "error") => {
    setToast({
      message,
      type,
      isVisible: true
    });
  };

  // ฟังก์ชันสำหรับปิด toast
  const hideToast = () => {
    setToast(prev => ({
      ...prev,
      isVisible: false
    }));
  };

  const handleLogin = async () => {
    if (!email || !password) {
      showToast("Please fill in all fields", "error");
      return;
    }

    setLoading(true);
    hideToast(); // ปิด toast เก่าก่อน
    
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      
      const data = await res.json();
      
      if (res.ok) {
        showToast("Login successful! 🎉", "success");
        // Redirect or handle success
      } else {
        showToast(data.error || "Login failed", "error");
      }
    } catch (error) {
      showToast("Network error occurred", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleLogin();
    }
  };

  return (
    <div className={styles.pageContainer}>
      <Navbar />
      <div className={styles.container}>
        <div className={styles.formCard}>
          <h1 className={styles.title}>Welcome Back</h1>
          
          {/* ลบ message div เก่าออก และใช้ Toast component แทน */}
          
          <div className={styles.inputGroup}>
            <input
              className={styles.input}
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyPress={handleKeyPress}
              disabled={loading}
            />
          </div>
          
          <div className={styles.inputGroup}>
            <input
              className={styles.input}
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyPress={handleKeyPress}
              disabled={loading}
            />
          </div>
          
          <button
            className={`${styles.loginButton} ${loading ? styles.loading : ""}`}
            onClick={handleLogin}
            disabled={loading}
          >
            {loading ? "Signing In..." : "Sign In"}
          </button>
        </div>
      </div>
      
      {/* เพิ่ม Toast component */}
      <Toast 
        message={toast.message}
        type={toast.type}
        isVisible={toast.isVisible}
        onClose={hideToast}
        duration={4000}
      />
    </div>
  );
}