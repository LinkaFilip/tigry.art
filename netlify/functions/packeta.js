import fetch from "node-fetch";

export async function handler(event, context) {
  const apiKey = process.env.PACKETA_API_KEY;
  const apiPassword = process.env.PACKETA_API_PASSWORD;

  if (!apiKey || !apiPassword) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "API credentials missing" }),
    };
  }
  const packetaUrl = "https://api.packeta.com/v1/branches";

  const response = await fetch(packetaUrl, {
    headers: {
      "Authorization": "Basic " + Buffer.from(`${apiKey}:${apiPassword}`).toString("base64"),
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    return {
      statusCode: response.status,
      body: JSON.stringify({ error: "Failed to fetch Packeta branches" }),
    };
  }

  const data = await response.json();

  return {
    statusCode: 200,
    body: JSON.stringify(data),
  };
}