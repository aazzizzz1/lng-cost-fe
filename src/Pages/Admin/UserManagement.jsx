import React, { useEffect, useMemo, useState, useCallback } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import { Modal } from "flowbite-react";
import EyeOpenIcon from "../../Assets/Svg/Auth/EyeOpenIcon";
import EyeClosedIcon from "../../Assets/Svg/Auth/EyeClosedIcon";

const api = process.env.REACT_APP_API;

const emptyForm = { username: "", email: "", role: "user", password: "" };

const UserManagement = () => {
  const { user } = useSelector((s) => s.auth); // removed accessToken
  const isAdmin = useMemo(() => user?.role === "admin", [user]);
  const [loading, setLoading] = useState(false);
  const [rows, setRows] = useState([]);
  const [error, setError] = useState("");
  const [editOpen, setEditOpen] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [query, setQuery] = useState("");
  // Add User modal state
  const [addOpen, setAddOpen] = useState(false);
  const [addForm, setAddForm] = useState({ username: "", email: "", password: "", confirm_password: "" });
  const [addError, setAddError] = useState("");
  const [adding, setAdding] = useState(false);
  // New: Password visibility + backend info
  const [addPasswordVisible, setAddPasswordVisible] = useState(false);
  const [addConfirmVisible, setAddConfirmVisible] = useState(false);
  const [addInfo, setAddInfo] = useState("");

  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      const res = await axios.get(`${api}/auth/users`, { withCredentials: true });
      setRows(res.data.data || []);
    } catch (e) {
      setError(e.response?.data?.message || "Failed to fetch users");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isAdmin) fetchUsers(); // removed accessToken gate
  }, [isAdmin, fetchUsers]);

  const onEdit = (u) => {
    setSelectedId(u.id);
    setForm({
      username: u.username || "",
      email: u.email || "",
      role: u.role || "user",
      password: "",
    });
    setEditOpen(true);
  };

  const onDelete = async (id) => {
    if (!window.confirm("Delete this user?")) return;
    try {
      await axios.delete(`${api}/auth/users/${id}`, { withCredentials: true });
      setRows((prev) => prev.filter((r) => r.id !== id));
    } catch (e) {
      alert(e.response?.data?.message || "Delete failed");
    }
  };

  const submitEdit = async (e) => {
    e.preventDefault();
    const payload = { username: form.username, email: form.email, role: form.role };
    if (form.password) payload.password = form.password;
    try {
      await axios.put(`${api}/auth/users/${selectedId}`, payload, { withCredentials: true });
      setEditOpen(false);
      setForm(emptyForm);
      setSelectedId(null);
      fetchUsers();
    } catch (e) {
      alert(e.response?.data?.message || "Update failed");
    }
  };

  // Handlers for Add User modal
  const openAdd = () => {
    setAddError("");
    setAddInfo("");
    setAddForm({ username: "", email: "", password: "", confirm_password: "" });
    setAddOpen(true);
  };
  const closeAdd = () => setAddOpen(false);
  const submitAdd = async (e) => {
    e.preventDefault();
    setAddError("");
    setAddInfo("");
    const { username, email, password, confirm_password } = addForm;
    if (!username || !email || !password || !confirm_password) {
      setAddError("All fields are required.");
      return;
    }
    if (password.length < 8) {
      setAddError("Password must be at least 8 characters.");
      return;
    }
    if (password !== confirm_password) {
      setAddError("Password doesn't match.");
      return;
    }
    try {
      setAdding(true);
      const res = await axios.post(
        `${api}/auth/register`,
        { username: username.trim(), email: email.trim(), password },
        { withCredentials: true }
      );
      // Show backend message below the form and keep modal open
      setAddInfo(res?.data?.message || "User created successfully.");
      setAddForm({ username: "", email: "", password: "", confirm_password: "" });
      fetchUsers();
    } catch (e) {
      setAddError(e.response?.data?.message || "Create user failed");
    } finally {
      setAdding(false);
    }
  };

  if (!isAdmin) return <Navigate to="/dashboard" replace />;

  const filtered = rows.filter((u) => {
    const q = query.trim().toLowerCase();
    if (!q) return true;
    return (
      u.username?.toLowerCase().includes(q) ||
      u.email?.toLowerCase().includes(q) ||
      u.role?.toLowerCase().includes(q)
    );
  });

  return (
    <section className="bg-gray-50 dark:bg-gray-900 p-3 sm:p-5">
      <div className="mx-auto max-w-screen-xl px-4 lg:px-12">
        <div className="bg-white dark:bg-gray-800 relative shadow-md sm:rounded-lg overflow-hidden">
          <div className="flex flex-col md:flex-row items-center justify-between space-y-3 md:space-y-0 md:space-x-4 p-4">
            <div className="w-full md:w-1/2">
              <form className="flex items-center" onSubmit={(e) => e.preventDefault()}>
                <label htmlFor="simple-search" className="sr-only">
                  Search
                </label>
                <div className="relative w-full">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <svg
                      aria-hidden="true"
                      className="w-5 h-5 text-gray-500 dark:text-gray-400"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        fillRule="evenodd"
                        d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <input
                    type="text"
                    id="simple-search"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full pl-10 p-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                    placeholder="Search username, email, role"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                  />
                </div>
              </form>
            </div>
            <div className="w-full md:w-auto flex flex-col md:flex-row space-y-2 md:space-y-0 items-stretch md:items-center justify-end md:space-x-3 flex-shrink-0">
              {/* Add User button */}
              <button
                onClick={openAdd}
                type="button"
                className="flex items-center justify-center text-white bg-primary-700 hover:bg-primary-800 focus:ring-4 focus:ring-primary-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-primary-600 dark:hover:bg-primary-700 focus:outline-none dark:focus:ring-primary-800"
              >
                <svg className="h-3.5 w-3.5 mr-2" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                  <path clipRule="evenodd" fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" />
                </svg>
                Add user
              </button>
              {/* Existing Refresh button */}
              <button
                onClick={fetchUsers}
                type="button"
                className="flex items-center justify-center text-white bg-primary-700 hover:bg-primary-800 focus:ring-4 focus:ring-primary-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-primary-600 dark:hover:bg-primary-700 focus:outline-none dark:focus:ring-primary-800"
              >
                <svg
                  className="h-3.5 w-3.5 mr-2"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                  aria-hidden="true"
                >
                  <path
                    clipRule="evenodd"
                    fillRule="evenodd"
                    d="M10 3a1 1 0 011 1v4.379l1.447 1.447a1 1 0 11-1.414 1.414l-2.12-2.121A1 1 0 018 8.586V4a1 1 0 011-1zM4 11a6 6 0 1112 0 1 1 0 11-2 0 4 4 0 10-8 0 1 1 0 11-2 0z"
                  />
                </svg>
                Refresh
              </button>
            </div>
          </div>

          {error && (
            <div className="px-4 pb-2">
              <div className="text-sm text-red-600 dark:text-red-400">{error}</div>
            </div>
          )}

          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
              <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                <tr>
                  <th scope="col" className="px-4 py-3">ID</th>
                  <th scope="col" className="px-4 py-3">Username</th>
                  <th scope="col" className="px-4 py-3">Email</th>
                  <th scope="col" className="px-4 py-3">Role</th>
                  <th scope="col" className="px-4 py-3">Created</th>
                  <th scope="col" className="px-4 py-3"><span className="sr-only">Actions</span></th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr className="border-b dark:border-gray-700">
                    <td className="px-4 py-6" colSpan={6}>Loading...</td>
                  </tr>
                ) : filtered.length === 0 ? (
                  <tr className="border-b dark:border-gray-700">
                    <td className="px-4 py-6" colSpan={6}>No users found.</td>
                  </tr>
                ) : (
                  filtered.map((u) => (
                    <tr key={u.id} className="border-b dark:border-gray-700">
                      <th scope="row" className="px-4 py-3 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                        {u.id}
                      </th>
                      <td className="px-4 py-3">{u.username}</td>
                      <td className="px-4 py-3">{u.email}</td>
                      <td className="px-4 py-3">{u.role}</td>
                      <td className="px-4 py-3">{u.createdAt ? new Date(u.createdAt).toLocaleString() : "-"}</td>
                      <td className="px-4 py-3 flex items-center justify-end gap-2">
                        <button
                          className="inline-flex items-center px-3 py-1.5 text-xs font-medium text-white bg-amber-500 rounded-lg hover:bg-amber-600 focus:outline-none focus:ring-2 focus:ring-amber-300"
                          onClick={() => onEdit(u)}
                        >
                          Edit
                        </button>
                        <button
                          className="inline-flex items-center px-3 py-1.5 text-xs font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-300"
                          onClick={() => onDelete(u.id)}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Optional: simple footer placeholder for future pagination */}
          <nav
            className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-3 md:space-y-0 p-4"
            aria-label="Table navigation"
          >
            <span className="text-sm font-normal text-gray-500 dark:text-gray-400">
              Total{" "}
              <span className="font-semibold text-gray-900 dark:text-white">
                {rows.length}
              </span>{" "}
              users
            </span>
            {/* ...you can add pagination here later... */}
          </nav>
        </div>
      </div>

      {/* Add User Modal */}
      <Modal show={addOpen} size="lg" onClose={closeAdd}>
        <Modal.Header>Add User</Modal.Header>
        <Modal.Body>
          <form id="add-user-form" onSubmit={submitAdd}>
            <div className="grid grid-flow-row gap-4 mb-4 sm:grid-cols-2">
              {/* Only render when error exists to avoid empty grid item affecting layout */}
              {addError ? (
                <div className="sm:col-span-2">
                  <div className="text-sm text-red-600 dark:text-red-400">{addError}</div>
                </div>
              ) : null}
              <div className="sm:order-1">
                <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                  Username
                </label>
                <input
                  type="text"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                  value={addForm.username}
                  onChange={(e) => setAddForm((f) => ({ ...f, username: e.target.value }))}
                  placeholder="Type username"
                  autoFocus
                  required
                />
              </div>
              <div className="sm:order-2">
                <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                  Email
                </label>
                <input
                  type="email"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                  value={addForm.email}
                  onChange={(e) => setAddForm((f) => ({ ...f, email: e.target.value }))}
                  placeholder="user@example.com"
                  required
                />
              </div>
              <div className="sm:order-3">
                <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={addPasswordVisible ? "text" : "password"}
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 pr-9 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                    value={addForm.password}
                    onChange={(e) => setAddForm((f) => ({ ...f, password: e.target.value }))}
                    placeholder="Min 8 characters"
                    required
                  />
                  <span
                    className="absolute inset-y-0 right-2 flex items-center cursor-pointer"
                    onClick={() => setAddPasswordVisible((v) => !v)}
                    aria-label="Toggle password visibility"
                  >
                    {addPasswordVisible ? <EyeClosedIcon /> : <EyeOpenIcon />}
                  </span>
                </div>
              </div>
              <div className="sm:order-4">
                <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                  Confirm password
                </label>
                <div className="relative">
                  <input
                    type={addConfirmVisible ? "text" : "password"}
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 pr-9 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                    value={addForm.confirm_password}
                    onChange={(e) => setAddForm((f) => ({ ...f, confirm_password: e.target.value }))}
                    placeholder="Re-enter password"
                    required
                  />
                  <span
                    className="absolute inset-y-0 right-2 flex items-center cursor-pointer"
                    onClick={() => setAddConfirmVisible((v) => !v)}
                    aria-label="Toggle confirm password visibility"
                  >
                    {addConfirmVisible ? <EyeClosedIcon /> : <EyeOpenIcon />}
                  </span>
                </div>
              </div>
            </div>
            {/* Backend response info below all form fields */}
            {addInfo && (
              <div className="mt-2 text-sm text-emerald-600 dark:text-emerald-400">
                {addInfo}
              </div>
            )}
          </form>
        </Modal.Body>
        <Modal.Footer>
          <button
            type="button"
            className="text-gray-500 bg-white hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-gray-200 rounded-lg border border-gray-200 text-sm font-medium px-5 py-2.5 hover:text-gray-900 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-500 dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-600"
            onClick={closeAdd}
            disabled={adding}
          >
            Cancel
          </button>
          <button
            type="submit"
            form="add-user-form"
            className="text-white bg-primary-700 hover:bg-primary-800 focus:ring-4 focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-primary-600 dark:hover:bg-primary-700 focus:outline-none dark:focus:ring-primary-800 disabled:opacity-60"
            disabled={adding}
          >
            {adding ? "Creating..." : "Create"}
          </button>
        </Modal.Footer>
      </Modal>

      {/* Edit Modal (restored to remove ESLint warnings and enable editing) */}
      <Modal show={editOpen} size="lg" onClose={() => setEditOpen(false)}>
        <Modal.Header>Edit User</Modal.Header>
        <Modal.Body>
          <form id="edit-user-form" onSubmit={submitEdit}>
            <div className="grid gap-4 mb-4 sm:grid-cols-2">
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                  Username
                </label>
                <input
                  type="text"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                  value={form.username}
                  onChange={(e) => setForm((f) => ({ ...f, username: e.target.value }))}
                  placeholder="Type username"
                  required
                />
              </div>
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                  Email
                </label>
                <input
                  type="email"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                  value={form.email}
                  onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                  placeholder="user@example.com"
                  required
                />
              </div>
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                  Role
                </label>
                <select
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                  value={form.role}
                  onChange={(e) => setForm((f) => ({ ...f, role: e.target.value }))}
                >
                  <option value="user">user</option>
                  <option value="engineer">engineer</option>
                  <option value="admin">admin</option>
                </select>
              </div>
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                  Password (optional)
                </label>
                <input
                  type="password"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                  value={form.password}
                  onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
                  placeholder="Leave blank to keep current"
                />
              </div>
            </div>
          </form>
        </Modal.Body>
        <Modal.Footer>
          <button
            type="button"
            className="text-gray-500 bg-white hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-gray-200 rounded-lg border border-gray-200 text-sm font-medium px-5 py-2.5 hover:text-gray-900 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-500 dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-600"
            onClick={() => setEditOpen(false)}
          >
            Cancel
          </button>
          <button
            type="submit"
            form="edit-user-form"
            className="text-white bg-primary-700 hover:bg-primary-800 focus:ring-4 focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-primary-600 dark:hover:bg-primary-700 focus:outline-none dark:focus:ring-primary-800"
          >
            Save changes
          </button>
        </Modal.Footer>
      </Modal>
    </section>
  );
};

export default UserManagement;
