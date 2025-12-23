// components/admin/UserManagement.jsx
export default function UserManagement() {
  const users = [
    {
      id: 1,
      name: "Alex Morgan",
      email: "alex@example.com",
      role: "Admin",
      status: "active",
    },
    {
      id: 2,
      name: "Taylor Swift",
      email: "taylor@example.com",
      role: "Editor",
      status: "active",
    },
    {
      id: 3,
      name: "Chris Evans",
      email: "chris@example.com",
      role: "Viewer",
      status: "pending",
    },
    {
      id: 4,
      name: "Emma Stone",
      email: "emma@example.com",
      role: "Editor",
      status: "active",
    },
    {
      id: 5,
      name: "John Doe",
      email: "john@example.com",
      role: "Viewer",
      status: "inactive",
    },
  ];

  return (
    <div className="user-management">
      <div className="user-header text-gray-500">
        <h3>User Management</h3>
        <button className="add-user-btn">
          <i className="fas fa-plus"></i> Add User
        </button>
      </div>
      <div className="user-table-container">
        <table className="user-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td>
                  <div className="user-info text-gray-800">
                    <div className="user-avatar">
                      {user.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </div>
                    <span>{user.name}</span>
                  </div>
                </td>
                <td className="text-gray-800">{user.email}</td>
                <td className="text-gray-500">
                  <span
                    className={`role-badge role-${user.role.toLowerCase()}`}
                  >
                    {user.role}
                  </span>
                </td>
                <td className="text-gray-300">
                  <span className={`status-badge status-${user.status}`}>
                    {user.status}
                  </span>
                </td>
                <td>
                  <div className="flex gap-2">
                    <button className="flex items-center gap-1 px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition">
                      <i className="fas fa-edit"></i>
                      <span>Edit</span>
                    </button>
                    <button className="flex items-center gap-1 px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 transition">
                      <i className="fas fa-trash"></i>
                      <span>Delete</span>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
