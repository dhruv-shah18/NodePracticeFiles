const nodemailer = require('nodemailer');

async function sendWelcomeEmail(toEmail, userName) {
  // Create a test account (only needed once)
  const testAccount = await nodemailer.createTestAccount();

  // Create transporter using the test SMTP service
  const transporter = nodemailer.createTransport({
    host: testAccount.smtp.host,
    port: testAccount.smtp.port,
    secure: testAccount.smtp.secure, // true for 465, false for other ports
    auth: {
      user: testAccount.user,
      pass: testAccount.pass
    }
  });

  // Email content
  const mailOptions = {
    from: `"Task Force" <${testAccount.user}>`,
    to: toEmail,
    subject: 'Welcome to Our App! Task Force helps you manage your tasks and organize your schedule.',
    text: `Hello ${userName},\n\nThanks for registering at Our App!\n\nRegards,\nTeam`,
    html: `<p>Hello <b>${userName}</b>,</p><p>Thanks for registering at <b>Our App</b>!</p><p>Regards,<br>Team</p>`
  };

  // Send email
  const info = await transporter.sendMail(mailOptions);

  console.log('Message sent: %s', info.messageId);
  console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info)); // View email here

  return info;
}

module.exports = { sendWelcomeEmail };
