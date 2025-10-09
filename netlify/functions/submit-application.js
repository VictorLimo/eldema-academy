const nodemailer = require("nodemailer");

// Netlify Function to accept application submissions and send emails.
// Mirrors the behavior of api/submit-application.js so the project works
// on both Vercel (/api/) and Netlify (/netlify/functions/).

const createTransporter = () => {
  return nodemailer.createTransport({
    service: process.env.EMAIL_SERVICE || "Gmail",
    auth: {
      user: process.env.EMAIL_USER || "gtechong72@gmail.com",
      pass: process.env.EMAIL_PASS || "ofyrqfjtrhmtxfdp",
    },
  });
};

const defaultHeaders = {
  "Content-Type": "application/json",
  "Access-Control-Allow-Origin": process.env.ALLOWED_ORIGIN || "*",
  "Access-Control-Allow-Headers": "Content-Type",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
};

exports.handler = async function (event, context) {
  // Handle CORS preflight
  if (event.httpMethod === "OPTIONS") {
    return {
      statusCode: 200,
      headers: defaultHeaders,
      body: JSON.stringify({ success: true }),
    };
  }

  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      headers: defaultHeaders,
      body: JSON.stringify({ success: false, message: "Method Not Allowed" }),
    };
  }

  try {
    const body = event.body || "{}";
    let formData;
    try {
      formData = JSON.parse(body);
    } catch (err) {
      // If body is already an object (rare in Netlify), use it
      formData = typeof body === "object" ? body : {};
    }

    if (!formData.email || !formData.full_name || !formData.program_choice) {
      return {
        statusCode: 400,
        headers: defaultHeaders,
        body: JSON.stringify({
          success: false,
          message: "Missing required form fields.",
        }),
      };
    }

    console.log("Application data received and ready for storage:", formData);

    const transporter = createTransporter();

    const staffMailOptions = {
      from: process.env.EMAIL_USER,
      to: process.env.STAFF_EMAIL_RECIPIENT || "georgeongoro9@gmail.com",
      subject: `NEW VOLUNTEER APPLICATION: ${formData.full_name}`,
      html: `
                <h2>A New Volunteer Application Has Arrived!</h2>
                <p><strong>Name:</strong> ${formData.full_name}</p>
                <p><strong>Email:</strong> ${formData.email}</p>
                <p><strong>Program:</strong> ${formData.program_choice}</p>
                <p><strong>Duration:</strong> ${
                  formData.duration || "N/A"
                } weeks</p>
                <p><strong>Motivation:</strong> ${(formData.motivation || "")
                  .toString()
                  .substring(0, 150)}...</p>
                <p>Log in to the admin panel to view the full details and process the placement.</p>
            `,
    };

    const volunteerMailOptions = {
      from: process.env.EMAIL_USER,
      to: formData.email,
      subject: "Thank You for Applying to Eldema Letap Academy!",
      html: `
                <h2>Jambo ${formData.full_name.split(" ")[0] || ""},</h2>
                <p>Thank you for submitting your application to volunteer with Eldema Letap Academy for the <strong>${
                  formData.program_choice
                }</strong> program!</p>
                <p>We have received your details and are now reviewing your application. You will receive a <strong>placement confirmation</strong> and instructions for paying the registration fee within <strong>48 hours</strong>.</p>
                <p>We look forward to welcoming you to Kenya soon!</p>
                <br>
                <p>Best Regards,</p>
                <p>The Eldema Letap Academy Team</p>
            `,
    };

    // Send emails (send to staff first then to volunteer)
    await transporter.sendMail(staffMailOptions);
    await transporter.sendMail(volunteerMailOptions);

    return {
      statusCode: 200,
      headers: defaultHeaders,
      body: JSON.stringify({
        success: true,
        message: "Application submitted and confirmation email sent!",
      }),
    };
  } catch (error) {
    console.error("NETLIFY FUNCTION ERROR:", error);
    return {
      statusCode: 500,
      headers: defaultHeaders,
      body: JSON.stringify({
        success: false,
        message:
          "Internal server error during form processing. Please check logs.",
      }),
    };
  }
};
