// src/pages/PropertyDetails.jsx
import React, {useState, useEffect} from "react";
import { useParams } from "react-router-dom";
import { propertiesAPI } from "../services/api";


const PropertyDetails = () => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { id } = useParams();

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const res = await propertiesAPI.getAll();
        setProperties(res.data);
      } catch (err) {
        setError("Failed to load properties");
      } finally {
        setLoading(false);
      }
    };
    fetchProperties();
  }, []);

  if (loading) return <p>Loading properties...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  const property = properties.find((p) => p._id.toString() === id);
  




  if (!property) {
    return <p className="p-6 text-red-600">Property not found.{id}</p>;
  }

  return (
    <div className="max-w-3xl mx-auto p-6">
      <img
        src={property.image}
        alt={property.title}
        className="w-full h-64 object-cover rounded mb-6"
      />
      <h1 className="text-3xl font-bold mb-2">{property.title}</h1>
      <p className="text-gray-600 mb-2">{property.location}</p>
      <p className="text-blue-600 font-semibold mb-2">${property.price}</p>
      <p className="text-sm text-gray-500 mb-4">{property.type}</p>
      <p className="mb-6">{property.description}</p>

      <button className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700">
        Contact Agent
      </button>
    </div>
  );
};

export default PropertyDetails;
