import React, { useState, useEffect } from "react";
import { projectsAPI } from "../services/api";
import { FaBuilding } from "react-icons/fa";
import ProjectCard from "../components/ProjectCard";

const projectStatuses = ["All", "Completed", "In Progress", "Upcoming"];

const Projects = () => {
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await projectsAPI.getAll();
        setProjects(res.data);
      } catch (err) {
        setError("Failed to load projects");
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, []);

  const filteredProjects = projects.filter((project) => {
    return selectedStatus === "All" || project.status === selectedStatus;
  });

  const totalProjects = projects.length;
  const filteredCount = filteredProjects.length;

  const getStatusCount = (status) => {
    if (status === "All") return totalProjects;
    return projects.filter(p => p.status === status).length;
  };

  if (loading) return <p className="text-center text-gray-500 py-12">Loading projects...</p>;
  if (error) return <p className="text-center text-red-500 py-12">{error}</p>;

  return (
    <div className="max-w-7xl mx-auto p-6 sm:p-8">
      <section className="rounded-[36px] overflow-hidden bg-gradient-to-r from-slate-900 via-purple-700 to-pink-700 text-white shadow-2xl mb-10">
        <div className="p-8 md:p-12 lg:p-16">
          <div className="md:flex md:items-center md:justify-between gap-8">
            <div className="max-w-2xl">
              <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm uppercase tracking-[0.24em] text-slate-100">
                <FaBuilding /> Building Developments
              </span>
              <h1 className="mt-6 text-4xl font-bold leading-tight sm:text-5xl">
                Discover our exceptional real estate projects across the city.
              </h1>
              <p className="mt-4 text-slate-200 text-base sm:text-lg leading-relaxed max-w-2xl">
                From completed landmarks to upcoming developments, explore our portfolio of premium building projects designed for modern living.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-2">
              <div className="rounded-3xl bg-white/10 p-6 text-center">
                <p className="text-4xl font-bold">{totalProjects}</p>
                <p className="mt-2 text-sm text-slate-200">Total Projects</p>
              </div>
              <div className="rounded-3xl bg-white/10 p-6 text-center">
                <p className="text-4xl font-bold">{filteredCount}</p>
                <p className="mt-2 text-sm text-slate-200">Showing</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="rounded-[32px] bg-white border border-slate-200 shadow-xl p-6 md:p-8 mb-10">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div>
            <h3 className="text-xl font-bold text-[#1f2b52] mb-2">Filter by Status</h3>
            <p className="text-sm text-gray-600">Browse projects based on their development stage</p>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 md:w-fit">
            {projectStatuses.map((status) => (
              <button
                key={status}
                type="button"
                onClick={() => setSelectedStatus(status)}
                className={`rounded-3xl px-5 py-3 text-sm font-semibold transition relative ${
                  selectedStatus === status
                    ? "bg-slate-900 text-white shadow-lg"
                    : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                }`}
              >
                {status}
                <span className="ml-2 text-xs opacity-75">({getStatusCount(status)})</span>
              </button>
            ))}
          </div>
        </div>
        <div className="mt-6 rounded-3xl bg-slate-50 p-4 text-sm text-slate-600 border border-slate-200">
          Showing <span className="font-semibold text-slate-900">{filteredCount}</span> of <span className="font-semibold text-slate-900">{totalProjects}</span> projects.
        </div>
      </section>

      <section>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredProjects.length > 0 ? (
            filteredProjects.map((project) => (
              <ProjectCard key={project._id} project={project} />
            ))
          ) : (
            <div className="col-span-full rounded-3xl border border-slate-200 bg-white p-10 text-center text-slate-600 shadow-sm">
              <p className="text-xl font-semibold mb-2">No projects found</p>
              <p>Try selecting a different status filter to see more projects.</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Projects;
