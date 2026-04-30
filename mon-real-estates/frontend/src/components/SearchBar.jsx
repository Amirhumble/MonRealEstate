import React from "react";
import { MdSearch } from "react-icons/md";

const SearchBar = ({ filters, setFilters }) => {
  return (
    <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-4 sm:mb-6">
      <div className="relative w-full sm:w-1/3">
        <MdSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          placeholder="Search location..."
          value={filters.location}
          onChange={(e) => setFilters({ ...filters, location: e.target.value })}
          className="border border-gray-300 p-3 pl-10 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      <select
        value={filters.type}
        onChange={(e) => setFilters({ ...filters, type: e.target.value })}
        className="border border-gray-300 p-3 rounded-lg w-full sm:w-1/3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      >
        <option value="">All Types</option>
        <option value="Villa">Villa</option>
        <option value="Apartment">Apartment</option>
        <option value="House">House</option>
        <option value="Studio">Studio</option>
        <option value="Penthouse">Penthouse</option>
      </select>

      <input
        type="number"
        placeholder="Max Price"
        value={filters.price}
        onChange={(e) => setFilters({ ...filters, price: e.target.value })}
        className="border border-gray-300 p-3 rounded-lg w-full sm:w-1/3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      />
    </div>
  );
};

export default SearchBar;
