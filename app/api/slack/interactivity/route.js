import { NextResponse } from 'next/server';

export async function POST(req) {
  try {
    const formData = await req.formData();
    const payload = JSON.parse(formData.get('payload'));

    switch (payload.type) {
      case 'block_actions':
        return handleBlockActions(payload);
      
      case 'view_submission':
        return handleViewSubmission(payload);
      
      case 'message_action':
        return handleMessageAction(payload);
      
      default:
        return NextResponse.json({
          response_type: 'ephemeral',
          text: 'Unsupported interaction type'
        });
    }
  } catch (error) {
    console.error('Slack Interaction Error:', error);
    return NextResponse.json({
      response_type: 'ephemeral',
      text: 'Sorry, there was an error processing your interaction.'
    });
  }
}

async function handleBlockActions(payload) {
  const { actions, user, response_url } = payload;
  const action = actions[0];

  switch (action.action_id) {
    case 'complete_task':
      return handleCompleteTask(action.value, user.id, response_url);
    
    case 'delete_task':
      return handleDeleteTask(action.value, user.id, response_url);
    
    case 'edit_task':
      return openEditTaskModal(action.value, user.id);
  }

  return NextResponse.json({ text: 'Action processed' });
}

async function handleViewSubmission(payload) {
  const { view, user } = payload;

  switch (view.callback_id) {
    case 'edit_task_modal':
      return handleEditTaskSubmission(view.state.values, user.id);
    
    case 'create_task_modal':
      return handleCreateTaskSubmission(view.state.values, user.id);
  }

  return NextResponse.json({ text: 'View submission processed' });
}

async function handleMessageAction(payload) {
  const { callback_id, user, message } = payload;

  switch (callback_id) {
    case 'convert_to_task':
      return convertMessageToTask(message.text, user.id);
  }

  return NextResponse.json({ text: 'Message action processed' });
}

// Helper functions for specific actions
async function handleCompleteTask(taskId, userId, responseUrl) {
  try {
    // Implement task completion logic here
    return NextResponse.json({
      text: 'Task marked as complete',
      replace_original: true
    });
  } catch (error) {
    console.error('Complete Task Error:', error);
    return NextResponse.json({
      text: 'Failed to complete task',
      replace_original: false
    });
  }
}

async function handleDeleteTask(taskId, userId, responseUrl) {
  try {
    // Implement task deletion logic here
    return NextResponse.json({
      text: 'Task deleted',
      replace_original: true
    });
  } catch (error) {
    console.error('Delete Task Error:', error);
    return NextResponse.json({
      text: 'Failed to delete task',
      replace_original: false
    });
  }
}

async function openEditTaskModal(taskId, userId) {
  try {
    // Implement modal opening logic here
    return NextResponse.json({
      response_action: 'open_modal',
      view: {
        type: 'modal',
        title: {
          type: 'plain_text',
          text: 'Edit Task'
        },
        submit: {
          type: 'plain_text',
          text: 'Save'
        },
        blocks: [
          {
            type: 'input',
            block_id: 'task_input',
            label: {
              type: 'plain_text',
              text: 'Task Description'
            },
            element: {
              type: 'plain_text_input',
              action_id: 'task_description',
              initial_value: 'Current task text' // Replace with actual task text
            }
          }
        ]
      }
    });
  } catch (error) {
    console.error('Open Modal Error:', error);
    return NextResponse.json({
      text: 'Failed to open edit modal',
      replace_original: false
    });
  }
}