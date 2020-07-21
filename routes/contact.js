const express = require("express");
const route = express.Router();
const nodemailer = require("nodemailer");

// @desc    View Contact Form
// @method  GET /contact
route.get("/", (req, res) => {
  res.render("contact");
});

// @desc    Send Contact Form
// @method  POST /contact/send
route.post("/send", async (req, res) => {
  //   HTML output string that will appear in the inbox
  const output = `
    <p>You have a new contact request!</p>
    <h3>Contact Details</h3>
    <ul>
        <li>Name: ${req.body.firstName} ${req.body.lastName}</li>
        <li>Email: ${req.body.email}</li>
    </ul>
    <h3>Message</h3>
    <p>${req.body.message}</p>
`;

  // create reusable transporter object using the default SMTP transport
  let transporter = nodemailer.createTransport({
    host: "smtp.mail.yahoo.com",
    port: 465,
    secure: true, // true for 465, false for other ports
    auth: {
      user: process.env.YAHOO_EMAIL, // generated ethereal user
      pass: process.env.YAHOO_PASSWORD, // generated ethereal password
    },
    tls: {
      rejectUnauthorized: false,
    },
  });

  // send mail with defined transport object
  try {
    let info = await transporter.sendMail(
      {
        from: `"Nodemailer Contact 🔥" ${process.env.YAHOO_EMAIL}`, // sender address
        to: "bradleycaravana@gmail.com", // list of receivers
        subject: "Node Contact Request", // Subject line
        text: "Hello world?", // plain text body
        html: output, // html body
      },
      (err) => {
        if (err) {
          console.log(err);
        } else {
          console.log("Your message has been sent!");
        }
      }
    );
  } catch (err) {
    console.log(err);
  }

  res.render("contact", {
    msg: "Your message has been sent!",
  });
});

module.exports = route;
