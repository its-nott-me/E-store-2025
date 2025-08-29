import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

export const sendEmail = async (options) => {
  const mailOptions = {
    from: `"E-Commerce Store" <${process.env.EMAIL_USER}>`,
    to: options.to,
    subject: options.subject,
    text: options.text,
    html: options.html
  };

  await transporter.sendMail(mailOptions);
};

export const sendWelcomeEmail = async (user) => {
  await sendEmail({
    to: user.email,
    subject: 'Welcome to Our Store!',
    html: `
      <h1>Welcome ${user.name}!</h1>
      <p>Thank you for joining our e-commerce store.</p>
      <p>Start shopping now and enjoy exclusive offers!</p>
      <hr>
      <p style="font-size: 0.9em; color: #888;">This is a testing email for a project. Please do not reply to this email.</p>
    `
  });
};

export const sendOrderConfirmationEmail = async (order, user) => {
  await sendEmail({
    to: user.email,
    subject: `Order Confirmation - ${order.orderNumber}`,
    html: `
      <h1>Order Confirmed!</h1>
      <p>Hi ${user.name},</p>
      <p>Your order ${order.orderNumber} has been confirmed.</p>
      <p>Total: ${(Math.round(order.total * 100) / 100).toFixed(2)}</p>
      <p>We'll send you an update when your order ships.</p>
      <hr>
      <p style="font-size: 0.9em; color: #888;">This is a testing email for a project. Please do not reply to this email.</p>
    `
  });
};