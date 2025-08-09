exports.handler = async function(event, context) {
  try {
    const data = JSON.parse(event.body);

    // Tady napiš svůj request na Packeta API, např.:
    const response = await fetch('https://www.zasilkovna.cz/api/rest', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/xml',  // nebo podle API
        'Authorization': 'Basic ...'        // nebo jiný auth, pokud je potřeba
      },
      body: `<createPacket>
               <apiPassword>tvůjApiPassword</apiPassword>
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
             </createPacket>`
    });

    if (!response.ok) {
      const text = await response.text();
      return {
        statusCode: response.status,
        body: text,
      };
    }

    const responseData = await response.text(); // nebo .json() podle API
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