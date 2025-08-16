// components/DeleteConfirmModal.tsx
"use client";
import { useEffect } from "react";
import styles from "./DeleteConfirmModal.module.css";

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
}

interface DeleteConfirmModalProps {
  isOpen: boolean;
  user: User | null;
  onClose: () => void;
  onConfirm: (userId: number) => void;
  isDeleting?: boolean;
}

const DeleteConfirmModal: React.FC<DeleteConfirmModalProps> = ({ 
  isOpen, 
  user, 
  onClose, 
  onConfirm,
  isDeleting = false
}) => {

  // Handle backdrop click
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget && !isDeleting) {
      onClose();
    }
  };

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !isDeleting) {
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
  }, [isOpen, onClose, isDeleting]);

  const handleConfirm = () => {
    if (user && !isDeleting) {
      onConfirm(user.id);
    }
  };

  if (!isOpen || !user) return null;

  return (
    <div className={styles.backdrop} onClick={handleBackdropClick}>
      <div className={styles.modal}>
        <div className={styles.modalHeader}>
          <div className={styles.warningIcon}>⚠️</div>
          <h2 className={styles.modalTitle}>Confirm Delete</h2>
        </div>

        <div className={styles.modalContent}>
          <p className={styles.warningText}>
            Are you sure you want to delete this user? This action cannot be undone.
          </p>
          
          <div className={styles.userInfo}>
            <div className={styles.userAvatar}>
              {user.name.charAt(0).toUpperCase()}
            </div>
            <div className={styles.userDetails}>
              <div className={styles.userName}>{user.name}</div>
              <div className={styles.userEmail}>{user.email}</div>
              <div className={styles.userRole}>
                <span className={`${styles.roleBadge} ${styles[user.role]}`}>
                  {user.role}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className={styles.modalFooter}>
          <button
            type="button"
            onClick={onClose}
            className={styles.cancelButton}
            disabled={isDeleting}
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            className={styles.deleteButton}
            disabled={isDeleting}
          >
            {isDeleting ? (
              <>
                <span className={styles.spinner}></span>
                Deleting...
              </>
            ) : (
              <>
                🗑️ Delete User
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmModal;