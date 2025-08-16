"use client";
import { useState, useEffect } from "react";
import Navbar from "../../components/Navbar";
import Toast from "../../components/Toast";
import UserModal from "../../components/UserModal";
import DeleteConfirmModal from "../../components/DeleteConfirmModal";
import styles from "./UserManagement.module.css";

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  createdAt?: string;
}

export default function UserManagement() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRole, setSelectedRole] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 10;

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [modalMode, setModalMode] = useState<"create" | "edit">("create");

  // Delete confirmation modal state
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Toast state
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error";
    isVisible: boolean;
  }>({
    message: "",
    type: "success",
    isVisible: false
  });

  // Toast functions
  const showToast = (message: string, type: "success" | "error") => {
    setToast({ message, type, isVisible: true });
  };

  const hideToast = () => {
    setToast(prev => ({ ...prev, isVisible: false }));
  };

  // Fetch all users
  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/users");
      if (res.ok) {
        const data = await res.json();
        setUsers(data);
      } else {
        showToast("Failed to fetch users", "error");
      }
    } catch (error) {
      showToast("Network error occurred", "error");
    } finally {
      setLoading(false);
    }
  };

  // Create user
  const createUser = async (userData: Omit<User, "id">) => {
    try {
      const res = await fetch("/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData),
      });

      if (res.ok) {
        const newUser = await res.json();
        setUsers(prev => [...prev, newUser]);
        showToast("User created successfully! 🎉", "success");
        setIsModalOpen(false);
      } else {
        const error = await res.json();
        showToast(error.message || "Failed to create user", "error");
      }
    } catch (error) {
      showToast("Network error occurred", "error");
    }
  };

  // Update user
  const updateUser = async (id: number, userData: Partial<User>) => {
    try {
      const res = await fetch(`/api/users/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData),
      });

      if (res.ok) {
        const updatedUser = await res.json();
        setUsers(prev => prev.map(user => user.id === id ? updatedUser : user));
        showToast("User updated successfully! ✨", "success");
        setIsModalOpen(false);
      } else {
        const error = await res.json();
        showToast(error.message || "Failed to update user", "error");
      }
    } catch (error) {
      showToast("Network error occurred", "error");
    }
  };

  // Delete user with confirmation
  const handleDeleteClick = (user: User) => {
    setUserToDelete(user);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async (userId: number) => {
    try {
      setIsDeleting(true);
      const res = await fetch(`/api/users/${userId}`, {
        method: "DELETE",
      });

      if (res.ok) {
        setUsers(prev => prev.filter(user => user.id !== userId));
        showToast("User deleted successfully! 🗑️", "success");
        setIsDeleteModalOpen(false);
        setUserToDelete(null);
      } else {
        showToast("Failed to delete user", "error");
      }
    } catch (error) {
      showToast("Network error occurred", "error");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleDeleteCancel = () => {
    if (!isDeleting) {
      setIsDeleteModalOpen(false);
      setUserToDelete(null);
    }
  };

  // Modal handlers
  const handleCreateUser = () => {
    setModalMode("create");
    setEditingUser(null);
    setIsModalOpen(true);
  };

  const handleEditUser = (user: User) => {
    setModalMode("edit");
    setEditingUser(user);
    setIsModalOpen(true);
  };

  const handleModalSubmit = (userData: Omit<User, "id">) => {
    if (modalMode === "create") {
      createUser(userData);
    } else if (editingUser) {
      updateUser(editingUser.id, userData);
    }
  };

  // Filter users
  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = selectedRole === "all" || user.role === selectedRole;
    return matchesSearch && matchesRole;
  });

  // Pagination
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);
  const startIndex = (currentPage - 1) * usersPerPage;
  const paginatedUsers = filteredUsers.slice(startIndex, startIndex + usersPerPage);

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div className={styles.pageContainer}>
      <Navbar />
      <div className={styles.container}>
        {/* Header */}
        <div className={styles.header}>
          <div className={styles.headerContent}>
            <h1 className={styles.title}>User Management</h1>
            <p className={styles.subtitle}>Manage all users in your system</p>
          </div>
          <button 
            className={styles.createButton}
            onClick={handleCreateUser}
          >
            + Add New User
          </button>
        </div>

        {/* Filters */}
        <div className={styles.filtersContainer}>
          <div className={styles.searchBox}>
            <input
              type="text"
              placeholder="Search users..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={styles.searchInput}
            />
          </div>
          <select
            value={selectedRole}
            onChange={(e) => setSelectedRole(e.target.value)}
            className={styles.roleFilter}
          >
            <option value="all">All Roles</option>
            <option value="admin">Admin</option>
            <option value="user">User</option>
            <option value="moderator">Moderator</option>
          </select>
        </div>

        {/* Stats */}
        <div className={styles.statsRow}>
          <div className={styles.statCard}>
            <span className={styles.statNumber}>{users.length}</span>
            <span className={styles.statLabel}>Total Users</span>
          </div>
          <div className={styles.statCard}>
            <span className={styles.statNumber}>{filteredUsers.length}</span>
            <span className={styles.statLabel}>Filtered Results</span>
          </div>
        </div>

        {/* Users Table */}
        <div className={styles.tableContainer}>
          {loading ? (
            <div className={styles.loadingState}>
              <div className={styles.spinner}></div>
              <p>Loading users...</p>
            </div>
          ) : paginatedUsers.length === 0 ? (
            <div className={styles.emptyState}>
              <p>No users found</p>
            </div>
          ) : (
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginatedUsers.map((user) => (
                  <tr key={user.id}>
                    <td>{user.id}</td>
                    <td className={styles.nameCell}>
                      <div className={styles.userAvatar}>
                        {user.name.charAt(0).toUpperCase()}
                      </div>
                      {user.name}
                    </td>
                    <td>{user.email}</td>
                    <td>
                      <span className={`${styles.roleBadge} ${styles[user.role]}`}>
                        {user.role}
                      </span>
                    </td>
                    <td>
                      <div className={styles.actionButtons}>
                        <button
                          className={styles.editButton}
                          onClick={() => handleEditUser(user)}
                        >
                          Edit
                        </button>
                        <button
                          className={styles.deleteButton}
                          onClick={() => handleDeleteClick(user)}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className={styles.pagination}>
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className={styles.paginationButton}
            >
              Previous
            </button>
            
            <div className={styles.pageNumbers}>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`${styles.pageNumber} ${page === currentPage ? styles.active : ""}`}
                >
                  {page}
                </button>
              ))}
            </div>
            
            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className={styles.paginationButton}
            >
              Next
            </button>
          </div>
        )}
      </div>

      {/* User Modal */}
      <UserModal
        isOpen={isModalOpen}
        mode={modalMode}
        user={editingUser}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleModalSubmit}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={isDeleteModalOpen}
        user={userToDelete}
        onClose={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
        isDeleting={isDeleting}
      />

      {/* Toast */}
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