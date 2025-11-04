import nodemailer from "nodemailer";
import config from "@/config/env";

const sendMail = async (mailOptions) => {
  const { from, to, subject, text = "", html = "" } = mailOptions;

  try {
    const transporter = nodemailer.createTransport({
      host: config.smtp_host,
      port: config.smtp_port,
      secure: config.smtp_port == 465, // automatically set secure
      auth: {
        user: config.email_user,
        pass: config.email_pass,
      },
    });

    const info = await transporter.sendMail({
      from,
      to,
      subject,
      text,
      html,
    });

    return info;
  } catch (error) {
    console.error(`📧 Email sending error: ${error.message}`);
    return null;
  }
};

export default sendMail;
