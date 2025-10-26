const nodemailer = require("nodemailer");
import config from '@/config/env'

const sendMail = async (mailOptions) => {
    const { From, To, Subject, content = { text: "", html: "" } } = mailOptions;
    try {
        const transporter = nodemailer.createTransport({
            host: config.smtp_host,
            port: config.smtp_port,
            secure: true, // true for 465, false for other ports
            auth: {
                user: config.email_user,
                pass: config.email_pass
            },
        });

        const info = await transporter.sendMail({
            from: From,
            to: To,
            subject: Subject,
            text: content.text, // plain‑text body
            html: content.html, // HTML body
        });

        return info;
    } catch (error) {
        console.log(`error: ${error.message}`)
        return null;
    }
};

export default sendMail;