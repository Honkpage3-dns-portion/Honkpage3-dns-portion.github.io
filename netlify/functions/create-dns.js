export const handler = async (event) => {
  if (event.httpMethod === "OPTIONS") {
    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "Content-Type",
        "Access-Control-Allow-Methods": "POST, OPTIONS"
      },
      body: ""
    };
  }

  if (event.httpMethod !== "POST") {
    return { 
      statusCode: 405, 
      body: JSON.stringify({ error: "Method Not Allowed" }) 
    };
  }

  try {
    const body = JSON.parse(event.body);

    // CONFIGURATION - Fully synced to your specific credentials
    const API_KEY = "H68KmL2ndhaumvRa2GlMedW7jA1WOo"; 
    const ROOT_DOMAIN = "work.gd"; 
    const MY_SUBDOMAIN = "honkpage3";   

    // This creates the nested record name (e.g., prefix.honkpage3)
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

    if (data.code === 0 || data.status === "Success" || data.code === "0") {
      return {
        statusCode: 200,
        headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
        body: JSON.stringify({ success: true })
      };
    } else {
      return {
        statusCode: 400,
        headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
        body: JSON.stringify({ error: data.message || "DNSExit rejected request" })
      };
    }

  } catch (err) {
    return { 
      statusCode: 500, 
      headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
      body: JSON.stringify({ error: err.message || "Internal Server Error" }) 
    };
  }
};
