import React, { useState, useEffect } from "react";
import { propertiesAPI } from "../services/api";
import { FaFilter } from "react-icons/fa";
import PropertyCard from "../components/PropertyCard";
import SearchBar from "../components/SearchBar";

const propertyTypes = ["Villa", "Apartment", "Studio", "House", "Penthouse"];




const Listings = () => {
  const [filters, setFilters] = useState({ location: "", type: "", price: "" });
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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

  const filteredProperties = properties.filter((property) => {
    return (
      (filters.location === "" ||
        property.location.toLowerCase().includes(filters.location.toLowerCase())) &&
      (filters.type === "" || property.type === filters.type) &&
      (filters.price === "" || property.price <= parseInt(filters.price))
    );
  });

  const totalProperties = properties.length;
  const filteredCount = filteredProperties.length;

  if (loading) return <p className="text-center text-gray-500 py-12">Loading properties...</p>;
  if (error) return <p className="text-center text-red-500 py-12">{error}</p>;

  return (
    <div className="max-w-7xl mx-auto p-6 sm:p-8">
      <section className="rounded-[36px] overflow-hidden bg-gradient-to-r from-slate-900 via-indigo-700 to-cyan-700 text-white shadow-2xl mb-10">
        <div className="p-8 md:p-12 lg:p-16">
          <div className="md:flex md:items-center md:justify-between gap-8">
            <div className="max-w-2xl">
              <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm uppercase tracking-[0.24em] text-slate-100">
                <FaFilter /> Discover Properties
              </span>
              <h1 className="mt-6 text-4xl font-bold leading-tight sm:text-5xl">
                Find your next home with premium listings and smart filters.
              </h1>
              <p className="mt-4 text-slate-200 text-base sm:text-lg leading-relaxed max-w-2xl">
                Browse verified properties, compare prices, and explore the best homes across Addis Ababa and nearby areas.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
              <div className="rounded-3xl bg-white/10 p-6 text-center">
                <p className="text-4xl font-bold">{totalProperties}</p>
                <p className="mt-2 text-sm text-slate-200">Total listings</p>
              </div>
              <div className="rounded-3xl bg-white/10 p-6 text-center">
                <p className="text-4xl font-bold">{filteredCount}</p>
                <p className="mt-2 text-sm text-slate-200">Matching results</p>
              </div>
              <div className="rounded-3xl bg-white/10 p-6 text-center">
                <p className="text-4xl font-bold">{propertyTypes.length}</p>
                <p className="mt-2 text-sm text-slate-200">Property types</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="rounded-[32px] bg-white border border-slate-200 shadow-xl p-6 md:p-8 mb-10">
        <div className="md:flex md:items-center md:justify-between gap-6">
          <div className="md:flex-1">
            <SearchBar filters={filters} setFilters={setFilters} />
          </div>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:w-fit">
            {propertyTypes.map((type) => (
              <button
                key={type}
                type="button"
                onClick={() => setFilters({ ...filters, type })}
                className={`rounded-3xl px-4 py-3 text-sm font-semibold transition ${
                  filters.type === type
                    ? "bg-slate-900 text-white shadow-lg"
                    : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                }`}
              >
                {type}
              </button>
            ))}
            <button
              type="button"
              onClick={() => setFilters({ location: "", type: "", price: "" })}
              className="rounded-3xl px-4 py-3 text-sm font-semibold text-slate-700 bg-emerald-100 hover:bg-emerald-200 transition"
            >
              Clear filters
            </button>
          </div>
        </div>
        <div className="mt-6 rounded-3xl bg-slate-50 p-4 text-sm text-slate-600 border border-slate-200">
          Showing <span className="font-semibold text-slate-900">{filteredCount}</span> of <span className="font-semibold text-slate-900">{totalProperties}</span> properties matched.
        </div>
      </section>

      <section>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredProperties.length > 0 ? (
            filteredProperties.map((property) => (
              <PropertyCard key={property._id} property={property} />
            ))
          ) : (
            <div className="rounded-3xl border border-slate-200 bg-white p-10 text-center text-slate-600 shadow-sm">
              <p className="text-xl font-semibold mb-2">No matching properties found</p>
              <p>Try adjusting your location, type, or price filters to see more options.</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Listings;
