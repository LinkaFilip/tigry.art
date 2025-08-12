export default async (request, context) => {
  const nonce = crypto.randomUUID().replace(/-/g, "");
  let response = await context.next();
  response.headers.set(
    "Content-Security-Policy",
    `script-src 'self' 'nonce-${nonce}'; style-src 'self' 'nonce-${nonce}'; object-src 'none'; base-uri 'self';`
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