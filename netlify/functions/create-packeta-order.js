const fetch = require("node-fetch"); // pokud není v prostředí, můžeš použít native fetch v Netlify

function escapeXml(unsafe) {
  return unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

exports.handler = async function(event, context) {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  try {
    const data = JSON.parse(event.body);

    const apiPassword = process.env.PACKETA_API_PASSWORD;

    const xml = `
      <createPacket>
        <apiPassword>${escapeXml(apiPassword)}</apiPassword>
        <packetAttributes>
          <number>${escapeXml(data.number)}</number>
          <name>${escapeXml(data.name)}</name>
          <surname>${escapeXml(data.surname)}</surname>
          <email>${escapeXml(data.email)}</email>
          <phone>${escapeXml(data.phone)}</phone>
          <addressId>${escapeXml(data.addressId)}</addressId>
          <cod>${escapeXml(String(data.cod))}</cod>
          <value>${escapeXml(String(data.value))}</value>
          <weight>${escapeXml(String(data.weight))}</weight>
          <eshop>${escapeXml(data.eshop)}</eshop>
        </packetAttributes>
      </createPacket>`;

    const response = await fetch("https://api.packeta.com/v1/packets", {
      method: "POST",
      headers: {
        "Content-Type": "application/xml",
      },
      body: xml,
    });

    if (!response.ok) {
      const errorText = await response.text();
      return { statusCode: response.status, body: errorText };
    }

    const result = await response.text();

    return {
      statusCode: 200,
      body: JSON.stringify({ success: true, response: result }),
    };
  } catch (err) {
    return { statusCode: 500, body: JSON.stringify({ error: err.message }) };
  }
};
