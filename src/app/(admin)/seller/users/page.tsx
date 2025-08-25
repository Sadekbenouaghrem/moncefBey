"use client";
import { useEffect, useState } from "react";

// Define the User interface
interface User {
  id: string;
  name: string;
  email: string;
  isAdmin: boolean;
}

const UsersPage = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Fetch the list of users
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch("/api/users");
        if (!res.ok) throw new Error("Failed to fetch users");
        const data: User[] = await res.json();
        setUsers(data);
      } catch (error) {
        console.error("Error fetching users:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  // Handle changing the isAdmin property
  const handleAdminToggle = async (userId: string, currentStatus: boolean) => {
    try {
      const res = await fetch("/api/users", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId,
          isAdmin: !currentStatus,
        }),
      });

      if (!res.ok) throw new Error("Failed to update user");

      const updatedUser = await res.json();
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user.id === updatedUser.id ? updatedUser : user
        )
      );
    } catch (error) {
      console.error("Error updating user:", error);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-4">User Management</h1>

      {loading ? (
        <p>Loading users...</p>
      ) : (
        <table className="min-w-full table-auto border-collapse">
          <thead>
            <tr>
              <th className="px-4 py-2 border">Name</th>
              <th className="px-4 py-2 border">Email</th>
              <th className="px-4 py-2 border">Admin Status</th>
              <th className="px-4 py-2 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td className="px-4 py-2 border">{user.name}</td>
                <td className="px-4 py-2 border">{user.email}</td>
                <td className="px-4 py-2 border">
                  {user.isAdmin ? "Admin" : "User"}
                </td>
                <td className="px-4 py-2 border">
                  <button
                    onClick={() => handleAdminToggle(user.id, user.isAdmin)}
                    className="px-4 py-2 bg-blue-500 text-white rounded"
                  >
                    {user.isAdmin ? "Remove Admin" : "Make Admin"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default UsersPage;
