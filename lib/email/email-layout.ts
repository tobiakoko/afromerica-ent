/**
 * Email Layout and Styles
 * Centralized email template layouts and styles to avoid duplication
 */

/**
 * Common email styles
 */
export const emailStyles = `
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif; line-height: 1.6; color: #333; background-color: #f4f4f4; }
  .container { max-width: 600px; margin: 0 auto; background: white; }
  .header { background: linear-gradient(135deg, #FF6B00 0%, #FF8C00 100%); color: white; padding: 40px 30px; text-align: center; }
  .header h1 { font-size: 28px; margin-bottom: 10px; }
  .header p { font-size: 16px; opacity: 0.9; }
  .content { padding: 40px 30px; }
  .footer { background: #1A1A1A; color: #999; padding: 30px; text-align: center; font-size: 14px; }
  .footer a { color: #FF6B00; text-decoration: none; }
  .btn { display: inline-block; padding: 15px 40px; background: #FF6B00; color: white; text-decoration: none; border-radius: 8px; font-weight: 600; margin: 20px 5px; }
  .btn:hover { background: #FF5500; }
  .btn-secondary { background: #333; }
  .btn-secondary:hover { background: #222; }
  .warning-box { background: #FFF9E6; border-left: 4px solid #FFB800; padding: 15px; margin: 20px 0; border-radius: 4px; }
  .info-box { background: #F0F9FF; border-left: 4px solid #0EA5E9; padding: 15px; margin: 20px 0; border-radius: 4px; }
  .success-box { background: #F0FDF4; border-left: 4px solid #10B981; padding: 15px; margin: 20px 0; border-radius: 4px; }
  .error-box { background: #FEF2F2; border-left: 4px solid #EF4444; padding: 15px; margin: 20px 0; border-radius: 4px; }
  @media only screen and (max-width: 600px) {
    .content { padding: 20px 15px; }
    .btn { display: block; margin: 10px 0; }
  }
`

/**
 * Email footer content
 */
export function getEmailFooter(): string {
  return `
    <div class="footer">
      <p style="margin-bottom: 10px;">
        <strong style="color: #FF6B00;">Afromerica Entertainment</strong>
      </p>
      <p style="margin-bottom: 15px;">Celebrating African Music & Culture</p>

      <div style="margin: 20px 0;">
        <a href="https://instagram.com/afromerica">Instagram</a> •
        <a href="https://twitter.com/afromerica">Twitter</a> •
        <a href="https://facebook.com/afromerica">Facebook</a>
      </div>

      <p style="font-size: 12px; margin-top: 20px;">
        © ${new Date().getFullYear()} Afromerica Entertainment. All rights reserved.
      </p>

      <p style="font-size: 12px; margin-top: 15px;">
        <a href="${process.env.NEXT_PUBLIC_BASE_URL}/terms">Terms of Service</a> •
        <a href="${process.env.NEXT_PUBLIC_BASE_URL}/privacy">Privacy Policy</a>
      </p>
    </div>
  `
}

/**
 * Email wrapper with header and footer
 */
export function createEmailLayout({
  title,
  headerTitle,
  headerSubtitle,
  content,
}: {
  title: string
  headerTitle: string
  headerSubtitle?: string
  content: string
}): string {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  <style>
    ${emailStyles}
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>${headerTitle}</h1>
      ${headerSubtitle ? `<p>${headerSubtitle}</p>` : ""}
    </div>

    <div class="content">
      ${content}
    </div>

    ${getEmailFooter()}
  </div>
</body>
</html>
  `
}

/**
 * Create a button link
 */
export function createButton(
  url: string,
  text: string,
  secondary: boolean = false
): string {
  const className = secondary ? "btn btn-secondary" : "btn"
  return `<a href="${url}" class="${className}">${text}</a>`
}

/**
 * Create a warning box
 */
export function createWarningBox(content: string): string {
  return `<div class="warning-box">${content}</div>`
}

/**
 * Create an info box
 */
export function createInfoBox(content: string): string {
  return `<div class="info-box">${content}</div>`
}

/**
 * Create a success box
 */
export function createSuccessBox(content: string): string {
  return `<div class="success-box">${content}</div>`
}

/**
 * Create an error box
 */
export function createErrorBox(content: string): string {
  return `<div class="error-box">${content}</div>`
}
