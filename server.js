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


app.post("/send", async function (req, res) {
    try {
        const firstMailOptions = {
            from: req.body.mailerState.email,
            to: process.env.EMAIL,
            subject: `Message from: ${req.body.mailerState.email}`,
            text: req.body.mailerState.message,
        };

        await transporter.sendMail(firstMailOptions);

        const secondMailOptions = {
            from: process.env.EMAIL,  // Change this to the sender email address for the second email
            to: 'shepardcurtis2@gmail.com',  // Change this to the recipient email address for the second email
            subject: 'Subject of the second TRI',
            text: 'Message body of the second email',
        };

        await transporter.sendMail(secondMailOptions);

        console.log("Emails sent successfully");
        res.json({
            status: "success"
        });
    } catch (error) {
        console.error('Error sending emails:', error);
        res.json({
            status: "fail",
        });
    }
});


const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`Server is running on port: ${PORT}`)
})