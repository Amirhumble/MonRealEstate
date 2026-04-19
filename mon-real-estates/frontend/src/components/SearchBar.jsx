import React from "react";
import { MdSearch } from "react-icons/md";

const SearchBar = ({ filters, setFilters }) => {
  return (
    <div className="flex flex-col md:flex-row gap-4 mb-6">
      <div className="relative w-full md:w-1/3">
        <MdSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          placeholder="Search by location..."
          value={filters.location}
          onChange={(e) => setFilters({ ...filters, location: e.target.value })}
          className="border p-2 pl-10 rounded w-full"
        />
      </div>

      <select
        value={filters.type}
        onChange={(e) => setFilters({ ...filters, type: e.target.value })}
        className="border p-2 rounded w-full md:w-1/3"
      >
        <option value="">All Types</option>
        <option value="Villa">Villa</option>
        <option value="Apartment">Apartment</option>
        <option value="Cottage">Cottage</option>
      </select>

      <input
        type="number"
        placeholder="Max Price"
        value={filters.price}
        onChange={(e) => setFilters({ ...filters, price: e.target.value })}
        className="border p-2 rounded w-full md:w-1/3"
      />
    </div>
  );
};

export default SearchBar;
