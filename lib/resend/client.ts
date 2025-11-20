// lib/resend.ts
// import fetch from 'node-fetch';
const RESEND_KEY = process.env.RESEND_API_KEY!;
export async function sendReceiptEmail(to: string, subject: string, html: string) {
  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${RESEND_KEY}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      from: 'Afromerica <noreply@yourdomain.com>',
      to,
      subject,
      html
    })
  });
  if (!res.ok) {
    const text = await res.text();
    console.error('resend failed', text);
    throw new Error('Email failed');
  }
  return res.json();
}
