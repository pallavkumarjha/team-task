import { NextResponse } from 'next/server';

export async function POST(req) {
  try {
    const formData = await req.formData();
    const command = formData.get('command');
    const text = formData.get('text');
    const userId = formData.get('user_id');
    const channelId = formData.get('channel_id');

    // Handle different commands
    console.log('slack command',command, text, userId, channelId);
    switch (command) {
      case '/task-add':
        return handleTaskCommand(text, userId, channelId);
      
      case '/tasks-list':
        return handleTasksList(userId);
      
      case '/help':
        return handleHelpCommand();
      
      default:
        return NextResponse.json({
          response_type: 'ephemeral',
          text: 'Unknown command. Try /help for available commands.'
        });
    }

  } catch (error) {
    console.error('Slack Command Error:', error);
    return NextResponse.json({
      response_type: 'ephemeral',
      text: 'Sorry, there was an error processing your command.'
    });
  }
}

async function handleTaskCommand(text, userId, channelId) {
  if (!text) {
    return NextResponse.json({
      response_type: 'ephemeral',
      text: 'Please provide a task description. Example: /task Create new project timeline'
    });
  }

  try {
    // Here you can implement the logic to create a task
    // For example, storing it in your database

    return NextResponse.json({
      response_type: 'in_channel',
      text: `New task created: ${text}`
    });
  } catch (error) {
    console.error('Task Creation Error:', error);
    return NextResponse.json({
      response_type: 'ephemeral',
      text: 'Failed to create task. Please try again.'
    });
  }
}

async function handleTasksList(userId) {
  try {
    // Implement logic to fetch user's tasks
    const tasks = []; // Replace with actual tasks fetch

    return NextResponse.json({
      response_type: 'ephemeral',
      text: tasks.length ? 
        `Your tasks:\n${tasks.join('\n')}` : 
        'You have no tasks.'
    });
  } catch (error) {
    console.error('Tasks List Error:', error);
    return NextResponse.json({
      response_type: 'ephemeral',
      text: 'Failed to fetch tasks. Please try again.'
    });
  }
}

function handleHelpCommand() {
  return NextResponse.json({
    response_type: 'ephemeral',
    text: `Available commands:
• /task [description] - Create a new task
• /tasks-list - View your tasks
• /help - Show this help message`
  });
}