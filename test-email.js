require('dotenv').config();

const { Resend } = require('resend');

const resend = new Resend(process.env.RESEND_API_KEY);

async function testEmail() {
    try {
        const { data, error } = await resend.emails.send({
            from: 'Backend Ledger <onboarding@resend.dev>',
            to: ['sanjeetsinghrbs@gmail.com'],
            subject: 'Backend Ledger Test Email',
            html: '<h2>Email is working!</h2><p>This is a test email from Backend Ledger.</p>',
        });

        if (error) {
            console.error("❌ Resend error:", error);
            return;
        }

        console.log("✅ Email sent successfully!");
        console.log(data);

    } catch (error) {
        console.error("❌ Error:", error);
    }
}

testEmail();