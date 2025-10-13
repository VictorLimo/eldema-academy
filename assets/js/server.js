const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 487,
  secure: true,
  auth: {
    user: "gtechong72@gmail.com",
    pass: "cxjgtidcfgxlmhez",
  },
  tls: {
    rejectUnauthorized: false,
  },
});

async function main() {
  const info = await transporter.sendMail({
    from: '"George Ongoro 👻" <gtechong72@gmail.com>',
    to: "georgeongoro@gmail.com",
    subject: "Hello ✔",
    text: "Hello world?",
    html: "<b>Hello world?</b>",
  });

  console.log("Message sent: %s", info.messageId);
}

main().catch(console.error);
