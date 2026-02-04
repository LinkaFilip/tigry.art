export default async (request, context) => {
  const allowedOrigins = [
    "https://tigry.art",
    "https://tigryart.netlify.app"
  ];

  const origin = request.headers.get("origin");
  let response = await context.next();

  if (allowedOrigins.includes(origin)) {
    response.headers.set("Access-Control-Allow-Origin", origin);
    response.headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization");
    response.headers.set("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  }

  return response;
};

export const config = { path: "/*" };