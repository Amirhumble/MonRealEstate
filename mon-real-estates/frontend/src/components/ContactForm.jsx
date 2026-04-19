import React, { useState } from 'react';
import { contactsAPI } from '../services/api';

function ContactForm() {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        message: ""
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitMessage, setSubmitMessage] = useState("");

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setSubmitMessage("");

        try {
            const response = await contactsAPI.create(formData);
            setSubmitMessage("✅ Message sent successfully! We'll get back to you soon.");
            setFormData({ name: "", email: "", phone: "", message: "" });
        } catch (error) {
            console.error("Error sending message:", error);
            setSubmitMessage("❌ Failed to send message. Please try again.");
        } finally {
            setIsSubmitting(false);
            setTimeout(() => setSubmitMessage(""), 5000);
        }
    };

    return (
        <div className="max-w-md mx-auto" style={{ backgroundColor: "#e8e8e8", padding: "2rem", borderRadius: "0.5rem" }}>
            <h2 className="text-2xl font-bold mb-6 text-center" style={{ color: "#2c2863" }}>
                Contact Us
            </h2>

            {submitMessage && (
                <div className={`mb-4 p-3 rounded text-center ${
                    submitMessage.includes("✅")
                        ? "bg-green-100 text-green-800 border border-green-300"
                        : "bg-red-100 text-red-800 border border-red-300"
                }`}>
                    {submitMessage}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <input
                        type="text"
                        name="name"
                        placeholder="Your Name"
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#e81d2b] focus:border-transparent transition"
                        style={{ backgroundColor: "white" }}
                        required
                    />
                </div>

                <div>
                    <input
                        type="email"
                        name="email"
                        placeholder="Your Email"
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#e81d2b] focus:border-transparent transition"
                        style={{ backgroundColor: "white" }}
                        required
                    />
                </div>

                <div>
                    <input
                        type="tel"
                        name="phone"
                        placeholder="Your Phone (Optional)"
                        value={formData.phone}
                        onChange={handleChange}
                        className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#e81d2b] focus:border-transparent transition"
                        style={{ backgroundColor: "white" }}
                    />
                </div>

                <div>
                    <textarea
                        name="message"
                        placeholder="Your Message"
                        value={formData.message}
                        onChange={handleChange}
                        className="w-full border border-gray-300 p-3 rounded-lg h-32 resize-none focus:outline-none focus:ring-2 focus:ring-[#e81d2b] focus:border-transparent transition"
                        style={{ backgroundColor: "white" }}
                        required
                    />
                </div>

                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3 px-6 rounded-lg font-semibold text-white transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg"
                    style={{ backgroundColor: "#e81d2b" }}
                    onMouseOver={(e) => e.target.style.backgroundColor = "#c01622"}
                    onMouseOut={(e) => e.target.style.backgroundColor = "#e81d2b"}
                >
                    {isSubmitting ? "Sending..." : "Send Message"}
                </button>
            </form>
        </div>
    );
}

export default ContactForm;