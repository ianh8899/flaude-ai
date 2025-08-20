# Flaude Ai

This is **Flaude Ai** a proof of concept based on (an albeit flawed) version of Claude.ai, that is totally private.

## Features

- **React** for the frontend.
- **Hono** as the backend framework.
- **Better Auth** for authentication and session management (email/password + social login).
- **Stripe** - for customer payments
- **Ollama** - to run the ai model
- Pre-configured with TypeScript for type safety.

## Prerequisites

Before you begin, ensure you have the following installed:

- [Node.js](https://nodejs.org/)
- [npm](https://www.npmjs.com/)
- [Ollama](https://ollama.com/)
- You may also need sqlite3 installed (system dependent - https://sqlite.org/)

## Installation

Follow these steps to set up the project:

1. **Clone the repository:**

   ```bash
   git clone https://github.com/ianh8899/flaude-ai.git
   cd flaude-ai
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Pull the tinyllama model:**

   ```bash
   ollama pull tinyllama
   ```

4. **Set up environment variables:**

   ```bash
   cp .env.example .env
   # Edit .env with your configuration see .env.example for reference
   ```

5. **Run the better-auth migration**

   ```bash
   cd /server
   npx @better-auth/cli migrate
   cd ..
   ```

6. **Start development servers:**

   ```bash
   npm run dev:client
   npm run dev:server
   ```

   This will start:

   - The React app on http://localhost:5173
   - The Hono API on http://localhost:3000
