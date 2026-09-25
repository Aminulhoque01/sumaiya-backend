import { emailTransporter } from "../../config/email";

 
interface SendEmailPayload {
  to: string;
  subject: string;
  text: string;
  replyTo?: string;
}

const getFromEmail = () => {
  const from = process.env.EMAIL_FROM;

  if (!from) {
    throw new Error(
      "EMAIL_FROM is not configured"
    );
  }

  return from;
};

const sendEmail = async ({
  to,
  subject,
  text,
  replyTo,
}: SendEmailPayload) => {
  if (
    !process.env.SMTP_USER ||
    !process.env.SMTP_PASSWORD
  ) {
    throw new Error(
      "SMTP email configuration is missing"
    );
  }

  const result =
    await emailTransporter.sendMail({
      from: getFromEmail(),
      to,
      subject,
      text,
      replyTo,
    });

  return {
    messageId: result.messageId,
  };
};

const sendContactReply = async ({
  to,
  subject,
  message,
}: {
  to: string;
  subject: string;
  message: string;
}) => {
  return sendEmail({
    to,
    subject,
    text: message,
    replyTo: process.env.SMTP_USER,
  });
};

const sendNewContactNotification = async ({
  name,
  email,
  phone,
  subject,
  message,
}: {
  name: string;
  email: string;
  phone?: string;
  subject?: string;
  message: string;
}) => {
  const notificationEmail =
    process.env.CONTACT_NOTIFICATION_EMAIL;

  if (!notificationEmail) {
    return null;
  }

  const emailSubject =
    subject?.trim()
      ? `New Portfolio Message: ${subject}`
      : "New Portfolio Contact Message";

  const text = `
You have received a new message from your portfolio website.

Name: ${name}
Email: ${email}
Phone: ${phone || "Not provided"}
Subject: ${subject || "No subject"}

Message:
${message}

--------------------------------
This message was sent from your portfolio contact form.
`;

  return sendEmail({
    to: notificationEmail,
    subject: emailSubject,
    text,
    replyTo: email,
  });
};

export const emailService = {
  sendEmail,
  sendContactReply,
  sendNewContactNotification,
};