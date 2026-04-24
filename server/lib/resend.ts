import { Resend } from 'resend';
import dotenv from 'dotenv';

dotenv.config();

const resend = new Resend(process.env.RESEND_API_KEY || 're_dummy_key_123');
const fromEmail = 'orders@canvasbundi.in';
const adminEmail = process.env.ADMIN_EMAIL || 'sunil@canvasbundi.in';

export const sendOrderConfirmationEmail = async (orderId: string, itemsCount: number, total: number) => {
  return resend.emails.send({
    from: fromEmail,
    to: adminEmail, // Replace with actual customer email in production
    subject: `Your Canvas order is confirmed! #${orderId}`,
    html: `
      <div>
        <h2>Your Canvas Order is Confirmed!</h2>
        <p>Order ID: <strong>${orderId}</strong></p>
        <p>Items: ${itemsCount}</p>
        <p>Total amount: ₹${total}</p>
        <p>Crafted in Bundi, Rajasthan.</p>
        <p>Expect delivery in 5-7 days.</p>
      </div>
    `,
  });
};

export const sendNewOrderAlertToAdmin = async (orderId: string, amount: number, customerName: string, phone: string, itemsCount: number, address: any, paymentMethod: string) => {
  return resend.emails.send({
    from: fromEmail,
    to: adminEmail,
    subject: `New Order #${orderId} — ₹${amount}`,
    html: `
      <div>
        <h2>New Order Alert</h2>
        <p>Order ID: ${orderId}</p>
        <p>Amount: ₹${amount}</p>
        <p>Customer: ${customerName} (${phone})</p>
        <p>Items: ${itemsCount}</p>
        <p>Payment Method: ${paymentMethod}</p>
        <p>Address: ${JSON.stringify(address)}</p>
      </div>
    `,
  });
};

export const sendCustomOrderConfirmationEmail = async (customerName: string, customerEmail: string) => {
  return resend.emails.send({
    from: fromEmail,
    to: customerEmail || adminEmail,
    subject: `We received your custom order — Canvas`,
    html: `
      <div>
        <h2>Hi ${customerName},</h2>
        <p>Thank you for reaching out for a custom piece.</p>
        <p>We have received your custom order request and will contact you within 24 hours to discuss the details.</p>
        <p>Regards,<br/>Canvas Team</p>
      </div>
    `,
  });
};

export const sendCustomOrderAlertToAdmin = async (name: string, phone: string, email: string | undefined, description: string, dimensions: string | undefined) => {
  return resend.emails.send({
    from: fromEmail,
    to: adminEmail,
    subject: `New Custom Order from ${name}`,
    html: `
      <div>
        <h2>New Custom Order Request</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Phone:</strong> ${phone}</p>
        <p><strong>Email:</strong> ${email || 'N/A'}</p>
        <p><strong>Description:</strong> ${description}</p>
        <p><strong>Dimensions:</strong> ${dimensions || 'N/A'}</p>
      </div>
    `,
  });
};
