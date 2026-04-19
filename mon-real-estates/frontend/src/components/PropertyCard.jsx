import React from "react";
import { Link } from "react-router-dom";
import { MdLocationOn, MdAttachMoney } from "react-icons/md";

const PropertyCard = ({ property }) => {
  return (
    <div className="border-0 rounded-xl shadow-lg hover:shadow-2xl hover:-translate-y-3 transition-all duration-500 p-6 bg-gradient-to-br from-blue-50 to-indigo-100 relative overflow-hidden group">
      <div className="overflow-hidden rounded-lg">
        <img
          src={property.image}
          alt={property.title}
          className="w-full h-56 object-cover rounded-lg group-hover:scale-110 transition-transform duration-500"
        />
      </div>
      <div className="mt-4">
        <h2 className="text-2xl font-bold text-gray-800 hover:text-blue-600 transition-colors duration-200 leading-tight">{property.title}</h2>
        <div className="flex items-center mt-2">
          <MdLocationOn className="text-gray-500 mr-2" />
          <p className="text-gray-600 hover:text-gray-800 transition-colors duration-200">{property.location}</p>
        </div>
        <div className="flex items-center mt-2">
          <MdAttachMoney className="text-green-600 mr-2 text-xl" />
          <p className="text-green-600 font-bold text-xl hover:text-green-700 transition-colors duration-200">${property.price}</p>
        </div>
      </div>
      <Link
        to={`/property/${property._id}`}
        className="mt-6 inline-block w-full text-center bg-gradient-to-r from-indigo-500 to-purple-600 text-white py-3 px-6 rounded-lg hover:from-indigo-600 hover:to-purple-700 hover:shadow-lg transition-all duration-300 font-semibold"
      >
        View Details
      </Link>
    </div>
  );
};

export default PropertyCard;
