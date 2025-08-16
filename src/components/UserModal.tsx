// components/UserModal.tsx
"use client";
import { useState, useEffect } from "react";
import styles from "./UserModal.module.css";

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
}

interface UserModalProps {
  isOpen: boolean;
  mode: "create" | "edit";
  user: User | null;
  onClose: () => void;
  onSubmit: (userData: Omit<User, "id">) => void;
}

const UserModal: React.FC<UserModalProps> = ({ 
  isOpen, 
  mode, 
  user, 
  onClose, 
  onSubmit 
}) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "user"
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Reset form when modal opens/closes or user changes
  useEffect(() => {
    if (isOpen) {
      if (mode === "edit" && user) {
        setFormData({
          name: user.name,
          email: user.email,
          password: "",
          role: user.role
        });
      } else {
        setFormData({
          name: "",
          email: "",
          password: "",
          role: "user"
        });
      }
      setErrors({});
    }
  }, [isOpen, mode, user]);

  // Handle input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }
  };

  // Validate form
  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        newErrors.email = "Please enter a valid email";
      }
    }

    if (mode === "create" && !formData.password.trim()) {
      newErrors.password = "Password is required";
    }

    if (formData.password && formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      const submitData: any = {
        name: formData.name.trim(),
        email: formData.email.trim(),
        role: formData.role
      };

      // Only include password if it's provided
      if (formData.password.trim()) {
        submitData.password = formData.password;
      }

      await onSubmit(submitData);
    } catch (error) {
      console.error("Error submitting form:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle backdrop click
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className={styles.backdrop} onClick={handleBackdropClick}>
      <div className={styles.modal}>
        <div className={styles.modalHeader}>
          <h2 className={styles.modalTitle}>
            {mode === "create" ? "Add New User" : "Edit User"}
          </h2>
          <button 
            className={styles.closeButton}
            onClick={onClose}
            type="button"
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className={styles.modalForm}>
          <div className={styles.formGroup}>
            <label htmlFor="name" className={styles.label}>
              Full Name *
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className={`${styles.input} ${errors.name ? styles.error : ""}`}
              placeholder="Enter full name"
              disabled={isSubmitting}
            />
            {errors.name && <span className={styles.errorText}>{errors.name}</span>}
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="email" className={styles.label}>
              Email Address *
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className={`${styles.input} ${errors.email ? styles.error : ""}`}
              placeholder="Enter email address"
              disabled={isSubmitting}
            />
            {errors.email && <span className={styles.errorText}>{errors.email}</span>}
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="password" className={styles.label}>
              Password {mode === "create" ? "*" : "(Leave blank to keep current)"}
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              className={`${styles.input} ${errors.password ? styles.error : ""}`}
              placeholder={mode === "create" ? "Enter password" : "Enter new password"}
              disabled={isSubmitting}
            />
            {errors.password && <span className={styles.errorText}>{errors.password}</span>}
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="role" className={styles.label}>
              Role *
            </label>
            <select
              id="role"
              name="role"
              value={formData.role}
              onChange={handleInputChange}
              className={styles.select}
              disabled={isSubmitting}
            >
              <option value="user">User</option>
              <option value="admin">Admin</option>
              <option value="moderator">Moderator</option>
            </select>
          </div>

          <div className={styles.modalFooter}>
            <button
              type="button"
              onClick={onClose}
              className={styles.cancelButton}
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className={styles.submitButton}
              disabled={isSubmitting}
            >
              {isSubmitting ? "Saving..." : mode === "create" ? "Create User" : "Update User"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserModal;