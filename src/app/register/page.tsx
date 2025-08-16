"use client";
import { useState } from "react";
import Navbar from "../../components/Navbar";
import Toast from "../../components/Toast"; // เพิ่มการ import Toast
import styles from "./Register.module.css";

export default function RegisterPage() {
  const [name, setName] = useState("");
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

  const validateForm = () => {
    if (!name.trim()) {
      showToast("Name is required", "error");
      return false;
    }
    
    if (!email.trim()) {
      showToast("Email is required", "error");
      return false;
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      showToast("Please enter a valid email address", "error");
      return false;
    }
    
    if (password.length < 6) {
      showToast("Password must be at least 6 characters long", "error");
      return false;
    }
    
    return true;
  };

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

  const handleRegister = async () => {
    if (!validateForm()) return;

    setLoading(true);
    hideToast(); // ปิด toast เก่าก่อน
    
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });
      
      const data = await res.json();

      if (res.ok) {
        showToast("Registration successful! 🎉 You can now login.", "success");
        // Clear form
        setName("");
        setEmail("");
        setPassword("");
      } else {
        showToast(data.error || "Registration failed", "error");
      }
    } catch (error) {
      showToast("Network error occurred", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleRegister();
    }
  };

  return (
    <div className={styles.pageContainer}>
      <Navbar />
      <div className={styles.container}>
        <div className={styles.formCard}>
          <h1 className={styles.title}>Create Account</h1>
          
          {/* ลบ message div เก่าออก และใช้ Toast component แทน */}
          
          <div className={styles.inputGroup}>
            <input
              className={styles.input}
              type="text"
              placeholder="Enter your full name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              onKeyPress={handleKeyPress}
              disabled={loading}
            />
          </div>
          
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
              placeholder="Create a password (min. 6 characters)"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyPress={handleKeyPress}
              disabled={loading}
            />
          </div>
          
          <button
            className={`${styles.registerButton} ${loading ? styles.loading : ""}`}
            onClick={handleRegister}
            disabled={loading}
          >
            {loading ? "Creating Account..." : "Create Account"}
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