import { NextResponse } from 'next/server';

export async function POST(req) {
  try {
    const body = await req.json();

    // Verify Slack request signature (security check)
    // TODO: Add signature verification

    // Handle Slack URL verification
    console.log('Slack Event:', body);
    if (body.type === 'url_verification') {
      return NextResponse.json({ challenge: body.challenge });
    }

    // Handle different event types
    if (body.type === 'event_callback') {
      const event = body.event;
      
      switch (event.type) {
        case 'message':
          // Handle message events
          await handleMessageEvent(event);
          break;
        case 'team_join':
          // Handle new team member events
          await handleTeamJoinEvent(event);
          break;
        // Add more event handlers as needed
      }
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('Slack Event Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

async function handleMessageEvent(event) {
  // Handle message events
  // You can add your custom logic here
  console.log('Message received:', event);
}

async function handleTeamJoinEvent(event) {
  // Handle team join events
  // You can add your custom logic here
  console.log('New team member:', event);
}