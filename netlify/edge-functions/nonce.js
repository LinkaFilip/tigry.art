export default async (request, context) => {
  const nonce = crypto.randomUUID().replace(/-/g, "");
  let response = await context.next();
  response.headers.set(
    "Content-Security-Policy",
    `script-src 'self' 'nonce-${nonce}' https://js.stripe.com https://widget.packeta.com; style-src 'self' 'nonce-${nonce}' 'unsafe-hashes' 'sha256-rmNO4l4SSxtfucFsayNzWLfapzbl/2uXkL4mbZqAkiY=' 'sha256-yyKvG+1MOCo5oWMut5dCaFDe6JXHSC/pOxSjwbFSGQU=' https://js.stripe.com https://widget.packeta.com; object-src 'none'; base-uri 'self';`
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