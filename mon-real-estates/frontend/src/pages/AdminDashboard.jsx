// src/pages/AdminDashboard.jsx
import React, { useState, useEffect } from "react";
import { propertiesAPI, contactsAPI, authAPI } from "../services/api";

const AdminDashboard = () => {
  const [allProperties, setAllProperties] = useState([]);
  const [allContacts, setAllContacts] = useState([]);
  const [allAdmins, setAllAdmins] = useState([]);
  const [newProperty, setNewProperty] = useState({
    title: "",
    location: "",
    price: "",
    type: "",
    image: null, // file object
    description: "",
    featured: false
  });
  const [newAdmin, setNewAdmin] = useState({
    name: "",
    email: "",
    password: ""
  });
  const [editingAdmin, setEditingAdmin] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [activeTab, setActiveTab] = useState("properties");

  // Load properties, contacts, and admins from backend
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [propertiesRes, contactsRes, adminsRes] = await Promise.all([
          propertiesAPI.getAll(),
          contactsAPI.getAll(),
          authAPI.getAllAdmins()
        ]);
        setAllProperties(propertiesRes.data);
        setAllContacts(contactsRes.data);
        setAllAdmins(adminsRes.data);
      } catch (err) {
        console.error("Error fetching data:", err);
      }
    };
    fetchData();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    if (type === "checkbox") {
      setNewProperty({ ...newProperty, [name]: checked });
    } else if (type === "file") {
      setNewProperty({ ...newProperty, [name]: files[0] });
    } else {
      setNewProperty({ ...newProperty, [name]: value });
    }
  };

  const handleAddProperty = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      let keys = Object.keys(newProperty);
      keys.forEach((key) => {
        formData.append(key, newProperty[key]);
      });

      let res;
      if (editingId) {
        res = await propertiesAPI.update(editingId, formData, true);
        setAllProperties(allProperties.map((p) => (p._id === editingId ? res.data : p)));
        setEditingId(null);
        setSuccessMessage("✅ Property updated successfully!");
      } else {
        res = await propertiesAPI.create(formData, true);
        setAllProperties([...allProperties, res.data]);
        setSuccessMessage("✅ Property added successfully!");
      }

      // Reset form
      setNewProperty({
        title: "",
        location: "",
        price: "",
        type: "",
        image: null,
        description: "",
        featured: false
      });

      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (err) {
      console.error("Error saving property:", err);
    }
  };

  const handleEdit = (property) => {
    setEditingId(property._id);
    setNewProperty({
      ...property,
      image: null // reset file input, keep existing URL in DB
    });
  };

  const handleDelete = async (id) => {
    try {
      await propertiesAPI.delete(id);
      setAllProperties(allProperties.filter((p) => p._id !== id));
      setSuccessMessage("❌ Property deleted successfully!");
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (err) {
      console.error("Error deleting property:", err);
    }
  };

  const handleCreateAdmin = async (e) => {
    e.preventDefault();
    try {
      const res = await authAPI.createAdmin(newAdmin);
      setAllAdmins([...allAdmins, res.data.user]);
      setSuccessMessage("✅ Admin created successfully!");
      setNewAdmin({ name: "", email: "", password: "" });
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (err) {
      console.error("Error creating admin:", err);
      setSuccessMessage("❌ Failed to create admin. Please try again.");
      setTimeout(() => setSuccessMessage(""), 3000);
    }
  };

  const handleEditAdmin = (admin) => {
    setEditingAdmin(admin);
  };

  const handleUpdateAdmin = async (e) => {
    e.preventDefault();
    try {
      const res = await authAPI.updateAdmin(editingAdmin._id, {
        name: editingAdmin.name,
        email: editingAdmin.email
      });
      setAllAdmins(allAdmins.map(a => a._id === editingAdmin._id ? res.data.user : a));
      setSuccessMessage("✅ Admin updated successfully!");
      setEditingAdmin(null);
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (err) {
      console.error("Error updating admin:", err);
      setSuccessMessage("❌ Failed to update admin. Please try again.");
      setTimeout(() => setSuccessMessage(""), 3000);
    }
  };

  const handleDeleteAdmin = async (id) => {
    if (!window.confirm("Are you sure you want to delete this admin?")) return;
    try {
      await authAPI.deleteAdmin(id);
      setAllAdmins(allAdmins.filter(a => a._id !== id));
      setSuccessMessage("❌ Admin deleted successfully!");
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (err) {
      console.error("Error deleting admin:", err);
      setSuccessMessage("❌ Failed to delete admin. Please try again.");
      setTimeout(() => setSuccessMessage(""), 3000);
    }
  };

  const handleAdminChange = (e) => {
    const { name, value } = e.target;
    if (editingAdmin) {
      setEditingAdmin({ ...editingAdmin, [name]: value });
    } else {
      setNewAdmin({ ...newAdmin, [name]: value });
    }
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#e8e8e8" }}>
      <div className="container mx-auto p-6">
        <h1 className="text-4xl font-bold mb-8 text-center" style={{ color: "#2c2863" }}>
          Admin Dashboard
        </h1>

        {successMessage && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-6">
            {successMessage}
          </div>
        )}

        {/* Tabs */}
        <div className="flex justify-center mb-8">
          <button
            onClick={() => setActiveTab("properties")}
            className={`px-6 py-3 rounded-l-lg font-semibold transition ${
              activeTab === "properties"
                ? "bg-[#2c2863] text-white"
                : "bg-white text-[#2c2863] border border-[#2c2863]"
            }`}
          >
            Properties
          </button>
          <button
            onClick={() => setActiveTab("contacts")}
            className={`px-6 py-3 font-semibold transition ${
              activeTab === "contacts"
                ? "bg-[#2c2863] text-white"
                : "bg-white text-[#2c2863] border border-[#2c2863]"
            }`}
          >
            Contact Messages
          </button>
          <button
            onClick={() => setActiveTab("admins")}
            className={`px-6 py-3 rounded-r-lg font-semibold transition ${
              activeTab === "admins"
                ? "bg-[#2c2863] text-white"
                : "bg-white text-[#2c2863] border border-[#2c2863]"
            }`}
          >
            Manage Admins
          </button>
        </div>

        {activeTab === "properties" && (
          <>
            {/* Add/Edit Property Form */}
            <div className="bg-white p-6 rounded-lg shadow-md mb-10">
              <h2 className="text-2xl font-semibold mb-4" style={{ color: "#2c2863" }}>
                {editingId ? "Edit Property" : "Add New Property"}
              </h2>
              <form onSubmit={handleAddProperty} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="text"
                  name="title"
                  placeholder="Title"
                  value={newProperty.title}
                  onChange={handleChange}
                  className="border border-gray-300 p-3 rounded focus:outline-none focus:ring-2 focus:ring-[#e81d2b]"
                  required
                />
                <input
                  type="text"
                  name="location"
                  placeholder="Location"
                  value={newProperty.location}
                  onChange={handleChange}
                  className="border border-gray-300 p-3 rounded focus:outline-none focus:ring-2 focus:ring-[#e81d2b]"
                  required
                />
                <input
                  type="number"
                  name="price"
                  placeholder="Price"
                  value={newProperty.price}
                  onChange={handleChange}
                  className="border border-gray-300 p-3 rounded focus:outline-none focus:ring-2 focus:ring-[#e81d2b]"
                  required
                />
                <select
                  name="type"
                  value={newProperty.type}
                  onChange={handleChange}
                  className="border border-gray-300 p-3 rounded focus:outline-none focus:ring-2 focus:ring-[#e81d2b]"
                  required
                >
                  <option value="">Select Type</option>
                  <option value="Villa">Villa</option>
                  <option value="Apartment">Apartment</option>
                  <option value="Cottage">Cottage</option>
                </select>
                <div className="md:col-span-2">
                  <label
                    htmlFor="image"
                    className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-6 cursor-pointer hover:border-[#e81d2b] transition"
                  >
                    <svg
                      className="w-12 h-12 text-gray-400 mb-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M7 16V4m0 0l-4 4m4-4l4 4M17 8v12m0 0l-4-4m4 4l4-4"
                      />
                    </svg>
                    <span className="text-gray-600">Click to upload image</span>
                    {newProperty.image && (
                      <span className="mt-2 text-sm text-green-600">
                        {newProperty.image.name}
                      </span>
                    )}
                  </label>
                  <input
                    id="image"
                    type="file"
                    name="image"
                    accept="image/*"
                    onChange={handleChange}
                    className="hidden"
                    required={!editingId}
                  />
                </div>
                <textarea
                  name="description"
                  placeholder="Description"
                  value={newProperty.description}
                  onChange={handleChange}
                  className="border border-gray-300 p-3 rounded focus:outline-none focus:ring-2 focus:ring-[#e81d2b] md:col-span-2"
                  rows="4"
                  required
                />
                <label className="flex items-center gap-2 md:col-span-2">
                  <input
                    type="checkbox"
                    name="featured"
                    checked={newProperty.featured}
                    onChange={handleChange}
                    className="w-4 h-4 text-[#e81d2b] focus:ring-[#e81d2b]"
                  />
                  Featured Property
                </label>
                <button
                  type="submit"
                  className="bg-[#e81d2b] text-white px-6 py-3 rounded hover:bg-red-700 transition md:col-span-2 font-semibold"
                >
                  {editingId ? "Update Property" : "Add Property"}
                </button>
              </form>
            </div>

            {/* Property List */}
            <h2 className="text-2xl font-semibold mb-6" style={{ color: "#2c2863" }}>
              Current Properties
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {allProperties.map((property) => (
                <div
                  key={property._id}
                  className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition"
                >
                  <img
                    src={property.image}
                    alt={property.title}
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-4">
                    <h3 className="text-xl font-bold mb-2" style={{ color: "#2c2863" }}>
                      {property.title}
                    </h3>
                    <p className="text-gray-600 mb-1">{property.location}</p>
                    <p className="text-[#e81d2b] font-semibold text-lg mb-1">${property.price}</p>
                    <p className="text-sm text-gray-500 mb-2">{property.type}</p>
                    <p className="text-gray-700 mb-3 line-clamp-3">{property.description}</p>
                    {property.featured && (
                      <span className="inline-block bg-yellow-500 text-white px-3 py-1 rounded text-sm mb-3">
                        Featured
                      </span>
                    )}
                    <div className="flex gap-3">
                      <button
                        onClick={() => handleEdit(property)}
                        className="bg-[#2c2863] text-white px-4 py-2 rounded hover:bg-blue-800 transition flex-1"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(property._id)}
                        className="bg-[#e81d2b] text-white px-4 py-2 rounded hover:bg-red-700 transition flex-1"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {activeTab === "contacts" && (
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold mb-6" style={{ color: "#2c2863" }}>
              Contact Messages
            </h2>
            {allContacts.length === 0 ? (
              <p className="text-gray-500">No contact messages yet.</p>
            ) : (
              <div className="space-y-4">
                {allContacts.map((contact) => (
                  <div
                    key={contact._id}
                    className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-lg font-semibold" style={{ color: "#2c2863" }}>
                        {contact.name}
                      </h3>
                      <span className="text-sm text-gray-500">
                        {new Date(contact.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-gray-700 mb-1">
                      <strong>Email:</strong> {contact.email}
                    </p>
                    <p className="text-gray-700 mb-1">
                      <strong>Phone:</strong> {contact.phone}
                    </p>
                    <p className="text-gray-700">
                      <strong>Message:</strong> {contact.message}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === "admins" && (
          <div className="space-y-8">
            {/* Create New Admin Form */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-2xl font-semibold mb-6" style={{ color: "#2c2863" }}>
                {editingAdmin ? "Edit Admin" : "Create New Admin"}
              </h2>
              <form onSubmit={editingAdmin ? handleUpdateAdmin : handleCreateAdmin} className="max-w-md">
                <div className="mb-4">
                  <input
                    type="text"
                    name="name"
                    placeholder="Full Name"
                    value={editingAdmin ? editingAdmin.name : newAdmin.name}
                    onChange={handleAdminChange}
                    className="w-full border border-gray-300 p-3 rounded focus:outline-none focus:ring-2 focus:ring-[#e81d2b]"
                    required
                  />
                </div>
                <div className="mb-4">
                  <input
                    type="email"
                    name="email"
                    placeholder="Email Address"
                    value={editingAdmin ? editingAdmin.email : newAdmin.email}
                    onChange={handleAdminChange}
                    className="w-full border border-gray-300 p-3 rounded focus:outline-none focus:ring-2 focus:ring-[#e81d2b]"
                    required
                  />
                </div>
                {!editingAdmin && (
                  <div className="mb-6">
                    <input
                      type="password"
                      name="password"
                      placeholder="Password"
                      value={newAdmin.password}
                      onChange={handleAdminChange}
                      className="w-full border border-gray-300 p-3 rounded focus:outline-none focus:ring-2 focus:ring-[#e81d2b]"
                      required
                    />
                  </div>
                )}
                <div className="flex gap-3">
                  <button
                    type="submit"
                    className="flex-1 bg-[#e81d2b] text-white px-6 py-3 rounded hover:bg-red-700 transition font-semibold"
                  >
                    {editingAdmin ? "Update Admin" : "Create Admin"}
                  </button>
                  {editingAdmin && (
                    <button
                      type="button"
                      onClick={() => setEditingAdmin(null)}
                      className="flex-1 bg-gray-500 text-white px-6 py-3 rounded hover:bg-gray-600 transition font-semibold"
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </form>
            </div>

            {/* Admin List */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-2xl font-semibold mb-6" style={{ color: "#2c2863" }}>
                Current Admins
              </h2>
              {allAdmins.length === 0 ? (
                <p className="text-gray-500">No admins found.</p>
              ) : (
                <div className="space-y-4">
                  {allAdmins.map((admin) => (
                    <div
                      key={admin._id}
                      className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition"
                    >
                      <div className="flex justify-between items-center">
                        <div>
                          <h3 className="text-lg font-semibold" style={{ color: "#2c2863" }}>
                            {admin.name}
                          </h3>
                          <p className="text-gray-600">{admin.email}</p>
                          <p className="text-sm text-gray-500">
                            Created: {new Date(admin.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="flex gap-3">
                          <button
                            onClick={() => handleEditAdmin(admin)}
                            className="bg-[#2c2863] text-white px-4 py-2 rounded hover:bg-blue-800 transition"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteAdmin(admin._id)}
                            className="bg-[#e81d2b] text-white px-4 py-2 rounded hover:bg-red-700 transition"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
