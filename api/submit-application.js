import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: process.env.EMAIL_SERVICE || "Gmail",
  auth: {
    user: process.env.EMAIL_USER || "gtechong72@gmail.com", 
    pass: process.env.EMAIL_PASS || "ofyrqfjtrhmtxfdp",
  },
});

export default async (req, res) => {
    if (req.method !== 'POST') {
        res.status(405).json({ success: false, message: 'Method Not Allowed' });
        return;
    }

    try {
        const formData = req.body;
        
        if (!formData.email || !formData.full_name || !formData.program_choice) {
            res.status(400).json({ success: false, message: 'Missing required form fields.' });
            return;
        }

        
        console.log('Application data received and ready for storage:', formData);

        const staffMailOptions = {
            from: process.env.EMAIL_USER,
            to: process.env.STAFF_EMAIL_RECIPIENT || 'georgeongoro9@gmail.com', // internal
            subject: `NEW VOLUNTEER APPLICATION: ${formData.full_name}`,
            html: `
                <h2>A New Volunteer Application Has Arrived!</h2>
                <p><strong>Name:</strong> ${formData.full_name}</p>
                <p><strong>Email:</strong> ${formData.email}</p>
                <p><strong>Program:</strong> ${formData.program_choice}</p>
                <p><strong>Duration:</strong> ${formData.duration} weeks</p>
                <p><strong>Motivation:</strong> ${formData.motivation.substring(0, 150)}...</p>
                <p>Log in to the admin panel to view the full details and process the placement.</p>
            `,
        };

        const volunteerMailOptions = {
            from: process.env.EMAIL_USER,
            to: formData.email,
            subject: 'Thank You for Applying to Eldema Letap Academy!',
            html: `
                <h2>Jambo ${formData.full_name.split(' ')[0]},</h2>
                <p>Thank you for submitting your application to volunteer with Eldema Letap Academy for the **${formData.program_choice}** program!</p>
                <p>We have received your details and are now reviewing your application. You will receive a **placement confirmation** and instructions for paying the registration fee within **48 hours**.</p>
                <p>We look forward to welcoming you to Kenya soon!</p>
                <br>
                <p>Best Regards,</p>
                <p>The Eldema Letap Academy Team</p>
            `,
        };
        
        await transporter.sendMail(staffMailOptions);
        await transporter.sendMail(volunteerMailOptions);

        res.status(200).json({ success: true, message: 'Application submitted and confirmation email sent!' });

    } catch (error) {
        console.error('SERVERLESS FUNCTION ERROR:', error);
        res.status(500).json({ success: false, message: 'Internal server error during form processing. Please check logs.' });
    }
};