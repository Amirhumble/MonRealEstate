import React from "react";
import ContactForm from "../components/ContactForm";
import { MdPhone, MdEmail, MdLocationOn } from "react-icons/md";
import { FaFacebookF, FaInstagram, FaLinkedinIn, FaWhatsapp } from "react-icons/fa";

const Contact = () => {
  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-4xl font-bold mb-8 text-center text-[#2c2863]">Contact Us</h1>

      <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr] items-start">
        <div className="rounded-[32px] bg-gradient-to-br from-blue-50 via-white to-indigo-50 border border-white shadow-xl p-8 md:p-10">
          <p className="text-gray-700 text-lg leading-relaxed">
            Have questions about a property or want to book a viewing? Reach out to our team anytime using the details below.
            We’re here to help you find your perfect home in Addis Ababa and beyond.
          </p>

          <div className="mt-10 space-y-6">
            <div className="rounded-3xl bg-white p-5 shadow-sm border border-slate-200">
              <div className="flex items-center gap-3 text-[#2c2863] mb-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-100 text-blue-600">
                  <MdPhone size={22} />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Call Us</p>
                  <p className="text-lg font-semibold">+251 911 123 456</p>
                  <p className="text-sm text-gray-600">+251 911 654 321</p>
                </div>
              </div>
              <a href="tel:+251911123456" className="text-sm text-blue-600 hover:text-blue-700 transition">
                Call primary number
              </a>
            </div>

            <div className="rounded-3xl bg-white p-5 shadow-sm border border-slate-200">
              <div className="flex items-center gap-3 text-[#2c2863] mb-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-600">
                  <MdEmail size={22} />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Email Us</p>
                  <p className="text-lg font-semibold">support@monrealestate.com</p>
                </div>
              </div>
              <a href="mailto:support@monrealestate.com" className="text-sm text-blue-600 hover:text-blue-700 transition">
                Send us an email
              </a>
            </div>

            <div className="rounded-3xl bg-white p-5 shadow-sm border border-slate-200">
              <div className="flex items-center gap-3 text-[#2c2863] mb-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-violet-100 text-violet-600">
                  <MdLocationOn size={22} />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Visit Our Office</p>
                  <p className="text-lg font-semibold">Kazanchis, Addis Ababa</p>
                </div>
              </div>
              <p className="text-sm text-gray-600">Open Monday to Saturday, 9:00 AM - 7:00 PM</p>
            </div>
          </div>

          <div className="mt-10">
            <h2 className="text-2xl font-semibold text-[#2c2863]">Follow us</h2>
            <p className="mt-2 text-gray-600">Stay connected for new listings, updates, and property tips.</p>

            <div className="mt-5 flex flex-wrap gap-3">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-blue-50"
              >
                <FaFacebookF className="text-blue-600" />
                Facebook
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-pink-50"
              >
                <FaInstagram className="text-pink-500" />
                Instagram
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-100"
              >
                <FaLinkedinIn className="text-sky-600" />
                LinkedIn
              </a>
              <a
                href="https://wa.me/251911123456"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-emerald-50"
              >
                <FaWhatsapp className="text-emerald-600" />
                WhatsApp
              </a>
            </div>
          </div>
        </div>

        <div>
          <ContactForm />
        </div>
      </div>
    </div>
  );
};

export default Contact;
