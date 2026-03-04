import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    const { fullName, email, whatsapp, taskType, message } = data;

    // VALIDATION: Ab sirf zaroori fields check honge
    if (!fullName || !email || !whatsapp) {
      return NextResponse.json(
        { message: "Full Name, Email, and WhatsApp are required" },
        { status: 400 }
      );
    }

    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: `"${fullName}" <${process.env.EMAIL_USER}>`, // Best practice: Use your own authenticated email
      replyTo: email, // Taake aap reply karein to user ko jaye
      to: "recipient@example.com",
      subject: `New Submission: ${taskType || "No Task Type Provided"}`,
      html: `
        <p><strong>Full Name:</strong> ${fullName}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>WhatsApp:</strong> ${whatsapp}</p>
        <p><strong>Task Type:</strong> ${taskType || "<em>Not provided</em>"}</p>
        <p><strong>Message:</strong> ${message || "<em>No message included</em>"}</p>
      `,
    });

    const response = NextResponse.json(
      { message: "Email sent successfully!" },
      { status: 200 }
    );

    response.headers.set("Access-Control-Allow-Origin", "*"); 
    response.headers.set("Access-Control-Allow-Methods", "POST, OPTIONS");
    response.headers.set("Access-Control-Allow-Headers", "Content-Type");

    return response;

  } catch (error) {
    console.error("Email Error:", error);
    return NextResponse.json(
      { message: "Failed to send email" },
      { status: 500 }
    );
  }
}

export async function OPTIONS() {
  return NextResponse.json({}, {
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  });
}