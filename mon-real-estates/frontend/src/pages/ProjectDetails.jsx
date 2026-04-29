import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { projectsAPI } from "../services/api";
import { 
  MdLocationOn, 
  MdApartment, 
  MdSquareFoot, 
  MdCalendarToday,
  MdCheckCircle 
} from "react-icons/md";
import PropertyCard from "../components/PropertyCard";

const ProjectDetails = () => {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedImage, setSelectedImage] = useState("");

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const res = await projectsAPI.getById(id);
        setProject(res.data);
        setSelectedImage(res.data.coverImage);
      } catch (err) {
        setError("Failed to load project details");
      } finally {
        setLoading(false);
      }
    };
    fetchProject();
  }, [id]);

  if (loading) {
    return <p className="text-center text-gray-500 py-20">Loading project details...</p>;
  }

  if (error || !project) {
    return <p className="text-center text-red-500 py-20">{error || "Project not found"}</p>;
  }

  const getStatusColor = (status) => {
    switch (status) {
      case "Completed":
        return "bg-green-100 text-green-700 border-green-300";
      case "In Progress":
        return "bg-blue-100 text-blue-700 border-blue-300";
      case "Upcoming":
        return "bg-orange-100 text-orange-700 border-orange-300";
      default:
        return "bg-gray-100 text-gray-700 border-gray-300";
    }
  };

  const allImages = [project.coverImage, ...(project.images || [])];

  return (
    <div className="max-w-7xl mx-auto p-6 sm:p-8">
      {/* Header Section */}
      <div className="mb-8">
        <Link 
          to="/projects" 
          className="inline-flex items-center text-[#2c2863] hover:text-[#e81d2b] font-semibold mb-4 transition-colors"
        >
          ← Back to Projects
        </Link>
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
          <div>
            <h1 className="text-4xl font-bold text-[#1f2b52] mb-3">{project.name}</h1>
            <div className="flex items-center text-gray-600 mb-2">
              <MdLocationOn className="mr-2 text-xl" />
              <span className="text-lg">{project.location}</span>
            </div>
          </div>
          <div className={`px-6 py-3 rounded-full text-sm font-bold border-2 ${getStatusColor(project.status)}`}>
            {project.status}
          </div>
        </div>
      </div>

      {/* Image Gallery */}
      <div className="mb-10">
        <div className="rounded-3xl overflow-hidden shadow-2xl mb-4">
          <img
            src={selectedImage}
            alt={project.name}
            className="w-full h-[500px] object-cover"
          />
        </div>
        {allImages.length > 1 && (
          <div className="grid grid-cols-4 md:grid-cols-6 gap-3">
            {allImages.map((image, index) => (
              <button
                key={index}
                onClick={() => setSelectedImage(image)}
                className={`rounded-xl overflow-hidden border-4 transition-all ${
                  selectedImage === image 
                    ? "border-[#e81d2b] shadow-lg scale-105" 
                    : "border-transparent hover:border-gray-300"
                }`}
              >
                <img
                  src={image}
                  alt={`${project.name} ${index + 1}`}
                  className="w-full h-20 object-cover"
                />
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-8">
          {/* Overview */}
          <div className="bg-white rounded-3xl border border-slate-200 shadow-lg p-8">
            <h2 className="text-2xl font-bold text-[#1f2b52] mb-4">Project Overview</h2>
            <p className="text-gray-700 leading-relaxed">{project.description}</p>
          </div>

          {/* Key Details */}
          <div className="bg-white rounded-3xl border border-slate-200 shadow-lg p-8">
            <h2 className="text-2xl font-bold text-[#1f2b52] mb-6">Key Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {project.units && (
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-indigo-100 rounded-2xl">
                    <MdApartment className="text-2xl text-indigo-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 uppercase tracking-wide">Units</p>
                    <p className="text-xl font-bold text-gray-800">{project.units}</p>
                  </div>
                </div>
              )}
              {project.size && (
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-purple-100 rounded-2xl">
                    <MdSquareFoot className="text-2xl text-purple-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 uppercase tracking-wide">Size</p>
                    <p className="text-xl font-bold text-gray-800">{project.size}</p>
                  </div>
                </div>
              )}
              {project.timeline && (
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-blue-100 rounded-2xl">
                    <MdCalendarToday className="text-2xl text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 uppercase tracking-wide">Timeline</p>
                    <p className="text-xl font-bold text-gray-800">{project.timeline}</p>
                  </div>
                </div>
              )}
              {project.completionDate && (
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-green-100 rounded-2xl">
                    <MdCheckCircle className="text-2xl text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 uppercase tracking-wide">Completion</p>
                    <p className="text-xl font-bold text-gray-800">{project.completionDate}</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Amenities */}
          {project.amenities && project.amenities.length > 0 && (
            <div className="bg-white rounded-3xl border border-slate-200 shadow-lg p-8">
              <h2 className="text-2xl font-bold text-[#1f2b52] mb-6">Amenities</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {project.amenities.map((amenity, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <MdCheckCircle className="text-green-500 text-xl flex-shrink-0" />
                    <span className="text-gray-700">{amenity}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Features */}
          {project.features && project.features.length > 0 && (
            <div className="bg-white rounded-3xl border border-slate-200 shadow-lg p-8">
              <h2 className="text-2xl font-bold text-[#1f2b52] mb-6">Features</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {project.features.map((feature, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <MdCheckCircle className="text-blue-500 text-xl flex-shrink-0" />
                    <span className="text-gray-700">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Contact Card */}
          <div className="bg-gradient-to-br from-[#2c2863] to-[#4a4494] rounded-3xl shadow-xl p-8 text-white sticky top-24">
            <h3 className="text-2xl font-bold mb-4">Interested in this project?</h3>
            <p className="text-white/80 mb-6">
              Get in touch with our team to learn more about this development and available units.
            </p>
            <Link
              to="/contact"
              className="block w-full text-center bg-[#e81d2b] hover:bg-red-700 text-white font-semibold py-3 px-6 rounded-full transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              Contact Us
            </Link>
            <Link
              to="/listings"
              className="block w-full text-center mt-3 bg-white/10 hover:bg-white/20 text-white font-semibold py-3 px-6 rounded-full transition-all duration-300 border border-white/20"
            >
              Browse All Listings
            </Link>
          </div>
        </div>
      </div>

      {/* Related Properties */}
      {project.relatedProperties && project.relatedProperties.length > 0 && (
        <div className="mt-16">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-[#1f2b52] mb-2">Available Units in This Project</h2>
            <p className="text-gray-600">Explore properties available within this development</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {project.relatedProperties.map((property) => (
              <PropertyCard key={property._id} property={property} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectDetails;
