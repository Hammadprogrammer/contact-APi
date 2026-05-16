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

    const recipients = [
      "info@hireclassbuddy.com",
      "zahidhammad589@gmail.com",
      "faisalmcc5i@gmail.com"
    ];

    await transporter.sendMail({
      from: `"${fullName}" <${process.env.EMAIL_USER}>`, // Best practice: Use your own authenticated email
      replyTo: email, // Taake aap reply karein to user ko jaye
      to: recipients.join(", "),
      subject: `New Inquiry from Hire Class Buddy: ${taskType || "General Submission"}`,
      html: `
        <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e0e0e0; border-radius: 8px; overflow: hidden; background-color: #f9f9f9;">
          <!-- Header -->
          <div style="background-color: #004a99; padding: 25px; text-align: center;">
            <h1 style="color: #ffffff; margin: 0; font-size: 24px; letter-spacing: 1px;">HIRE CLASS BUDDY</h1>
            <p style="color: #e0e0e0; margin: 5px 0 0 0; font-size: 14px;">New Student Inquiry Received</p>
          </div>

          <!-- Main Content -->
          <div style="padding: 30px; background-color: #ffffff;">
            <p style="font-size: 16px; color: #333333; margin-top: 0;">You have received a new form submission from your website. Here are the details:</p>
            
            <div style="margin: 20px 0; border: 1px solid #eeeeee; border-radius: 6px; overflow: hidden;">
              <table style="width: 100%; border-collapse: collapse;">
                <tr style="background-color: #f8f9fa;">
                  <td style="padding: 12px 15px; border-bottom: 1px solid #eeeeee; font-weight: bold; color: #555555; width: 35%;">Full Name:</td>
                  <td style="padding: 12px 15px; border-bottom: 1px solid #eeeeee; color: #333333;">${fullName}</td>
                </tr>
                <tr>
                  <td style="padding: 12px 15px; border-bottom: 1px solid #eeeeee; font-weight: bold; color: #555555;">Email Address:</td>
                  <td style="padding: 12px 15px; border-bottom: 1px solid #eeeeee; color: #004a99; text-decoration: none;">${email}</td>
                </tr>
                <tr style="background-color: #f8f9fa;">
                  <td style="padding: 12px 15px; border-bottom: 1px solid #eeeeee; font-weight: bold; color: #555555;">WhatsApp/Phone:</td>
                  <td style="padding: 12px 15px; border-bottom: 1px solid #eeeeee; color: #333333;">${whatsapp}</td>
                </tr>
                <tr>
                  <td style="padding: 12px 15px; border-bottom: 1px solid #eeeeee; font-weight: bold; color: #555555;">Task Type:</td>
                  <td style="padding: 12px 15px; border-bottom: 1px solid #eeeeee; color: #333333;">${taskType || "<em>Not provided</em>"}</td>
                </tr>
                <tr style="background-color: #f8f9fa;">
                  <td style="padding: 12px 15px; font-weight: bold; color: #555555; vertical-align: top;">Message:</td>
                  <td style="padding: 12px 15px; color: #333333; line-height: 1.5;">${message || "<em>No message included</em>"}</td>
                </tr>
              </table>
            </div>

            <div style="text-align: center; margin-top: 30px;">
              <a href="mailto:${email}" style="background-color: #28a745; color: #ffffff; padding: 12px 25px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block;">Reply to Student</a>
            </div>
          </div>

          <!-- Footer -->
          <div style="background-color: #f1f1f1; padding: 15px; text-align: center; font-size: 12px; color: #777777;">
            <p style="margin: 0;">This email was automatically generated from the Hire Class Buddy contact form.</p>
            <p style="margin: 5px 0 0 0;">&copy; ${new Date().getFullYear()} Hire Class Buddy. All rights reserved.</p>
          </div>
        </div>
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