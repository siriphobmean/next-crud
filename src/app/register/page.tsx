"use client";
import { useState } from "react";
import Navbar from "../../components/Navbar";
import styles from "./Register.module.css";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState<"success" | "error" | "">("");

  const validateForm = () => {
    if (!name.trim()) {
      setMessage("Name is required");
      setMessageType("error");
      return false;
    }
    
    if (!email.trim()) {
      setMessage("Email is required");
      setMessageType("error");
      return false;
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setMessage("Please enter a valid email address");
      setMessageType("error");
      return false;
    }
    
    if (password.length < 6) {
      setMessage("Password must be at least 6 characters long");
      setMessageType("error");
      return false;
    }
    
    return true;
  };

  const handleRegister = async () => {
    if (!validateForm()) return;

    setLoading(true);
    setMessage("");
    
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });
      
      const data = await res.json();

      if (res.ok) {
        setMessage("Registration successful! 🎉 You can now login.");
        setMessageType("success");
        // Clear form
        setName("");
        setEmail("");
        setPassword("");
      } else {
        setMessage(data.error || "Registration failed");
        setMessageType("error");
      }
    } catch (error) {
      setMessage("Network error occurred");
      setMessageType("error");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
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
          
          {message && (
            <div className={`${styles.message} ${messageType === "success" ? styles.messageSuccess : styles.messageError}`}>
              {message}
            </div>
          )}
          
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
    </div>
  );
}