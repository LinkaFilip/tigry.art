exports.handler = async function(event, context) {
  console.log("Start function");

  // Parsuj data z requestu
  let data;
  try {
    data = JSON.parse(event.body);
  } catch(e) {
    return { statusCode: 400, body: "Invalid JSON" };
  }

  console.log("Received data:", data);

  // Tady je místo volání Packeta API
  try {
    console.log("Calling Packeta API...");
    const response = await fetch("https://api.packeta.com/v1/...", { 
      method: "POST",
      headers: {
        "Content-Type": "application/xml", 
        // další potřebné hlavičky
      },
      body: buildPacketaXML(data) // funkce na sestavení XML těla
    });
    console.log("Packeta API responded");

    if (!response.ok) {
      console.log("Packeta API error status:", response.status);
      return { statusCode: response.status, body: "Packeta API error" };
    }

    const text = await response.text();
    console.log("Packeta API response text:", text);

    // Zpracuj odpověď a vrátit výsledek
    return { statusCode: 200, body: JSON.stringify({ success: true, data: text }) };

  } catch (error) {
    console.error("Error calling Packeta API:", error);
    return { statusCode: 500, body: "Internal Server Error" };
  }
};