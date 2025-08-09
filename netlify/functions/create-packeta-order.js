exports.handler = async function(event, context) {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  try {
    const data = JSON.parse(event.body);

    const apiPassword = process.env.PACKETA_API_PASSWORD;
    if (!apiPassword) {
      console.error("Chybí PACKETA_API_PASSWORD v env proměnných");
      return { statusCode: 500, body: "Server error: Missing API password" };
    }

    const xml = `
      <createPacket>
        <apiPassword>${apiPassword}</apiPassword>
        <packetAttributes>
          <number>${data.number}</number>
          <name>${data.name}</name>
          <surname>${data.surname}</surname>
          <email>${data.email}</email>
          <phone>${data.phone}</phone>
          <addressId>${data.addressId}</addressId>
          <cod>${data.cod}</cod>
          <value>${data.value}</value>
          <weight>${data.weight}</weight>
          <eshop>${data.eshop}</eshop>
        </packetAttributes>
      </createPacket>`;

    const response = await fetch("https://api.packeta.com/v1/packets", {
      method: "POST",
      headers: { "Content-Type": "application/xml" },
      body: xml,
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Packeta API error:", errorText);
      return { statusCode: response.status, body: errorText };
    }

    const result = await response.text();

    return {
      statusCode: 200,
      body: JSON.stringify({ success: true, response: result }),
    };
  } catch (err) {
    console.error("Server error:", err);
    return { statusCode: 500, body: JSON.stringify({ error: err.message }) };
  }
};