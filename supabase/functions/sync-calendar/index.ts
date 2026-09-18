const GOOGLE_API_TIMEOUT_MS = 10_000

class RetryableTimeoutError extends Error {
  readonly retryable = true

  constructor(message: string) {
    super(message)
    this.name = 'RetryableTimeoutError'
  }
}

async function fetchGoogleWithDeadline(
  input: string,
  init: RequestInit,
  consume: (response: Response) => Promise<ResponseData>,
): Promise<ResponseData> {
  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), GOOGLE_API_TIMEOUT_MS)

  try {
    const response = await fetch(input, { ...init, signal: controller.signal })
    return await consume(response)
  } catch (error) {
    if (controller.signal.aborted) {
      throw new RetryableTimeoutError(
        `Google API request timed out after ${GOOGLE_API_TIMEOUT_MS}ms`,
      )
    }

    throw error
  } finally {
    clearTimeout(timeout)
  }
}

type ResponseData = {
  response: Response
  body?: string
  data?: { access_token?: string }
}

// Function to exchange Refresh Token for Access Token
async function getGoogleAccessToken() {
  const result = await fetchGoogleWithDeadline(
    'https://oauth2.googleapis.com/token',
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        client_id: Deno.env.get('GOOGLE_CLIENT_ID') || '',
        client_secret: Deno.env.get('GOOGLE_CLIENT_SECRET') || '',
        refresh_token: Deno.env.get('GOOGLE_REFRESH_TOKEN') || '',
        grant_type: 'refresh_token',
      }),
    },
    async (response) => {
      if (!response.ok) {
        return { response, body: await response.text() }
      }

      return { response, data: await response.json() }
    },
  )

  if (!result.response.ok) {
    throw new Error(`Auth Error: ${result.body}`)
  }

  return result.data?.access_token
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
      const eventId = String(booking.id).replace(/[^a-z0-9]/gi, '').toLowerCase();

      const event = {
        id: eventId,
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
    const calendarResult = await fetchGoogleWithDeadline(
      'https://www.googleapis.com/calendar/v3/calendars/primary/events',
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(event),
      },
      async (response) => ({
        response,
        body: response.ok ? undefined : await response.text(),
      }),
    )

      if (calendarResult.response.status === 409) {
        return new Response(JSON.stringify({ success: true, duplicate: true }), {
          headers: { 'Content-Type': 'application/json' },
        });
      }

      if (!calendarResult.response.ok) {
        throw new Error(`Calendar API Error: ${calendarResult.body}`);
      }

      return new Response(JSON.stringify({ success: true }), { 
        headers: { "Content-Type": "application/json" } 
      });
    }

    return new Response("Skipped: conditions not met", { status: 200 });

  } catch (error: any) {
    console.error('Function error:', error.message)

    if (error instanceof RetryableTimeoutError) {
      return new Response(
        JSON.stringify({ error: error.message, retryable: true }),
        {
          status: 503,
          headers: { 'Content-Type': 'application/json' },
        },
      )
    }

    return new Response(JSON.stringify({ error: error.message }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    })
  }
});
