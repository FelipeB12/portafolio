import nodemailer from "nodemailer";

/**
 * Send an email using SMTP or a configured provider
 */
export async function sendEmail({
    to,
    subject,
    text,
    html,
}: {
    to: string;
    subject: string;
    text: string;
    html?: string;
}) {
    // Check if SMTP is configured
    const isSmtpConfigured = !!(
        process.env.SMTP_HOST &&
        process.env.SMTP_PORT &&
        process.env.SMTP_USER &&
        process.env.SMTP_PASSWORD
    );

    if (!isSmtpConfigured) {
        console.warn("⚠️ SMTP not configured. Email will only be logged to console in development.");
        if (process.env.NODE_ENV === "development") {
            console.log("---------------------------------------");
            console.log(`To: ${to}`);
            console.log(`Subject: ${subject}`);
            console.log(`Text: ${text}`);
            console.log("---------------------------------------");
            return { success: true, message: "Logged to console" };
        }
        throw new Error("Email provider not configured");
    }

    const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: parseInt(process.env.SMTP_PORT || "587"),
        secure: process.env.SMTP_PORT === "465", // true for 465, false for other ports
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASSWORD,
        },
    });

    try {
        const info = await transporter.sendMail({
            from: process.env.SMTP_FROM || `"Portfolio Contact" <${process.env.SMTP_USER}>`,
            to,
            subject,
            text,
            html: html || text,
        });

        console.log("Message sent: %s", info.messageId);
        return { success: true, messageId: info.messageId };
    } catch (error) {
        console.error("Error sending email:", error);
        throw error;
    }
}
