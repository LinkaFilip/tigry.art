exports.handler = async function(event, context) {
  try {
    const data = JSON.parse(event.body);
    const apiPassword = process.env.PACKETA_API_PASSWORD;

    const xmlBody = `<createPacket>
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

    const response = await fetch('https://www.zasilkovna.cz/api/rest', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/xml',
      },
      body: xmlBody
    });

    if (!response.ok) {
      const text = await response.text();
      return {
        statusCode: response.status,
        body: text,
      };
    }

    const responseData = await response.text();
    return {
      statusCode: 200,
      body: JSON.stringify({ success: true, data: responseData }),
    };

  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
};
