require('dotenv').config();
const { Resend } = require('resend');

const resend = new Resend(process.env.RESEND_API_KEY);



// Function to send email
const sendEmail = async (to, subject, text, html) => {
    try {
        const { data, error } = await resend.emails.send({
            from: 'Backend Ledger <onboarding@resend.dev>',
            to: [to],
            subject,
            text,
            html,
        });

        if (error) {
            console.error("❌ Resend email error:", error);
            throw error;
        }

        console.log("✅ Email sent successfully:", data);

        return data;

    } catch (error) {
        console.error("❌ Email sending failed:", error);
        throw error;
    }
};

async function sendRegistrationEmail(userEmail, name) {
  const subject = "Welcome to Backend Ledger";
  const text = `Hello ${name},\n\nThank you for registering at Backend Ledger.
    We are excited to have you on board!\n\nBest regards,\nThe Backend Ledger team`;
  const html = `<p>Hello ${name},</p><p>Thank you for registering at Backend Ledger.
    We are excited to have you on board!</p><p>Best regards,<br>The Backend Ledger team</p>`;

  await sendEmail(userEmail, subject, text, html)
}

async function sendTransactionEmail(userEmail, name, amount, toAccount) {
  const subject = "Transaction Successfull..!!!";
  const text = `Hello ${name},\n\nYour transaction of $${amount} to account ${toAccount} was successfull..!!!.\n\nBest Regards,\nThe Backend Ladger Team`;
  const html = `<p>Hello ${name}, </p><p> Your transaction of amount $${amount} to account ${toAccount} was successfull.</p><p>Best regards,<br> The Backend Ledger team.</p>`
  await sendEmail(userEmail, subject, text, html);
}

async function sendTransactionFailureEmail(userEmail, name, amount, toAccount) {
  const subject = "Transaction Failed..!!!";
  const text = `Hello ${name},\n\nYour transaction of $${amount} to account ${toAccount} was Failed..!!!.\n\nBest Regards,\nThe Backend Ladger Team`;
  const html = `<p>Hello ${name}, </p><p> Your transaction of amount ${amount} to account ${toAccount} was Failed.</p><p>Best regards,<br> The Backend Ledger team.</p>`
  await sendEmail(userEmail, subject, text, html);
}
async function sendPasswordResetEmail(userEmail, name, resetUrl) {

  const subject = "Reset Your Backend Ledger Password";

  const text = `Hello ${name}

We received a request to reset your Backend Ledger password.

Click the link below to reset your password:

${resetUrl}

This link will expire in 15 minutes.

If you did not request a password reset, you can safely ignore this email.

Best regards,
The Backend Ledger Team`;

  const html = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto;">

            <h2 style="color: #2563eb;">
                Backend Ledger
            </h2>

            <p>Hello ${name},</p>

            <p>
                We received a request to reset your Backend Ledger password.
            </p>

            <p>
                Click the button below to create a new password:
            </p>

            <a
                href="${resetUrl}"
                style="
                    display: inline-block;
                    padding: 12px 24px;
                    background-color: #2563eb;
                    color: white;
                    text-decoration: none;
                    border-radius: 8px;
                    font-weight: bold;
                "
            >
                Reset Password
            </a>

            <p>
                This link will expire in <strong>15 minutes</strong>.
            </p>

            <p>
                If you did not request a password reset,
                you can safely ignore this email.
            </p>

            <p>
                Best regards,<br>
                The Backend Ledger Team
            </p>

        </div>
    `;

  await sendEmail(
    userEmail,
    subject,
    text,
    html
  );
}

module.exports = {
  sendRegistrationEmail,
  sendTransactionEmail,
  sendTransactionFailureEmail,
  sendPasswordResetEmail
}