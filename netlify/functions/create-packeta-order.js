exports.handler = async function(event, context) {
  try {
    console.log("Start function");
    const data = JSON.parse(event.body);
    console.log("Parsed data:", data);

    // Volání Packeta API – nahraď svou funkcí
    const response = await callPacketaAPI(data);

    console.log("Packeta response:", response);

    return {
      statusCode: 200,
      body: JSON.stringify({ success: true, data: response }),
    };

  } catch (error) {
    console.error("Error in function:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message || "Internal Server Error" }),
    };
  }
};