// Function to exchange Refresh Token for Access Token
async function getGoogleAccessToken() {
  const response = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      client_id: Deno.env.get('GOOGLE_CLIENT_ID') || '',
      client_secret: Deno.env.get('GOOGLE_CLIENT_SECRET') || '',
      refresh_token: Deno.env.get('GOOGLE_REFRESH_TOKEN') || '',
      grant_type: 'refresh_token',
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Auth Error: ${errorText}`);
  }

  const data = await response.json();
  return data.access_token;
}

Deno.serve(async (req) => {
  try {
    const payload = await req.json();

    // Checking if the trigger came from the bookings table and the status changed to confirmed
    if (
      payload.type === 'UPDATE' && 
      payload.table === 'bookings' &&
      payload.record.status === 'confirmed' &&
      payload.old_record.status !== 'confirmed'
    ) {
      const booking = payload.record;
      
      // Getting a fresh token
      const accessToken = await getGoogleAccessToken();

      // Calculating the end time (for example +1 hour)
      const startDate = new Date(booking.start_time);
      const endDate = new Date(startDate.getTime() + 60 * 60000);

      const event = {
        summary: 'New appointment (Booking)',
        start: {
          dateTime: startDate.toISOString(),
          timeZone: 'Europe/Kyiv',
        },
        end: {
          dateTime: endDate.toISOString(),
          timeZone: 'Europe/Kyiv',
        },
      };

      // Sending an event to the calendar
      const calendarRes = await fetch('https://www.googleapis.com/calendar/v3/calendars/primary/events', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(event),
      });

      if (!calendarRes.ok) {
        throw new Error(`Calendar API Error: ${await calendarRes.text()}`);
      }

      return new Response(JSON.stringify({ success: true }), { 
        headers: { "Content-Type": "application/json" } 
      });
    }

    return new Response("Skipped: conditions not met", { status: 200 });

  } catch (error: any) {
    console.error("Function error:", error.message);
    return new Response(JSON.stringify({ error: error.message }), { 
      status: 400, 
      headers: { "Content-Type": "application/json" }
    });
  }
});