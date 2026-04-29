import React from "react";
import { Link } from "react-router-dom";
import { MdLocationOn, MdApartment } from "react-icons/md";

const ProjectCard = ({ project }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case "Completed":
        return "bg-green-100 text-green-700";
      case "In Progress":
        return "bg-blue-100 text-blue-700";
      case "Upcoming":
        return "bg-orange-100 text-orange-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <div className="border-0 rounded-xl shadow-lg hover:shadow-2xl hover:-translate-y-3 transition-all duration-500 p-6 bg-gradient-to-br from-blue-50 to-indigo-100 relative overflow-hidden group">
      <div className="overflow-hidden rounded-lg relative">
        <img
          src={project.coverImage}
          alt={project.name}
          className="w-full h-56 object-cover rounded-lg group-hover:scale-110 transition-transform duration-500"
        />
        <div className={`absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-bold ${getStatusColor(project.status)}`}>
          {project.status}
        </div>
      </div>
      <div className="mt-4">
        <h2 className="text-2xl font-bold text-gray-800 hover:text-blue-600 transition-colors duration-200 leading-tight">
          {project.name}
        </h2>
        <div className="flex items-center mt-2">
          <MdLocationOn className="text-gray-500 mr-2" />
          <p className="text-gray-600 hover:text-gray-800 transition-colors duration-200">{project.location}</p>
        </div>
        <p className="text-gray-600 mt-3 text-sm line-clamp-2">{project.description}</p>
        {project.units && (
          <div className="flex items-center mt-2">
            <MdApartment className="text-indigo-600 mr-2 text-xl" />
            <p className="text-indigo-600 font-semibold">{project.units} Units</p>
          </div>
        )}
      </div>
      <Link
        to={`/project/${project._id}`}
        className="mt-6 inline-block w-full text-center bg-gradient-to-r from-indigo-500 to-purple-600 text-white py-3 px-6 rounded-lg hover:from-indigo-600 hover:to-purple-700 hover:shadow-lg transition-all duration-300 font-semibold"
      >
        View Project
      </Link>
    </div>
  );
};

export default ProjectCard;
