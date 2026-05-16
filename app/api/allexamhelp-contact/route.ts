import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    const { name, email, phone, message } = data;

    // VALIDATION
    if (!name || !email || !phone) {
      return NextResponse.json(
        { message: "Name, Email, and Phone are required" },
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
      "info@allexamhelp.com",
      "hammadzahid221@gmail.com",
      "zahidhammad589@gmail.com"
    ];

    await transporter.sendMail({
      from: `"${name}" <${process.env.EMAIL_USER}>`,
      replyTo: email,
      to: recipients.join(", "),
      subject: `New Inquiry from All Exam Help Contact: ${name}`,
      html: `
        <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e0e0e0; border-radius: 8px; overflow: hidden; background-color: #f9f9f9;">
          <!-- Header -->
          <div style="background-color: #007bff; padding: 25px; text-align: center;">
            <h1 style="color: #ffffff; margin: 0; font-size: 24px; letter-spacing: 1px;">ALL EXAM HELP</h1>
            <p style="color: #e0e0e0; margin: 5px 0 0 0; font-size: 14px;">New Contact Submission Received</p>
          </div>

          <!-- Main Content -->
          <div style="padding: 30px; background-color: #ffffff;">
            <p style="font-size: 16px; color: #333333; margin-top: 0;">You have received a new contact submission. Here are the details:</p>
            
            <div style="margin: 20px 0; border: 1px solid #eeeeee; border-radius: 6px; overflow: hidden;">
              <table style="width: 100%; border-collapse: collapse;">
                <tr style="background-color: #f8f9fa;">
                  <td style="padding: 12px 15px; border-bottom: 1px solid #eeeeee; font-weight: bold; color: #555555; width: 35%;">Name:</td>
                  <td style="padding: 12px 15px; border-bottom: 1px solid #eeeeee; color: #333333;">${name}</td>
                </tr>
                <tr>
                  <td style="padding: 12px 15px; border-bottom: 1px solid #eeeeee; font-weight: bold; color: #555555;">Email Address:</td>
                  <td style="padding: 12px 15px; border-bottom: 1px solid #eeeeee; color: #007bff; text-decoration: none;">${email}</td>
                </tr>
                <tr style="background-color: #f8f9fa;">
                  <td style="padding: 12px 15px; border-bottom: 1px solid #eeeeee; font-weight: bold; color: #555555;">Phone:</td>
                  <td style="padding: 12px 15px; border-bottom: 1px solid #eeeeee; color: #333333;">${phone}</td>
                </tr>
                <tr style="background-color: #ffffff;">
                  <td style="padding: 12px 15px; font-weight: bold; color: #555555; vertical-align: top;">Message:</td>
                  <td style="padding: 12px 15px; color: #333333; line-height: 1.5;">${message || "<em>No message included</em>"}</td>
                </tr>
              </table>
            </div>

            <div style="text-align: center; margin-top: 30px;">
              <a href="mailto:${email}" style="background-color: #28a745; color: #ffffff; padding: 12px 25px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block;">Reply to User</a>
            </div>
          </div>

          <!-- Footer -->
          <div style="background-color: #f1f1f1; padding: 15px; text-align: center; font-size: 12px; color: #777777;">
            <p style="margin: 0;">This email was automatically generated from the All Exam Help contact form.</p>
            <p style="margin: 5px 0 0 0;">&copy; ${new Date().getFullYear()} All Exam Help. All rights reserved.</p>
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
