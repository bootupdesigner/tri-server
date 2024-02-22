const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');
require('dotenv').config();

const app = express();

// middlewares
app.use(express.json());
app.use(cors());


app.get('/', (req, res) => {
    res.send('Hello, World!');
});


let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL,
        pass: process.env.WORD,
        clientId: process.env.OAUTH_CLIENTID,
        clientSecret: process.env.OAUTH_CLIENT_SECRET,
        refreshToken: process.env.OAUTH_REFRESH_TOKEN,

    }
});

transporter.verify((err, success) => {
    err
        ? console.log(err)
        : console.log(`=== Server is ready to take messages: ${success} ===`);
});


app.post("/send", function (req, res) {
    const { name, email, message } = req.body.mailerState;

    if (!name || !email || !message) {
        return res.status(400).json({ error: 'Name, email, and message are required.' });
    }

    const mailOptions = {
        from: req.body.mailerState.email,
        to: process.env.EMAIL,
        subject: `Message from: ${req.body.mailerState.email}`,
        text: req.body.mailerState.message,
    };

    transporter.sendMail(mailOptions, function (err, data) {
        if (err) {
            return res.status(500).json({ status: "fail", error: err.message });
        } else {
            console.log("Email sent successfully");
            return res.status(200).json({ status: "success" });
        }
    });
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`Server is running on port: ${PORT}`)
})