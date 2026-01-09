const { GoogleGenerativeAI } = require("@google/generative-ai");
const Task = require("../models/Task.model");

// Initialize Gemini
// Ensure GEMINI_API_KEY is in process.env
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// --- Tool Implementations ---

async function getUserTasks(userId) {
  try {
    const tasks = await Task.find({ createdBy: userId });
    if (tasks.length === 0) return "You have no tasks.";
    return JSON.stringify(tasks.map(t => ({
      name: t.taskname,
      completed: t.completed,
      id: t._id,
      priority: t.priority
    })));
  } catch (error) {
    return `Error fetching tasks: ${error.message}`;
  }
}

async function createTask(userId, { taskname, priority }) {
  try {
    const newTask = await Task.create({
      taskname,
      completed: false,
      priority: priority || "Low",
      createdBy: userId
    });
    return `Task created successfully: ${newTask.taskname} (ID: ${newTask._id})`;
  } catch (error) {
    return `Error creating task: ${error.message}`;
  }
}

async function updateTaskStatus(userId, { taskIdentifier, completed }) {
  try {
    let task = await Task.findOne({ _id: taskIdentifier, createdBy: userId }).catch(() => null);

    if (!task) {
      task = await Task.findOne({
        taskname: { $regex: new RegExp(taskIdentifier, "i") },
        createdBy: userId
      });
    }

    if (!task) return "Task not found.";

    task.completed = completed;
    await task.save();
    return `Task '${task.taskname}' marked as ${completed ? 'completed' : 'incomplete'}.`;
  } catch (error) {
    return `Error updating task: ${error.message}`;
  }
}

async function deleteTask(userId, { taskIdentifier }) {
  try {
    let task = await Task.findOneAndDelete({ _id: taskIdentifier, createdBy: userId }).catch(() => null);
    if (!task) {
      task = await Task.findOneAndDelete({
        taskname: { $regex: new RegExp(taskIdentifier, "i") },
        createdBy: userId
      });
    }

    if (!task) return "Task not found.";
    return `Task '${task.taskname}' deleted.`;
  } catch (error) {
    return `Error deleting task: ${error.message}`;
  }
}

// --- Tool Definitions for Gemini ---

const tools = [
  {
    functionDeclarations: [
      {
        name: "get_user_tasks",
        description: "Get a list of tasks for the current user.",
        parameters: {
          type: "OBJECT",
          properties: {},
        },
      },
      {
        name: "create_task",
        description: "Create a new task for the user.",
        parameters: {
          type: "OBJECT",
          properties: {
            taskname: { type: "STRING", description: "The name of the task" },
            priority: { type: "STRING", description: "The priority of the task (Low, Medium, High)" },
          },
          required: ["taskname"],
        },
      },
      {
        name: "update_task_status",
        description: "Mark a task as completed or incomplete.",
        parameters: {
          type: "OBJECT",
          properties: {
            taskIdentifier: { type: "STRING", description: "The name or ID of the task" },
            completed: { type: "BOOLEAN", description: "True for completed, false for incomplete" },
          },
          required: ["taskIdentifier", "completed"],
        },
      },
      {
        name: "delete_task",
        description: "Delete a task.",
        parameters: {
          type: "OBJECT",
          properties: {
            taskIdentifier: { type: "STRING", description: "The name or ID of the task" },
          },
          required: ["taskIdentifier"],
        },
      },
    ],
  },
];

/**
 * Process the user's message using Gemini with tools.
 */
async function processUserMessage(userId, userMessage) {
  const model = genAI.getGenerativeModel({ model: "gemini-pro", tools });

  const chat = model.startChat({
    history: [], // Logic for history can be added here if needed
  });

  try {
    let result = await chat.sendMessage(userMessage);
    let response = result.response;
    let functionCalls = response.functionCalls();

    // Loop to handle potential multiple function calls (though usually one per turn)
    // and return the final text response.
    // NOTE: Gemini "tools" support returns function calls. We must execute them and feed back the result.

    const maxTurns = 5; // Prevent infinite loops
    let turns = 0;

    while (functionCalls && functionCalls.length > 0 && turns < maxTurns) {
      turns++;

      const functionResponses = [];

      for (const call of functionCalls) {
        const { name, args } = call;
        let functionResult;

        console.log(`Executing tool: ${name} with args:`, args);

        if (name === "get_user_tasks") {
          functionResult = await getUserTasks(userId);
        } else if (name === "create_task") {
          functionResult = await createTask(userId, args);
        } else if (name === "update_task_status") {
          functionResult = await updateTaskStatus(userId, args);
        } else if (name === "delete_task") {
          functionResult = await deleteTask(userId, args);
        } else {
          functionResult = "Unknown tool.";
        }

        // Gemini expects the response in a specific format
        // The SDK helps, but basic structure is array of { functionResponse: { name, response } }
        functionResponses.push({
          functionResponse: {
            name: name,
            response: { name: name, content: functionResult }
          }
        });
      }

      // Send the function execution results back to the model
      result = await chat.sendMessage(functionResponses);
      response = result.response;
      functionCalls = response.functionCalls();
    }

    return response.text();

  } catch (error) {
    console.error("Gemini Error:", error);
    return `I'm sorry, I encountered an error while processing your request. Error details: ${error.message}`;
  }
}

module.exports = { processUserMessage };
