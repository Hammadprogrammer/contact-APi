"use client";
import { useState, ChangeEvent, FormEvent } from "react";

interface FormData {
  fullName: string;
  email: string;
  whatsapp: string;
  taskType: string;
  message: string;
}

export default function ContactForm() {
  const [form, setForm] = useState<FormData>({
    fullName: "",
    email: "",
    whatsapp: "",
    taskType: "", // Default empty rakhein taake backend fallback handle kare
    message: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/contact", { 
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const contentType = res.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        const data = await res.json();
        alert(data.message);
        if (res.ok) setForm({ fullName: "", email: "", whatsapp: "", taskType: "", message: "" });
      } else {
        throw new Error("Server error: Received non-JSON response.");
      }
    } catch (error: any) {
      console.error("Frontend Error:", error);
      alert(error.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3 max-w-md p-4 bg-white shadow-md rounded-lg">
      <h2 className="text-xl font-bold text-black">Contact Us</h2>
      
      {/* REQUIRED FIELDS */}
      <input
        type="text"
        name="fullName"
        placeholder="Full Name *"
        value={form.fullName}
        onChange={handleChange}
        required
        className="border p-2 rounded text-black"
      />
      
      <input
        type="email"
        name="email"
        placeholder="Email *"
        value={form.email}
        onChange={handleChange}
        required
        className="border p-2 rounded text-black"
      />
      
      <input
        type="tel"
        name="whatsapp"
        placeholder="WhatsApp Number * (e.g. +923001234567)"
        value={form.whatsapp}
        onChange={handleChange}
        pattern="[0-9+]{10,15}"
        required
        className="border p-2 rounded text-black"
      />
      
      {/* OPTIONAL FIELDS (Removed 'required' and updated logic) */}
      <select
        name="taskType"
        value={form.taskType}
        onChange={handleChange}
        className="border p-2 rounded text-black"
      >
        <option value="">Select Task Type (Optional)</option>
        <option value="Support">Support</option>
        <option value="Sales">Sales</option>
        <option value="Other">Other</option>
      </select>
      
      <textarea
        name="message"
        placeholder="Message (Optional)"
        value={form.message}
        onChange={handleChange}
        className="border p-2 rounded text-black h-32"
      />
      
      <button 
        type="submit" 
        disabled={loading}
        className={`${loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'} text-white font-semibold p-2 rounded transition-all`}
      >
        {loading ? "Sending..." : "Send Message"}
      </button>
    </form>
  );
}