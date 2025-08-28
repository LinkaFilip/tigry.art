export default async (request, context) => {
  const nonce = crypto.randomUUID().replace(/-/g, "");
  let response = await context.next();
  response.headers.set(
    "Content-Security-Policy",
    `script-src 'self' 'nonce-${nonce}' https://js.stripe.com https://widget.packeta.com; style-src 'self' 'nonce-${nonce}' 'unsafe-hashes' 'sha256-JuQ7BshAmkqA3MmMUgoIZSLSLKYFBh9tukSaqGCrFkA=' 'sha256-T6AAKdWxO6p6GZVyzGAJDSLhOoPuuoZ6LlqMX153CvM=' 'sha256-fg7eWI6NKGc7F4Z8BQ12kLu3YHpTZgRat9GYbZDyvPM=' 'sha256-qnVkQSG7pWu17hBhIw0kCpfEB3XGvt0mNRa6+uM6OUU=' 'sha256-4b6rNDboSsZEaqN6Og63Hi0eYh3uYPNUHR1oQ8LMKoY=' 'sha256-rmNO4l4SSxtfucFsayNzWLfapzbl/2uXkL4mbZqAkiY=' 'sha256-yyKvG+1MOCo5oWMut5dCaFDe6JXHSC/pOxSjwbFSGQU=' https://js.stripe.com https://widget.packeta.com; object-src 'none'; base-uri 'self';`
  );
  if (response.headers.get("content-type")?.includes("text/html")) {
    let body = await response.text();
    body = body.replaceAll("<script", `<script nonce="${nonce}"`);
    body = body.replaceAll("<style", `<style nonce="${nonce}"`);
    body = body.replace("</head>",  `<script nonce="${nonce}">window.__nonce__ = "${nonce}";</script></head>`);
    response = new Response(body, response);
  }

  return response;
};

export const config = { path: "/*" };