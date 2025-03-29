const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');
const path = require('path'); // Import path module
require('dotenv').config(); // Load environment variables
const app = express();

// Enable CORS for all origins (you can restrict it to your frontend origin if needed)
app.use(cors());
app.use(express.json()); // Parse JSON request bodies

// Serve static files from the "weather app" directory
app.use(express.static(path.join(__dirname)));

// Handle the root route to serve index.html
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// NodeMailer setup for email transport
const transporter = nodemailer.createTransport({
    service: 'gmail', // Gmail as the email service (can be changed)
    auth: {
        user: 'lovesorout932@gmail.com', // Replace with provided email address
        pass: 'ocxt bzfh exiu lonx',     // Replace with provided email password
    },
});

// Verify the transporter configuration
transporter.verify((error, success) => {
    if (error) {
        console.error("Error verifying transporter:", error.message);
    } else {
        console.log("Transporter is ready to send emails.");
    }
});

// Endpoint to send email
app.post('/send-alert', async (req, res) => {
    const { email, message } = req.body;

    // Validate email format
    if (!email || !/^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/.test(email)) {
        return res.status(400).json({ success: false, error: 'Invalid email address' });
    }

    try {
        // Send email using NodeMailer
        const mailOptions = {
            from: `"Weather App" <lovesorout932@gmail.com>`, // Ensure proper sender format
            to: email,                                       // Receiver address
            subject: 'Weather Alert Notification',           // Subject of the email
            text: message,                                   // Body of the email
        };

        const info = await transporter.sendMail(mailOptions);

        // Respond with success and email info
        res.status(200).json({ success: true, messageId: info.messageId });
    } catch (error) {
        console.error("NodeMailer error:", error); // Log full error for debugging
        res.status(500).json({ success: false, error: 'Failed to send email. Please try again later.' });
    }
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});