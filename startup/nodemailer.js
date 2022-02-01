const nodemailer = require("nodemailer");
const config = require("config");

const transport = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: config.get("user"),
    pass: config.get("pass"),
  },
});

module.exports.sendConfirmationEmail = (name, email, confirmationCode) => {
  console.log("Sending confirmation code.....");

  transport
    .sendMail({
      from: config.get("user"),
      to: email,
      subject: "Confirm your Socialie account",
      html: `<h1>Email Confirmation</h1>
      <h2>Hello ${name}</h2>
      <p>Thank you for subscribing. Please confirm your email by clicking on the following link</p>
      <a href=http://localhost:3000/api/users/confirm/${confirmationCode}> Click here</a>
      </div>`,
    })
    .catch((err) => console.log(err));
};
