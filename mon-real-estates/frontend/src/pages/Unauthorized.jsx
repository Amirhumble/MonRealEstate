import React from "react";
import { Link } from "react-router-dom";

const Unauthorized = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f4f4f4] px-4 py-10">
      <div className="w-full max-w-xl rounded-3xl border border-red-200 bg-white p-10 shadow-xl">
        <h1 className="text-4xl font-bold text-[#2c2863] mb-4">Access Denied</h1>
        <p className="mb-6 text-gray-600">
          You are signed in, but you don’t have permission to view this page. If you believe this is a mistake,
          please contact an administrator.
        </p>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-xl bg-[#e81d2b] px-6 py-3 text-white transition hover:bg-[#c01622]"
          >
            Return Home
          </Link>
          <Link
            to="/listings"
            className="inline-flex items-center justify-center rounded-xl border border-[#e81d2b] px-6 py-3 text-[#2c2863] transition hover:bg-[#f7d2d6]"
          >
            Browse Listings
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Unauthorized;
