# Task Manager App

A simple **Task Manager** application to help users organize their tasks and schedules efficiently.

---

## Features

- User registration and authentication
- Store and retrieve user data with **MongoDB**
- Task creation, editing, and deletion
- **AI Chatbot**: Interact with your tasks using natural language (powered by Google Gemini)
- Welcome email sent to new users upon registration (using Nodemailer with Ethereal for testing)
- Clean and modular codebase

---

## Technologies Used

- **Node.js** and **Express** for the backend server
- **MongoDB** with **Mongoose** for data storage and modeling
- **Nodemailer** for sending emails (using Ethereal email service for development/testing)
- **Google Gemini** for AI Chatbot capabilities
- JavaScript (ES6+)

---

## Setup & Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/dhruv-shah18/NodePracticeFiles.git
   cd NodePracticeFiles
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Configure Environment Variables:
   Create a `.env` file in the root directory and add the following:

   ```env
   PORT=5000
   MONGO_URI=mongodb://localhost:27017/taskmanager
   JWT_SECRET=supersecretkey
   GEMINI_API_KEY=your_google_gemini_api_key
   ```

4. Start the server:

   ```bash
   npm run dev
   ```

## API Endpoints

### Chatbot
- **POST** `/api/chat`: Send a message to the AI assistant to manage your tasks naturally.
  - Body: `{ "message": "Create a task to buy milk" }`
