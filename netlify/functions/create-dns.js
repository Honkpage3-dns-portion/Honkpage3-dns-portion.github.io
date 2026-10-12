export const handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: JSON.stringify({ error: "Method Not Allowed" }) };
  }

  try {
    const body = JSON.parse(event.body);

    // CONFIGURATION - Put your actual DNSExit details here
    const API_KEY = "H68KmL2ndhaumvRa2GlMedW7jA1WOo"; 
    const ROOT_DOMAIN = "work.gd"; // The main domain managed on DNSExit
    const MY_SUBDOMAIN = "honkpage3";   // Your parent subdomain tier

    const fullRecordName = `${body.prefix}.${MY_SUBDOMAIN}`;

    const dnsexitPayload = {
      apikey: API_KEY,
      domain: ROOT_DOMAIN,
      add: [
        {
          type: body.type,
          name: fullRecordName, 
          content: body.content
        }
      ]
    };

    const dnsExitResponse = await fetch("https://dnsexit.com", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(dnsexitPayload)
    });

    const data = await dnsExitResponse.json();

    if (data.code === 0 || data.status === "Success") {
      return { statusCode: 200, body: JSON.stringify({ success: true }) };
    } else {
      return { statusCode: 400, body: JSON.stringify({ error: data.message || "DNSExit rejected request" }) };
    }

  } catch (err) {
    return { statusCode: 500, body: JSON.stringify({ error: "Internal Server Error" }) };
  }
};
