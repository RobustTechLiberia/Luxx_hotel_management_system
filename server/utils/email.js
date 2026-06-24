/* eslint-disable no-undef */
const escapeHtml = (value = '') =>
  String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');

const requireOk = async (response, provider) => {
  if (response.ok) return;

  const detail = await response.text().catch(() => '');
  throw new Error(`${provider} rejected the email request: ${response.status} ${detail}`);
};

export const sendTransactionalEmail = async (env = {}, { to, subject, text, html }) => {
  if (!to || !subject || (!text && !html)) {
    throw new Error('Email recipient, subject, and body are required.');
  }

  const from = env.EMAIL_FROM || 'Luxx Hotel <onboarding@resend.dev>';
  const replyTo = env.EMAIL_REPLY_TO || undefined;

  if (env.RESEND_API_KEY) {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${env.RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from,
        to: [to],
        subject,
        text,
        html,
        reply_to: replyTo,
      }),
    });

    await requireOk(response, 'Resend');
    return { sent: true, provider: 'resend' };
  }

  if (env.SENDGRID_API_KEY) {
    const response = await fetch('https://api.sendgrid.com/v3/mail/send', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${env.SENDGRID_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        personalizations: [{ to: [{ email: to }] }],
        from: {
          email: env.SENDGRID_FROM_EMAIL || from.replace(/^.*<|>$/g, ''),
          name: env.SENDGRID_FROM_NAME || 'Luxx Hotel',
        },
        subject,
        content: [
          { type: 'text/plain', value: text || html.replace(/<[^>]+>/g, '') },
          ...(html ? [{ type: 'text/html', value: html }] : []),
        ],
      }),
    });

    await requireOk(response, 'SendGrid');
    return { sent: true, provider: 'sendgrid' };
  }

  throw new Error('No email provider is configured. Add RESEND_API_KEY or SENDGRID_API_KEY.');
};

export const buildBookingConfirmationEmail = (booking) => {
  const rows = [
    ['Booking ID', booking.bookingId || 'Pending'],
    ['Hotel', booking.hotel],
    ['Customer', booking.customer],
    ['Check-in', booking.checkIn || 'Not provided'],
    ['Check-out', booking.checkOut || 'Not provided'],
    ['Rooms', booking.rooms || 1],
    ['Suite', booking.suite || 'None'],
    ['Adults', booking.adult || 0],
    ['Children', booking.children || 0],
    ['Amount', booking.amount],
    ['Payment status', 'pending'],
    ['Booking status', 'pending'],
  ];

  const text = [
    'Thank you for booking with Luxx Hotel.',
    '',
    ...rows.map(([label, value]) => `${label}: ${value}`),
    '',
    'Your booking was received and is waiting for approval.',
  ].join('\n');

  const htmlRows = rows
    .map(
      ([label, value]) =>
        `<tr><td style="padding:8px 12px;font-weight:600;border-bottom:1px solid #eee;">${escapeHtml(label)}</td><td style="padding:8px 12px;border-bottom:1px solid #eee;">${escapeHtml(value)}</td></tr>`,
    )
    .join('');

  const html = `
    <div style="font-family:Arial,sans-serif;color:#1f2937;line-height:1.5;">
      <h2 style="margin:0 0 12px;">Luxx Hotel booking received</h2>
      <p>Thank you for booking with Luxx Hotel. Your booking details are below.</p>
      <table style="border-collapse:collapse;width:100%;max-width:640px;">${htmlRows}</table>
      <p style="margin-top:16px;">Your booking was received and is waiting for approval.</p>
    </div>
  `;

  return {
    subject: `Luxx Hotel booking details - ${booking.hotel}`,
    text,
    html,
  };
};

export const buildPasswordResetEmail = ({ code }) => ({
  subject: 'Luxx Hotel password reset code',
  text: `Your Luxx Hotel password reset verification code is ${code}. It expires in 10 minutes.`,
  html: `
    <div style="font-family:Arial,sans-serif;color:#1f2937;line-height:1.5;">
      <h2 style="margin:0 0 12px;">Password reset verification</h2>
      <p>Your Luxx Hotel verification code is:</p>
      <p style="font-size:28px;font-weight:700;letter-spacing:4px;margin:16px 0;">${escapeHtml(code)}</p>
      <p>This code expires in 10 minutes.</p>
    </div>
  `,
});
