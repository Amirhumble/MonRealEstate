// src/pages/AdminDashboard.jsx
import React, { useState, useEffect } from "react";
import { propertiesAPI, projectsAPI, contactsAPI, authAPI } from "../services/api";

const AdminDashboard = () => {
  const [allProperties, setAllProperties] = useState([]);
  const [allProjects, setAllProjects] = useState([]);
  const [allContacts, setAllContacts] = useState([]);
  const [allAdmins, setAllAdmins] = useState([]);
  const [newProperty, setNewProperty] = useState({
    title: "",
    location: "",
    price: "",
    type: "",
    image: null,
    images: [],
    description: "",
    status: "For Sale",
    bedrooms: "",
    bathrooms: "",
    area: "",
    lotSize: "",
    yearBuilt: "",
    parking: "",
    floors: "",
    features: "",
    amenities: "",
    address: "",
    city: "",
    neighborhood: "",
    zipCode: "",
    floorPlans: [],
    virtualTour: "",
    videoUrl: "",
    agentName: "",
    agentEmail: "",
    agentPhone: "",
    agentPhoto: null,
    featured: false
  });
  const [newProject, setNewProject] = useState({
    name: "",
    status: "Upcoming",
    location: "",
    description: "",
    coverImage: null,
    images: [],
    units: "",
    size: "",
    amenities: "",
    features: "",
    timeline: "",
    completionDate: "",
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
  const [editingProjectId, setEditingProjectId] = useState(null);
  const [activeTab, setActiveTab] = useState("properties");
  const [isLoading, setIsLoading] = useState(false);
  const [editingPropertyName, setEditingPropertyName] = useState("");
  const [editingProjectName, setEditingProjectName] = useState("");

  // Load properties, projects, contacts, and admins from backend
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [propertiesRes, projectsRes, contactsRes, adminsRes] = await Promise.all([
          propertiesAPI.getAll(),
          projectsAPI.getAll(),
          contactsAPI.getAll(),
          authAPI.getAllAdmins()
        ]);
        setAllProperties(propertiesRes.data);
        setAllProjects(projectsRes.data);
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
    } else if (name === "image" || name === "agentPhoto") {
      setNewProperty({ ...newProperty, [name]: files[0] });
    } else if (name === "images" || name === "floorPlans") {
      setNewProperty({ ...newProperty, [name]: Array.from(files) });
    } else {
      setNewProperty({ ...newProperty, [name]: value });
    }
  };

  const handleAddProperty = async (e) => {
    e.preventDefault();
    
    // Validate required fields
    if (!newProperty.title || !newProperty.type || !newProperty.price || !newProperty.location || !newProperty.description) {
      setSuccessMessage("❌ Please fill in all required fields (Title, Type, Price, Location, Description)");
      setTimeout(() => setSuccessMessage(""), 5000);
      return;
    }
    
    if (!editingId && !newProperty.image) {
      setSuccessMessage("❌ Please upload a main image for the property");
      setTimeout(() => setSuccessMessage(""), 5000);
      return;
    }
    
    setIsLoading(true);
    
    try {
      const formData = new FormData();
      
      // Append all text fields
      Object.keys(newProperty).forEach((key) => {
        if (key !== 'image' && key !== 'images' && key !== 'floorPlans' && key !== 'agentPhoto' && key !== 'features' && key !== 'amenities') {
          if (newProperty[key] !== '' && newProperty[key] !== null && newProperty[key] !== undefined) {
            formData.append(key, newProperty[key]);
          }
        }
      });

      // Parse and append arrays
      if (newProperty.features) {
        const featuresArray = newProperty.features.split(",").map(f => f.trim()).filter(f => f);
        if (featuresArray.length > 0) {
          formData.append("features", JSON.stringify(featuresArray));
        }
      }
      if (newProperty.amenities) {
        const amenitiesArray = newProperty.amenities.split(",").map(a => a.trim()).filter(a => a);
        if (amenitiesArray.length > 0) {
          formData.append("amenities", JSON.stringify(amenitiesArray));
        }
      }

      // Append files
      if (newProperty.image) {
        formData.append("image", newProperty.image);
      }
      if (newProperty.images && newProperty.images.length > 0) {
        newProperty.images.forEach(img => {
          formData.append("images", img);
        });
      }
      if (newProperty.floorPlans && newProperty.floorPlans.length > 0) {
        newProperty.floorPlans.forEach(plan => {
          formData.append("floorPlans", plan);
        });
      }
      if (newProperty.agentPhoto) {
        formData.append("agentPhoto", newProperty.agentPhoto);
      }

      let res;
      if (editingId) {
        res = await propertiesAPI.update(editingId, formData, true);
        setAllProperties(allProperties.map((p) => (p._id === editingId ? res.data : p)));
        setEditingId(null);
        setEditingPropertyName("");
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
        images: [],
        description: "",
        status: "For Sale",
        bedrooms: "",
        bathrooms: "",
        area: "",
        lotSize: "",
        yearBuilt: "",
        parking: "",
        floors: "",
        features: "",
        amenities: "",
        address: "",
        city: "",
        neighborhood: "",
        zipCode: "",
        floorPlans: [],
        virtualTour: "",
        videoUrl: "",
        agentName: "",
        agentEmail: "",
        agentPhone: "",
        agentPhoto: null,
        featured: false
      });

      // Scroll to top to see success message
      window.scrollTo({ top: 0, behavior: 'smooth' });
      
      setTimeout(() => setSuccessMessage(""), 5000);
    } catch (err) {
      console.error("Error saving property:", err);
      const errorMessage = err.response?.data?.error || err.message || "Unknown error occurred";
      setSuccessMessage(`❌ Failed to save property: ${errorMessage}`);
      setTimeout(() => setSuccessMessage(""), 5000);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (property) => {
    setEditingId(property._id);
    setEditingPropertyName(property.title);
    setNewProperty({
      title: property.title || "",
      location: property.location || "",
      price: property.price || "",
      type: property.type || "",
      image: null,
      images: [],
      description: property.description || "",
      status: property.status || "For Sale",
      bedrooms: property.bedrooms || "",
      bathrooms: property.bathrooms || "",
      area: property.area || "",
      lotSize: property.lotSize || "",
      yearBuilt: property.yearBuilt || "",
      parking: property.parking || "",
      floors: property.floors || "",
      features: property.features ? property.features.join(", ") : "",
      amenities: property.amenities ? property.amenities.join(", ") : "",
      address: property.address || "",
      city: property.city || "",
      neighborhood: property.neighborhood || "",
      zipCode: property.zipCode || "",
      floorPlans: [],
      virtualTour: property.virtualTour || "",
      videoUrl: property.videoUrl || "",
      agentName: property.agentName || "",
      agentEmail: property.agentEmail || "",
      agentPhone: property.agentPhone || "",
      agentPhoto: null,
      featured: property.featured || false
    });
    
    // Auto-scroll to form with smooth animation
    setTimeout(() => {
      const formElement = document.getElementById('property-form');
      if (formElement) {
        formElement.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'start',
          inline: 'nearest'
        });
        
        // Add highlight animation
        formElement.classList.add('edit-mode-highlight');
        setTimeout(() => {
          formElement.classList.remove('edit-mode-highlight');
        }, 2000);
      }
    }, 100);
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

  // Project handlers
  const handleProjectChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    if (type === "checkbox") {
      setNewProject({ ...newProject, [name]: checked });
    } else if (name === "coverImage") {
      setNewProject({ ...newProject, [name]: files[0] });
    } else if (name === "images") {
      setNewProject({ ...newProject, [name]: Array.from(files) });
    } else {
      setNewProject({ ...newProject, [name]: value });
    }
  };

  const handleAddProject = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      
      // Append simple fields
      formData.append("name", newProject.name);
      formData.append("status", newProject.status);
      formData.append("location", newProject.location);
      formData.append("description", newProject.description);
      formData.append("featured", newProject.featured);
      
      if (newProject.units) formData.append("units", newProject.units);
      if (newProject.size) formData.append("size", newProject.size);
      if (newProject.timeline) formData.append("timeline", newProject.timeline);
      if (newProject.completionDate) formData.append("completionDate", newProject.completionDate);
      
      // Parse and append arrays
      if (newProject.amenities) {
        const amenitiesArray = newProject.amenities.split(",").map(a => a.trim()).filter(a => a);
        formData.append("amenities", JSON.stringify(amenitiesArray));
      }
      if (newProject.features) {
        const featuresArray = newProject.features.split(",").map(f => f.trim()).filter(f => f);
        formData.append("features", JSON.stringify(featuresArray));
      }
      
      // Append files
      if (newProject.coverImage) {
        formData.append("coverImage", newProject.coverImage);
      }
      if (newProject.images && newProject.images.length > 0) {
        newProject.images.forEach(img => {
          formData.append("images", img);
        });
      }

      let res;
      if (editingProjectId) {
        res = await projectsAPI.update(editingProjectId, formData, true);
        setAllProjects(allProjects.map((p) => (p._id === editingProjectId ? res.data : p)));
        setEditingProjectId(null);
        setEditingProjectName("");
        setSuccessMessage("✅ Project updated successfully!");
      } else {
        res = await projectsAPI.create(formData, true);
        setAllProjects([...allProjects, res.data]);
        setSuccessMessage("✅ Project added successfully!");
      }

      // Reset form
      setNewProject({
        name: "",
        status: "Upcoming",
        location: "",
        description: "",
        coverImage: null,
        images: [],
        units: "",
        size: "",
        amenities: "",
        features: "",
        timeline: "",
        completionDate: "",
        featured: false
      });

      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (err) {
      console.error("Error saving project:", err);
      setSuccessMessage("❌ Failed to save project. Please try again.");
      setTimeout(() => setSuccessMessage(""), 3000);
    }
  };

  const handleEditProject = (project) => {
    setEditingProjectId(project._id);
    setEditingProjectName(project.name);
    setNewProject({
      name: project.name,
      status: project.status,
      location: project.location,
      description: project.description,
      coverImage: null,
      images: [],
      units: project.units || "",
      size: project.size || "",
      amenities: project.amenities ? project.amenities.join(", ") : "",
      features: project.features ? project.features.join(", ") : "",
      timeline: project.timeline || "",
      completionDate: project.completionDate || "",
      featured: project.featured
    });
    
    // Auto-scroll to form with smooth animation
    setTimeout(() => {
      const formElement = document.getElementById('project-form');
      if (formElement) {
        formElement.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'start',
          inline: 'nearest'
        });
        
        // Add highlight animation
        formElement.classList.add('edit-mode-highlight');
        setTimeout(() => {
          formElement.classList.remove('edit-mode-highlight');
        }, 2000);
      }
    }, 100);
  };

  const handleDeleteProject = async (id) => {
    if (!window.confirm("Are you sure you want to delete this project?")) return;
    try {
      await projectsAPI.delete(id);
      setAllProjects(allProjects.filter((p) => p._id !== id));
      setSuccessMessage("❌ Project deleted successfully!");
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (err) {
      console.error("Error deleting project:", err);
    }
  };

  const cancelPropertyEdit = () => {
    setEditingId(null);
    setEditingPropertyName("");
    setNewProperty({
      title: "",
      location: "",
      price: "",
      type: "",
      image: null,
      images: [],
      description: "",
      status: "For Sale",
      bedrooms: "",
      bathrooms: "",
      area: "",
      lotSize: "",
      yearBuilt: "",
      parking: "",
      floors: "",
      features: "",
      amenities: "",
      address: "",
      city: "",
      neighborhood: "",
      zipCode: "",
      floorPlans: [],
      virtualTour: "",
      videoUrl: "",
      agentName: "",
      agentEmail: "",
      agentPhone: "",
      agentPhoto: null,
      featured: false
    });
  };

  const cancelProjectEdit = () => {
    setEditingProjectId(null);
    setEditingProjectName("");
    setNewProject({
      name: "",
      status: "Upcoming",
      location: "",
      description: "",
      coverImage: null,
      images: [],
      units: "",
      size: "",
      amenities: "",
      features: "",
      timeline: "",
      completionDate: "",
      featured: false
    });
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#e8e8e8" }}>
      <style jsx>{`
        .edit-mode-highlight {
          animation: editHighlight 2s ease-in-out;
        }
        
        @keyframes editHighlight {
          0% { 
            box-shadow: 0 0 0 0 rgba(59, 130, 246, 0.7);
            transform: scale(1);
          }
          50% { 
            box-shadow: 0 0 0 10px rgba(59, 130, 246, 0.3);
            transform: scale(1.02);
          }
          100% { 
            box-shadow: 0 0 0 0 rgba(59, 130, 246, 0);
            transform: scale(1);
          }
        }
      `}</style>
      <div className="container mx-auto p-4 sm:p-6">
        <h1 className="text-3xl sm:text-4xl font-bold mb-6 sm:mb-8 text-center" style={{ color: "#2c2863" }}>
          Admin Dashboard
        </h1>

        {successMessage && (
          <div className={`px-6 py-4 rounded-lg mb-6 border-l-4 ${
            successMessage.includes('✅') 
              ? 'bg-green-50 border-green-400 text-green-800' 
              : 'bg-red-50 border-red-400 text-red-800'
          }`}>
            <div className="flex items-center">
              <div className="flex-shrink-0">
                {successMessage.includes('✅') ? (
                  <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                ) : (
                  <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                )}
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium">{successMessage}</p>
              </div>
            </div>
          </div>
        )}

        {/* Tabs */}
        <div className="flex justify-center mb-6 sm:mb-8 overflow-x-auto">
          <div className="flex gap-2 min-w-max px-2 sm:px-0">
            <button
              onClick={() => setActiveTab("properties")}
              className={`px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-semibold transition whitespace-nowrap ${
                activeTab === "properties"
                  ? "bg-[#2c2863] text-white"
                  : "bg-white text-[#2c2863] border border-[#2c2863]"
              }`}
            >
              Properties
            </button>
            <button
              onClick={() => setActiveTab("projects")}
              className={`px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-semibold transition whitespace-nowrap ${
                activeTab === "projects"
                  ? "bg-[#2c2863] text-white"
                  : "bg-white text-[#2c2863] border border-[#2c2863]"
              }`}
            >
              Projects
            </button>
            <button
              onClick={() => setActiveTab("contacts")}
              className={`px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-semibold transition whitespace-nowrap ${
                activeTab === "contacts"
                  ? "bg-[#2c2863] text-white"
                  : "bg-white text-[#2c2863] border border-[#2c2863]"
              }`}
            >
              <span className="hidden sm:inline">Contact Messages</span>
              <span className="sm:hidden">Contacts</span>
            </button>
            <button
              onClick={() => setActiveTab("admins")}
              className={`px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-semibold transition whitespace-nowrap ${
                activeTab === "admins"
                  ? "bg-[#2c2863] text-white"
                  : "bg-white text-[#2c2863] border border-[#2c2863]"
              }`}
            >
              <span className="hidden sm:inline">Manage Admins</span>
              <span className="sm:hidden">Admins</span>
            </button>
          </div>
        </div>

        {activeTab === "properties" && (
          <>
            {/* Edit Mode Banner */}
            {editingId && (
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-l-4 border-blue-500 p-4 mb-6 rounded-lg shadow-sm">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <svg className="h-6 w-6 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <h3 className="text-lg font-semibold text-blue-800">
                        🏠 Editing Property: "{editingPropertyName}"
                      </h3>
                      <p className="text-sm text-blue-600">
                        Make your changes below and click "Update Property" to save.
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={cancelPropertyEdit}
                    className="text-blue-500 hover:text-blue-700 transition-colors"
                    title="Cancel editing"
                  >
                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>
            )}

            {/* Add/Edit Property Form */}
            <div 
              id="property-form"
              className={`bg-white p-6 rounded-lg shadow-md mb-10 transition-all duration-500 ${
                editingId ? 'ring-2 ring-blue-200 bg-gradient-to-br from-blue-50/30 to-white' : ''
              }`}
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-semibold" style={{ color: "#2c2863" }}>
                  {editingId ? (
                    <span className="flex items-center gap-2">
                      <svg className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                      Edit Property
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                      </svg>
                      Add New Property
                    </span>
                  )}
                </h2>
                {editingId && (
                  <div className="text-sm text-blue-600 bg-blue-100 px-3 py-1 rounded-full">
                    Edit Mode Active
                  </div>
                )}
              </div>
              <form onSubmit={handleAddProperty} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Basic Information */}
                <div className="sm:col-span-2">
                  <h3 className="text-lg font-semibold text-gray-700 mb-3">Basic Information</h3>
                </div>
                
                <input
                  type="text"
                  name="title"
                  placeholder="Property Title *"
                  value={newProperty.title}
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
                  <option value="">Select Type *</option>
                  <option value="Villa">Villa</option>
                  <option value="Apartment">Apartment</option>
                  <option value="House">House</option>
                  <option value="Studio">Studio</option>
                  <option value="Penthouse">Penthouse</option>
                </select>
                
                <input
                  type="number"
                  name="price"
                  placeholder="Price *"
                  value={newProperty.price}
                  onChange={handleChange}
                  className="border border-gray-300 p-3 rounded focus:outline-none focus:ring-2 focus:ring-[#e81d2b]"
                  required
                />
                
                <select
                  name="status"
                  value={newProperty.status}
                  onChange={handleChange}
                  className="border border-gray-300 p-3 rounded focus:outline-none focus:ring-2 focus:ring-[#e81d2b]"
                >
                  <option value="For Sale">For Sale</option>
                  <option value="For Rent">For Rent</option>
                  <option value="Sold">Sold</option>
                  <option value="Pending">Pending</option>
                </select>
                
                <textarea
                  name="description"
                  placeholder="Property Description *"
                  value={newProperty.description}
                  onChange={handleChange}
                  className="border border-gray-300 p-3 rounded focus:outline-none focus:ring-2 focus:ring-[#e81d2b] md:col-span-2"
                  rows="4"
                  required
                />
                
                {/* Property Details */}
                <div className="md:col-span-2 mt-4">
                  <h3 className="text-lg font-semibold text-gray-700 mb-3">Property Details</h3>
                </div>
                
                <input
                  type="number"
                  name="bedrooms"
                  placeholder="Bedrooms"
                  value={newProperty.bedrooms}
                  onChange={handleChange}
                  className="border border-gray-300 p-3 rounded focus:outline-none focus:ring-2 focus:ring-[#e81d2b]"
                />
                
                <input
                  type="number"
                  name="bathrooms"
                  placeholder="Bathrooms"
                  value={newProperty.bathrooms}
                  onChange={handleChange}
                  className="border border-gray-300 p-3 rounded focus:outline-none focus:ring-2 focus:ring-[#e81d2b]"
                />
                
                <input
                  type="number"
                  name="area"
                  placeholder="Area (sq ft)"
                  value={newProperty.area}
                  onChange={handleChange}
                  className="border border-gray-300 p-3 rounded focus:outline-none focus:ring-2 focus:ring-[#e81d2b]"
                />
                
                <input
                  type="text"
                  name="lotSize"
                  placeholder="Lot Size (e.g., 5000 sq ft)"
                  value={newProperty.lotSize}
                  onChange={handleChange}
                  className="border border-gray-300 p-3 rounded focus:outline-none focus:ring-2 focus:ring-[#e81d2b]"
                />
                
                <input
                  type="number"
                  name="yearBuilt"
                  placeholder="Year Built"
                  value={newProperty.yearBuilt}
                  onChange={handleChange}
                  className="border border-gray-300 p-3 rounded focus:outline-none focus:ring-2 focus:ring-[#e81d2b]"
                />
                
                <input
                  type="number"
                  name="parking"
                  placeholder="Parking Spaces"
                  value={newProperty.parking}
                  onChange={handleChange}
                  className="border border-gray-300 p-3 rounded focus:outline-none focus:ring-2 focus:ring-[#e81d2b]"
                />
                
                <input
                  type="number"
                  name="floors"
                  placeholder="Number of Floors"
                  value={newProperty.floors}
                  onChange={handleChange}
                  className="border border-gray-300 p-3 rounded focus:outline-none focus:ring-2 focus:ring-[#e81d2b]"
                />
                
                {/* Location Details */}
                <div className="md:col-span-2 mt-4">
                  <h3 className="text-lg font-semibold text-gray-700 mb-3">Location Details</h3>
                </div>
                
                <input
                  type="text"
                  name="location"
                  placeholder="Location/City *"
                  value={newProperty.location}
                  onChange={handleChange}
                  className="border border-gray-300 p-3 rounded focus:outline-none focus:ring-2 focus:ring-[#e81d2b]"
                  required
                />
                
                <input
                  type="text"
                  name="address"
                  placeholder="Street Address"
                  value={newProperty.address}
                  onChange={handleChange}
                  className="border border-gray-300 p-3 rounded focus:outline-none focus:ring-2 focus:ring-[#e81d2b]"
                />
                
                <input
                  type="text"
                  name="neighborhood"
                  placeholder="Neighborhood"
                  value={newProperty.neighborhood}
                  onChange={handleChange}
                  className="border border-gray-300 p-3 rounded focus:outline-none focus:ring-2 focus:ring-[#e81d2b]"
                />
                
                <input
                  type="text"
                  name="zipCode"
                  placeholder="Zip Code"
                  value={newProperty.zipCode}
                  onChange={handleChange}
                  className="border border-gray-300 p-3 rounded focus:outline-none focus:ring-2 focus:ring-[#e81d2b]"
                />
                
                {/* Features & Amenities */}
                <div className="md:col-span-2 mt-4">
                  <h3 className="text-lg font-semibold text-gray-700 mb-3">Features & Amenities</h3>
                </div>
                
                <div className="md:col-span-2">
                  <input
                    type="text"
                    name="features"
                    placeholder="Features (comma-separated, e.g., Hardwood Floors, Fireplace, Walk-in Closet)"
                    value={newProperty.features}
                    onChange={handleChange}
                    className="w-full border border-gray-300 p-3 rounded focus:outline-none focus:ring-2 focus:ring-[#e81d2b]"
                  />
                  <p className="text-xs text-gray-500 mt-1">Interior features of the property</p>
                </div>
                
                <div className="md:col-span-2">
                  <input
                    type="text"
                    name="amenities"
                    placeholder="Amenities (comma-separated, e.g., Pool, Gym, Security, Garden)"
                    value={newProperty.amenities}
                    onChange={handleChange}
                    className="w-full border border-gray-300 p-3 rounded focus:outline-none focus:ring-2 focus:ring-[#e81d2b]"
                  />
                  <p className="text-xs text-gray-500 mt-1">Building/community amenities</p>
                </div>
                
                {/* Images */}
                <div className="md:col-span-2 mt-4">
                  <h3 className="text-lg font-semibold text-gray-700 mb-3">Images</h3>
                </div>
                
                <div className="md:col-span-2">
                  <label className="block mb-2 text-sm font-medium text-gray-700">
                    Main Image *
                  </label>
                  <input
                    type="file"
                    name="image"
                    accept="image/*"
                    onChange={handleChange}
                    className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-[#e81d2b]"
                    required={!editingId}
                  />
                </div>
                
                <div className="md:col-span-2">
                  <label className="block mb-2 text-sm font-medium text-gray-700">
                    Additional Images (up to 10)
                  </label>
                  <input
                    type="file"
                    name="images"
                    accept="image/*"
                    multiple
                    onChange={handleChange}
                    className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-[#e81d2b]"
                  />
                </div>
                
                <div className="md:col-span-2">
                  <label className="block mb-2 text-sm font-medium text-gray-700">
                    Floor Plans (up to 5)
                  </label>
                  <input
                    type="file"
                    name="floorPlans"
                    accept="image/*"
                    multiple
                    onChange={handleChange}
                    className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-[#e81d2b]"
                  />
                </div>
                
                {/* Media Links */}
                <div className="md:col-span-2 mt-4">
                  <h3 className="text-lg font-semibold text-gray-700 mb-3">Media Links</h3>
                </div>
                
                <input
                  type="url"
                  name="virtualTour"
                  placeholder="Virtual Tour URL"
                  value={newProperty.virtualTour}
                  onChange={handleChange}
                  className="border border-gray-300 p-3 rounded focus:outline-none focus:ring-2 focus:ring-[#e81d2b] md:col-span-2"
                />
                
                <input
                  type="url"
                  name="videoUrl"
                  placeholder="Video URL"
                  value={newProperty.videoUrl}
                  onChange={handleChange}
                  className="border border-gray-300 p-3 rounded focus:outline-none focus:ring-2 focus:ring-[#e81d2b] md:col-span-2"
                />
                
                {/* Agent Information */}
                <div className="md:col-span-2 mt-4">
                  <h3 className="text-lg font-semibold text-gray-700 mb-3">Agent Information</h3>
                </div>
                
                <input
                  type="text"
                  name="agentName"
                  placeholder="Agent Name"
                  value={newProperty.agentName}
                  onChange={handleChange}
                  className="border border-gray-300 p-3 rounded focus:outline-none focus:ring-2 focus:ring-[#e81d2b]"
                />
                
                <input
                  type="email"
                  name="agentEmail"
                  placeholder="Agent Email"
                  value={newProperty.agentEmail}
                  onChange={handleChange}
                  className="border border-gray-300 p-3 rounded focus:outline-none focus:ring-2 focus:ring-[#e81d2b]"
                />
                
                <input
                  type="tel"
                  name="agentPhone"
                  placeholder="Agent Phone"
                  value={newProperty.agentPhone}
                  onChange={handleChange}
                  className="border border-gray-300 p-3 rounded focus:outline-none focus:ring-2 focus:ring-[#e81d2b]"
                />
                
                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-700">
                    Agent Photo
                  </label>
                  <input
                    type="file"
                    name="agentPhoto"
                    accept="image/*"
                    onChange={handleChange}
                    className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-[#e81d2b]"
                  />
                </div>
                
                {/* Featured */}
                <div className="md:col-span-2 mt-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      name="featured"
                      checked={newProperty.featured}
                      onChange={handleChange}
                      className="w-5 h-5 text-[#e81d2b] focus:ring-[#e81d2b]"
                    />
                    <span className="text-gray-700 font-medium">Featured Property</span>
                  </label>
                </div>
                
                {/* Submit Button */}
                <div className="md:col-span-2 flex gap-4 mt-6">
                  <button
                    type="submit"
                    disabled={isLoading}
                    className={`flex-1 text-white px-6 py-3 rounded-lg transition font-semibold ${
                      isLoading 
                        ? "bg-gray-400 cursor-not-allowed" 
                        : editingId
                        ? "bg-blue-600 hover:bg-blue-700"
                        : "bg-[#e81d2b] hover:bg-red-700"
                    }`}
                  >
                    {isLoading ? (
                      <span className="flex items-center justify-center gap-2">
                        <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                        </svg>
                        {editingId ? "Updating..." : "Adding..."}
                      </span>
                    ) : (
                      <span className="flex items-center justify-center gap-2">
                        {editingId ? (
                          <>
                            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            Update Property
                          </>
                        ) : (
                          <>
                            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                            </svg>
                            Add Property
                          </>
                        )}
                      </span>
                    )}
                  </button>
                  {editingId && (
                    <button
                      type="button"
                      onClick={cancelPropertyEdit}
                      className="px-6 bg-gray-500 text-white py-3 rounded-lg hover:bg-gray-600 transition font-semibold flex items-center gap-2"
                    >
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                      Cancel Edit
                    </button>
                  )}
                </div>
              </form>
            </div>

            {/* Property List */}
            <h2 className="text-2xl font-semibold mb-6" style={{ color: "#2c2863" }}>
              Current Properties
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
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
                        className="bg-[#2c2863] text-white px-4 py-2 rounded hover:bg-blue-800 transition flex-1 flex items-center justify-center gap-2"
                      >
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(property._id)}
                        className="bg-[#e81d2b] text-white px-4 py-2 rounded hover:bg-red-700 transition flex-1 flex items-center justify-center gap-2"
                      >
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {activeTab === "projects" && (
          <>
            {/* Edit Mode Banner */}
            {editingProjectId && (
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-l-4 border-green-500 p-4 mb-6 rounded-lg shadow-sm">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <svg className="h-6 w-6 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <h3 className="text-lg font-semibold text-green-800">
                        🏗️ Editing Project: "{editingProjectName}"
                      </h3>
                      <p className="text-sm text-green-600">
                        Make your changes below and click "Update Project" to save.
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={cancelProjectEdit}
                    className="text-green-500 hover:text-green-700 transition-colors"
                    title="Cancel editing"
                  >
                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>
            )}

            {/* Add/Edit Project Form */}
            <div 
              id="project-form"
              className={`bg-white p-6 rounded-lg shadow-md mb-10 transition-all duration-500 ${
                editingProjectId ? 'ring-2 ring-green-200 bg-gradient-to-br from-green-50/30 to-white' : ''
              }`}
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-semibold" style={{ color: "#2c2863" }}>
                  {editingProjectId ? (
                    <span className="flex items-center gap-2">
                      <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                      Edit Project
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                      </svg>
                      Add New Project
                    </span>
                  )}
                </h2>
                {editingProjectId && (
                  <div className="text-sm text-green-600 bg-green-100 px-3 py-1 rounded-full">
                    Edit Mode Active
                  </div>
                )}
              </div>
              <form onSubmit={handleAddProject} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <input
                  type="text"
                  name="name"
                  placeholder="Project Name"
                  value={newProject.name}
                  onChange={handleProjectChange}
                  className="border border-gray-300 p-3 rounded focus:outline-none focus:ring-2 focus:ring-[#e81d2b]"
                  required
                />
                <select
                  name="status"
                  value={newProject.status}
                  onChange={handleProjectChange}
                  className="border border-gray-300 p-3 rounded focus:outline-none focus:ring-2 focus:ring-[#e81d2b]"
                  required
                >
                  <option value="Upcoming">Upcoming</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Completed">Completed</option>
                </select>
                <input
                  type="text"
                  name="location"
                  placeholder="Location"
                  value={newProject.location}
                  onChange={handleProjectChange}
                  className="border border-gray-300 p-3 rounded focus:outline-none focus:ring-2 focus:ring-[#e81d2b]"
                  required
                />
                <input
                  type="number"
                  name="units"
                  placeholder="Number of Units (optional)"
                  value={newProject.units}
                  onChange={handleProjectChange}
                  className="border border-gray-300 p-3 rounded focus:outline-none focus:ring-2 focus:ring-[#e81d2b]"
                />
                <input
                  type="text"
                  name="size"
                  placeholder="Size (e.g., 50,000 sq ft)"
                  value={newProject.size}
                  onChange={handleProjectChange}
                  className="border border-gray-300 p-3 rounded focus:outline-none focus:ring-2 focus:ring-[#e81d2b]"
                />
                <input
                  type="text"
                  name="timeline"
                  placeholder="Timeline (e.g., 2024-2026)"
                  value={newProject.timeline}
                  onChange={handleProjectChange}
                  className="border border-gray-300 p-3 rounded focus:outline-none focus:ring-2 focus:ring-[#e81d2b]"
                />
                <input
                  type="text"
                  name="completionDate"
                  placeholder="Completion Date"
                  value={newProject.completionDate}
                  onChange={handleProjectChange}
                  className="border border-gray-300 p-3 rounded focus:outline-none focus:ring-2 focus:ring-[#e81d2b]"
                />
                <div className="md:col-span-2">
                  <textarea
                    name="description"
                    placeholder="Project Description"
                    value={newProject.description}
                    onChange={handleProjectChange}
                    rows="4"
                    className="w-full border border-gray-300 p-3 rounded focus:outline-none focus:ring-2 focus:ring-[#e81d2b]"
                    required
                  />
                </div>
                <div className="md:col-span-2">
                  <input
                    type="text"
                    name="amenities"
                    placeholder="Amenities (comma-separated)"
                    value={newProject.amenities}
                    onChange={handleProjectChange}
                    className="w-full border border-gray-300 p-3 rounded focus:outline-none focus:ring-2 focus:ring-[#e81d2b]"
                  />
                  <p className="text-xs text-gray-500 mt-1">Example: Swimming Pool, Gym, Parking, Security</p>
                </div>
                <div className="md:col-span-2">
                  <input
                    type="text"
                    name="features"
                    placeholder="Features (comma-separated)"
                    value={newProject.features}
                    onChange={handleProjectChange}
                    className="w-full border border-gray-300 p-3 rounded focus:outline-none focus:ring-2 focus:ring-[#e81d2b]"
                  />
                  <p className="text-xs text-gray-500 mt-1">Example: Smart Home, Solar Panels, Green Building</p>
                </div>
                <div className="md:col-span-2">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      name="featured"
                      checked={newProject.featured}
                      onChange={handleProjectChange}
                      className="w-5 h-5 text-[#e81d2b] focus:ring-[#e81d2b]"
                    />
                    <span className="text-gray-700 font-medium">Featured Project</span>
                  </label>
                </div>
                <div className="md:col-span-2">
                  <label className="block mb-2 text-sm font-medium text-gray-700">
                    Cover Image *
                  </label>
                  <input
                    type="file"
                    name="coverImage"
                    accept="image/*"
                    onChange={handleProjectChange}
                    className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-[#e81d2b]"
                    required={!editingProjectId}
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block mb-2 text-sm font-medium text-gray-700">
                    Additional Images (up to 10)
                  </label>
                  <input
                    type="file"
                    name="images"
                    accept="image/*"
                    multiple
                    onChange={handleProjectChange}
                    className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-[#e81d2b]"
                  />
                </div>
                <div className="md:col-span-2 flex gap-4">
                  <button
                    type="submit"
                    className={`flex-1 text-white py-3 rounded-lg font-semibold transition ${
                      editingProjectId
                        ? "bg-green-600 hover:bg-green-700"
                        : "bg-[#e81d2b] hover:bg-red-700"
                    }`}
                  >
                    <span className="flex items-center justify-center gap-2">
                      {editingProjectId ? (
                        <>
                          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          Update Project
                        </>
                      ) : (
                        <>
                          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                          </svg>
                          Add Project
                        </>
                      )}
                    </span>
                  </button>
                  {editingProjectId && (
                    <button
                      type="button"
                      onClick={cancelProjectEdit}
                      className="px-6 bg-gray-500 text-white py-3 rounded-lg font-semibold hover:bg-gray-600 transition flex items-center gap-2"
                    >
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                      Cancel Edit
                    </button>
                  )}
                </div>
              </form>
            </div>

            {/* Projects List */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-2xl font-semibold mb-6" style={{ color: "#2c2863" }}>
                All Projects ({allProjects.length})
              </h2>
              {allProjects.map((project) => (
                <div
                  key={project._id}
                  className="border border-gray-200 p-4 rounded-lg mb-4 hover:shadow-lg transition"
                >
                  <div className="flex flex-col md:flex-row gap-4">
                    <img
                      src={project.coverImage}
                      alt={project.name}
                      className="w-full md:w-48 h-32 object-cover rounded-lg"
                    />
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h3 className="text-xl font-bold text-[#2c2863]">{project.name}</h3>
                          <p className="text-gray-600">{project.location}</p>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                          project.status === "Completed" ? "bg-green-100 text-green-700" :
                          project.status === "In Progress" ? "bg-blue-100 text-blue-700" :
                          "bg-orange-100 text-orange-700"
                        }`}>
                          {project.status}
                        </span>
                      </div>
                      <p className="text-gray-700 text-sm mb-2 line-clamp-2">{project.description}</p>
                      <div className="flex flex-wrap gap-2 text-sm text-gray-600 mb-3">
                        {project.units && <span>🏢 {project.units} Units</span>}
                        {project.size && <span>📏 {project.size}</span>}
                        {project.featured && <span className="text-[#e81d2b] font-semibold">⭐ Featured</span>}
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEditProject(project)}
                          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition text-sm flex items-center gap-2"
                        >
                          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteProject(project._id)}
                          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition text-sm flex items-center gap-2"
                        >
                          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                          Delete
                        </button>
                      </div>
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
