import React, { useState, useEffect } from "react";
import { propertiesAPI, projectsAPI } from "../services/api";
import { Link } from "react-router-dom";
import PropertyCard from "../components/PropertyCard";
import ProjectCard from "../components/ProjectCard";
import { MdHome, MdLocationCity, MdNaturePeople } from "react-icons/md";

const categories = [
  {
    title: "Luxury Villas",
    description: "Premium homes with high-end finishes and private amenities.",
    icon: <MdHome className="text-4xl text-blue-500 mb-2" />,
  },
  {
    title: "City Apartments",
    description: "Modern apartments close to shopping, dining, and work.",
    icon: <MdLocationCity className="text-4xl text-blue-500 mb-2" />,
  },
  {
    title: "Family Houses",
    description: "Comfortable properties for growing families.",
    icon: <MdNaturePeople className="text-4xl text-blue-500 mb-2" />,
  },
];

const steps = [
  {
    title: "Browse Listings",
    description: "Explore curated properties with clear pricing and photos.",
  },
  {
    title: "Book a Tour",
    description: "Schedule viewings easily with our expert agents.",
  },
  {
    title: "Move In",
    description: "Close quickly and start enjoying your new home.",
  },
];

const testimonials = [
  {
    name: "Amanuel T.",
    quote: "The team helped us find a beautiful house in Addis with a simple and fast process.",
  },
  {
    name: "Sara M.",
    quote: "Excellent support from start to finish. The property presentation was outstanding.",
  },
  {
    name: "David B.",
    quote: "A modern, professional service that made our move stress-free.",
  },
];

const Home = () => {
  const [featuredProperties, setFeaturedProperties] = useState([]);
  const [featuredProjects, setFeaturedProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchFeaturedData = async () => {
      try {
        const [propertiesRes, projectsRes] = await Promise.all([
          propertiesAPI.getFeatured(),
          projectsAPI.getFeatured()
        ]);
        setFeaturedProperties(propertiesRes.data);
        setFeaturedProjects(projectsRes.data);
      } catch (err) {
        setError("Failed to load featured content");
      } finally {
        setLoading(false);
      }
    };
    fetchFeaturedData();
  }, []);

  if (loading) return <p className="text-center py-20 text-lg">Loading properties...</p>;
  if (error) return <p className="text-center py-20 text-red-500">{error}</p>;

  return (
    <div className="w-full">
      <section className="relative min-h-[90vh] overflow-hidden">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
        >
          <source src="/videos/bg_video1.mp4" type="video/mp4" />
        </video>

        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/10 to-black/80" />

        <div className="relative z-10 flex min-h-[90vh] flex-col items-center justify-center text-center px-6 py-20 text-white">
          <div className="max-w-4xl">
            <p className="mb-4 inline-flex rounded-full bg-white/10 px-4 py-2 text-sm uppercase tracking-[0.3em] text-white/80">
              Discover exceptional living
            </p>
            <h1 className="text-5xl md:text-6xl font-black leading-tight mb-6" style={{ fontFamily: "Montserrat, sans-serif" }}>
              Live better in Addis with modern homes and seamless service.
            </h1>
            <p className="mx-auto mb-8 max-w-2xl text-lg text-white/80">
              Browse curated listings, get expert guidance, and move into a home that fits your lifestyle.
            </p>
            <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
              <Link
                to="/listings"
                className="inline-flex items-center justify-center rounded-full bg-[#e81d2b] px-8 py-3 text-sm font-semibold uppercase tracking-wide transition hover:bg-red-700"
              >
                Browse Listings
              </Link>
              <Link
                to="/contact"
                className="inline-flex items-center justify-center rounded-full border border-white/25 bg-white/10 px-8 py-3 text-sm font-semibold uppercase tracking-wide text-white transition hover:bg-white/15"
              >
                Talk to an agent
              </Link>
            </div>
          </div>

          <div className="mt-16 grid gap-4 sm:grid-cols-3">
            <div className="rounded-3xl border border-white/10 bg-white/10 p-5 backdrop-blur-sm">
              <p className="text-3xl">🏡</p>
              <p className="mt-4 text-xl font-semibold">250+ listings</p>
              <p className="mt-2 text-sm text-white/80">A wide selection of homes for every budget.</p>
            </div>
            <div className="rounded-3xl border border-white/10 bg-white/10 p-5 backdrop-blur-sm">
              <p className="text-3xl">🗝️</p>
              <p className="mt-4 text-xl font-semibold">Fast closings</p>
              <p className="mt-2 text-sm text-white/80">Move into your new home with confidence and speed.</p>
            </div>
            <div className="rounded-3xl border border-white/10 bg-white/10 p-5 backdrop-blur-sm">
              <p className="text-3xl">🤝</p>
              <p className="mt-4 text-xl font-semibold">Trusted experts</p>
              <p className="mt-2 text-sm text-white/80">Local knowledge, friendly support, and tailored advice.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-slate-50 py-16">
        <div className="max-w-6xl mx-auto px-6">
          <div className="mb-12 text-center">
            <p className="text-sm uppercase tracking-[0.35em] text-[#e81d2b]">Featured Collection</p>
            <h2 className="mt-4 text-4xl font-bold text-[#1f2b52]">Handpicked properties you’ll love</h2>
            <p className="mx-auto mt-3 max-w-2xl text-gray-600">
              Explore our latest listings with premium features, beautiful finishes, and great locations around the city.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {featuredProperties.map((property) => (
              <PropertyCard key={property._id} property={property} />
            ))}
          </div>

          <div className="mt-10 text-center">
            <Link
              to="/listings"
              className="inline-flex rounded-full bg-[#2c2863] px-10 py-3 text-sm font-semibold tracking-wide text-white transition hover:bg-[#1c1a42]"
            >
              See all listings
            </Link>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-6xl mx-auto px-6">
          <div className="mb-12 text-center">
            <p className="text-sm uppercase tracking-[0.35em] text-[#e81d2b]">Building Developments</p>
            <h2 className="mt-4 text-4xl font-bold text-[#1f2b52]">Featured Projects</h2>
            <p className="mx-auto mt-3 max-w-2xl text-gray-600">
              Discover our exceptional real estate developments from completed landmarks to upcoming projects designed for modern living.
            </p>
          </div>

          {featuredProjects.length > 0 ? (
            <>
              <div className="grid gap-6 md:grid-cols-3">
                {featuredProjects.map((project) => (
                  <ProjectCard key={project._id} project={project} />
                ))}
              </div>

              <div className="mt-10 text-center">
                <Link
                  to="/projects"
                  className="inline-flex rounded-full bg-[#2c2863] px-10 py-3 text-sm font-semibold tracking-wide text-white transition hover:bg-[#1c1a42]"
                >
                  View all projects
                </Link>
              </div>
            </>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500 mb-6">No featured projects available at the moment.</p>
              <Link
                to="/projects"
                className="inline-flex rounded-full bg-[#2c2863] px-10 py-3 text-sm font-semibold tracking-wide text-white transition hover:bg-[#1c1a42]"
              >
                Browse all projects
              </Link>
            </div>
          )}
        </div>
      </section>

      <section className="py-16 bg-slate-50">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
            <div>
              <p className="text-sm uppercase tracking-[0.35em] text-[#e81d2b]">Why choose us</p>
              <h2 className="mt-4 text-4xl font-bold text-[#1f2b52]">A seamless experience from search to move-in.</h2>
              <p className="mt-4 max-w-xl text-gray-600">
                Our team combines local market expertise with modern tools to help you discover homes faster and negotiate smarter.
              </p>
              <div className="mt-8 grid gap-4 sm:grid-cols-2">
                <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                  <h3 className="text-xl font-semibold">Verified listings</h3>
                  <p className="mt-2 text-sm text-gray-600">Every property is vetted for quality and accuracy.</p>
                </div>
                <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                  <h3 className="text-xl font-semibold">Personalized support</h3>
                  <p className="mt-2 text-sm text-gray-600">Guidance from agents who know Addis inside out.</p>
                </div>
              </div>
            </div>
            <div className="space-y-4">
              {categories.map((item) => (
                <div key={item.title} className="rounded-3xl border border-slate-200 bg-[#f8fafc] p-6 shadow-sm">
                  <div className="text-3xl">{item.icon}</div>
                  <h3 className="mt-4 text-2xl font-semibold text-[#1f2b52]">{item.title}</h3>
                  <p className="mt-2 text-sm text-gray-600">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[#2c2863] py-16 text-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid gap-10 lg:grid-cols-3">
            {steps.map((step, index) => (
              <div key={step.title} className="rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-sm">
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-[#e81d2b]/10 text-xl font-bold text-[#e81d2b]">
                  {index + 1}
                </div>
                <h3 className="text-2xl font-bold">{step.title}</h3>
                <p className="mt-3 text-gray-200">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-slate-50">
        <div className="max-w-6xl mx-auto px-6">
          <div className="mb-12 text-center">
            <p className="text-sm uppercase tracking-[0.35em] text-[#e81d2b]">Testimonials</p>
            <h2 className="mt-4 text-4xl font-bold text-[#1f2b52]">Happy clients, real stories</h2>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {testimonials.map((testimonial) => (
              <div key={testimonial.name} className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
                <p className="text-lg text-gray-700">“{testimonial.quote}”</p>
                <p className="mt-6 font-semibold text-[#1f2b52]">{testimonial.name}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#1f2b52] py-16 text-white">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <p className="text-sm uppercase tracking-[0.35em] text-[#f6f7fb]">Start your journey</p>
          <h2 className="mt-4 text-4xl font-bold">Ready to make a move?</h2>
          <p className="mx-auto mt-4 max-w-2xl text-gray-200">
            Whether you’re searching for a luxury villa or a family home, our team is ready to help you every step of the way.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              to="/listings"
              className="inline-flex rounded-full bg-[#e81d2b] px-10 py-3 text-sm font-semibold uppercase tracking-wide transition hover:bg-red-700"
            >
              See listings
            </Link>
            <Link
              to="/contact"
              className="inline-flex rounded-full border border-white/25 bg-white/10 px-10 py-3 text-sm font-semibold uppercase tracking-wide text-white transition hover:bg-white/15"
            >
              Contact us
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
