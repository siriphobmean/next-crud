"use client";
import { useState } from "react";
import Navbar from "../../components/Navbar";
import styles from "./Login.module.css";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState<"success" | "error" | "">("");

  const handleLogin = async () => {
    if (!email || !password) {
      setMessage("Please fill in all fields");
      setMessageType("error");
      return;
    }

    setLoading(true);
    setMessage("");
    
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      
      const data = await res.json();
      
      if (res.ok) {
        setMessage("Login successful! 🎉");
        setMessageType("success");
        // Redirect or handle success
      } else {
        setMessage(data.error || "Login failed");
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
      handleLogin();
    }
  };

  return (
    <div className={styles.pageContainer}>
      <Navbar />
      <div className={styles.container}>
        <div className={styles.formCard}>
          <h1 className={styles.title}>Welcome Back</h1>
          
          {message && (
            <div className={`${styles.message} ${messageType === "success" ? styles.messageSuccess : styles.messageError}`}>
              {message}
            </div>
          )}
          
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
    </div>
  );
}