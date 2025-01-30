import { NextResponse } from 'next/server';

export async function POST(req) {
  try {
    const body = await req.json();
    console.log('slack event', body)
    if (body.type === 'url_verification') {
      return NextResponse.json({ challenge: body.challenge });
    }

    if (body.type === 'event_callback') {
      const event = body.event;
      
      switch (event.type) {
        case 'app_mention':
          // Handle when bot is mentioned in a channel
          await handleMentionEvent(event);
          break;
        case 'message':
          // Handle direct messages to the bot
          if (event.channel_type === 'im') {
            await handleDirectMessage(event);
          }
          break;
      }
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('Slack Event Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

async function handleMentionEvent(event) {
  try {
    // Extract the actual message (remove the bot mention)
    const message = event.text.replace(/<@[A-Z0-9]+>/, '').trim();
    
    // Create interactive message to confirm task creation
    await sendTaskConfirmation(event.channel, message, event.user);
  } catch (error) {
    console.error('Mention Handler Error:', error);
  }
}

async function handleDirectMessage(event) {
  try {
    // Create interactive message to confirm task creation
    await sendTaskConfirmation(event.channel, event.text, event.user);
  } catch (error) {
    console.error('DM Handler Error:', error);
  }
}

async function sendTaskConfirmation(channel, text, user) {
  const response = await fetch('https://slack.com/api/chat.postMessage', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.SLACK_BOT_TOKEN}`
    },
    body: JSON.stringify({
      channel: channel,
      blocks: [
        {
          type: "section",
          text: {
            type: "mrkdwn",
            text: `Would you like to create a task from this message?\n\n>${text}`
          }
        },
        {
          type: "actions",
          elements: [
            {
              type: "button",
              text: {
                type: "plain_text",
                text: "Create Task"
              },
              style: "primary",
              action_id: "create_task_from_message",
              value: text
            }
          ]
        }
      ]
    })
  });

  return response.json();
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