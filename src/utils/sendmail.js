const nodemailer = require("nodemailer");

// Tạo transporter
const transporter = nodemailer.createTransport({
  host: "smtp.sendgrid.net",
  port: 587, // SendGrid SMTP sử dụng cổng 587
  auth: {
    user: "apikey", // Đối với SendGrid, username là "apikey"
    pass: process.env.SENDGRID_API_KEY, // API Key của bạn trong SendGrid
  },
});

// Hàm gửi email
async function sendTextEmailOtp(to, otp) {
  console.log("Gửi email OTP tới:", to);
  console.log("OTP:", otp);

  const mailOptions = {
    from: "phuocsanhtps@gmail.com", // Địa chỉ người gửi
    to: to, // Địa chỉ người nhận
    subject: "OTP Verification", // Tiêu đề email
    text: `Your OTP is ${otp}. Please enter it to verify your account.`, // Nội dung email dạng text
    html: `<strong>Your OTP is ${otp}. Please enter it to verify your account.</strong>`, // Nội dung email dạng HTML
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent:", info.response);
    return { success: true };
  } catch (error) {
    console.error("Error sending email:", error);
    return { success: false, error: error.message };
  }
}

module.exports = sendTextEmailOtp;
