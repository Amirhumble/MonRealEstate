import React from "react";
import ContactForm from "../components/ContactForm";
import { MdPhone, MdEmail, MdLocationOn, MdDirections } from "react-icons/md";
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

      {/* Location / Find Us Section */}
      <div className="mt-16">
        <div className="text-center mb-10">
          <p className="text-sm uppercase tracking-[0.35em] text-[#e81d2b] mb-3">Find Us</p>
          <h2 className="text-4xl font-bold text-[#1f2b52] mb-4">Visit Our Office</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Located at Shimeket Commercial Center in the heart of Addis Ababa. 
            Drop by for a consultation or to discuss your real estate needs in person.
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-2 items-start">
          {/* Map Container */}
          <div className="rounded-3xl overflow-hidden shadow-2xl border border-slate-200 bg-white">
            <div className="aspect-[4/3] w-full">
              <iframe 
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d126101.86456083831!2d38.591366280386346!3d9.001263850353247!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x164b87f662a4828d%3A0xe6e7b01dc7668e06!2sShimeket%20commercial%20center!5e0!3m2!1sen!2set!4v1777386375017!5m2!1sen!2set" 
                width="100%" 
                height="100%" 
                style={{ border: 0 }} 
                allowFullScreen="" 
                loading="lazy" 
                referrerPolicy="no-referrer-when-downgrade"
                title="MonRealEstate Office Location"
                className="w-full h-full"
              />
            </div>
          </div>

          {/* Location Details */}
          <div className="space-y-6">
            {/* Address Card */}
            <div className="rounded-3xl bg-gradient-to-br from-[#2c2863] to-[#4a4494] p-8 text-white shadow-xl">
              <div className="flex items-start gap-4 mb-6">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-sm">
                  <MdLocationOn size={28} />
                </div>
                <div>
                  <h3 className="text-2xl font-bold mb-2">Our Office</h3>
                  <p className="text-white/90 text-lg leading-relaxed">
                    Shimeket Commercial Center<br />
                    Addis Ababa, Ethiopia
                  </p>
                </div>
              </div>
              
              <div className="pt-6 border-t border-white/20">
                <p className="text-sm text-white/80 mb-4">Business Hours</p>
                <div className="space-y-2 text-white/90">
                  <div className="flex justify-between">
                    <span>Monday - Friday</span>
                    <span className="font-semibold">9:00 AM - 7:00 PM</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Saturday</span>
                    <span className="font-semibold">9:00 AM - 5:00 PM</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Sunday</span>
                    <span className="font-semibold">Closed</span>
                  </div>
                </div>
              </div>

              <a
                href="https://www.google.com/maps/dir//Shimeket+commercial+center/@9.0012639,38.5913663,12z"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-6 flex items-center justify-center gap-2 rounded-full bg-[#e81d2b] hover:bg-red-700 text-white font-bold py-4 px-8 transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                <MdDirections size={24} />
                Get Directions
              </a>
            </div>

            {/* Quick Contact Cards */}
            <div className="grid grid-cols-2 gap-4">
              <a
                href="tel:+251911123456"
                className="rounded-2xl bg-white border border-slate-200 p-6 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100 text-blue-600 mb-3">
                  <MdPhone size={24} />
                </div>
                <p className="text-sm text-gray-500 mb-1">Call Us</p>
                <p className="font-semibold text-gray-900">+251 911 123 456</p>
              </a>

              <a
                href="mailto:support@monrealestate.com"
                className="rounded-2xl bg-white border border-slate-200 p-6 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600 mb-3">
                  <MdEmail size={24} />
                </div>
                <p className="text-sm text-gray-500 mb-1">Email Us</p>
                <p className="font-semibold text-gray-900 text-sm">support@monrealestate.com</p>
              </a>
            </div>

            {/* Info Box */}
            <div className="rounded-2xl bg-slate-50 border border-slate-200 p-6">
              <h4 className="font-semibold text-gray-900 mb-3">Planning to Visit?</h4>
              <p className="text-sm text-gray-600 leading-relaxed">
                We recommend scheduling an appointment to ensure one of our agents is available to assist you. 
                Walk-ins are welcome during business hours, but appointments receive priority service.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
