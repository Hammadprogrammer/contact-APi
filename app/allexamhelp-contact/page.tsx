"use client";
import { useState, ChangeEvent, FormEvent } from "react";

interface FormData {
  name: string;
  email: string;
  phone: string;
  message: string;
}

export default function AllExamHelpContact() {
  const [form, setForm] = useState<FormData>({
    name: "",
    email: "",
    phone: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/allexamhelp-contact", { 
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const contentType = res.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        const data = await res.json();
        alert(data.message);
        if (res.ok) setForm({ name: "", email: "", phone: "", message: "" });
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
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-full max-w-md p-8 bg-white shadow-xl rounded-2xl">
        <div className="text-center mb-4">
          <h1 className="text-3xl font-extrabold text-blue-600">All Exam Help</h1>
          <p className="text-gray-500">Contact Us</p>
        </div>
        
        <div className="flex flex-col gap-1">
          <label className="text-sm font-semibold text-gray-700 ml-1">Name</label>
          <input
            type="text"
            name="name"
            placeholder="Your Name"
            value={form.name}
            onChange={handleChange}
            required
            className="border border-gray-300 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-black transition-all"
          />
        </div>
        
        <div className="flex flex-col gap-1">
          <label className="text-sm font-semibold text-gray-700 ml-1">Email</label>
          <input
            type="email"
            name="email"
            placeholder="Your Email"
            value={form.email}
            onChange={handleChange}
            required
            className="border border-gray-300 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-black transition-all"
          />
        </div>
        
        <div className="flex flex-col gap-1">
          <label className="text-sm font-semibold text-gray-700 ml-1">Phone</label>
          <input
            type="tel"
            name="phone"
            placeholder="Your Phone Number"
            value={form.phone}
            onChange={handleChange}
            required
            className="border border-gray-300 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-black transition-all"
          />
        </div>
        
        <div className="flex flex-col gap-1">
          <label className="text-sm font-semibold text-gray-700 ml-1">Message</label>
          <textarea
            name="message"
            placeholder="How can we help you?"
            value={form.message}
            onChange={handleChange}
            className="border border-gray-300 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-black h-32 transition-all resize-none"
          />
        </div>
        
        <button 
          type="submit" 
          disabled={loading}
          className={`${loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 active:scale-95'} text-white font-bold py-3 rounded-xl transition-all shadow-lg mt-2`}
        >
          {loading ? "Sending..." : "Send Message"}
        </button>
      </form>
    </div>
  );
}
