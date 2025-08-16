"use client";
import { useEffect, useState } from "react";
import styles from "./UserTable.module.css";

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
}

export default function UserTable() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/users");
      if (res.ok) {
        const userData = await res.json();
        setUsers(userData);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  if (loading) {
    return (
      <div className={styles.container}>
        <h2 className={styles.title}>All Users</h2>
        <div className={styles.loading}>Loading users...</div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>All Users</h2>
      {users.length === 0 ? (
        <div className={styles.empty}>
          No users found
        </div>
      ) : (
        <table className={styles.table}>
          <thead className={styles.tableHeader}>
            <tr className={styles.tableHeaderRow}>
              <th className={styles.tableHeaderCell}>ID</th>
              <th className={styles.tableHeaderCell}>Name</th>
              <th className={styles.tableHeaderCell}>Email</th>
              <th className={styles.tableHeaderCell}>Role</th>
            </tr>
          </thead>
          <tbody className={styles.tableBody}>
            {users.map((user) => (
              <tr key={user.id} className={styles.tableRow}>
                <td className={styles.tableCell}>{user.id}</td>
                <td className={styles.tableCell}>{user.name}</td>
                <td className={styles.tableCell}>{user.email}</td>
                <td className={styles.tableCell}>{user.role}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}