<div align="center">

# DevSync

### [Try DevSync](https://collaborative-code-env-frontend.onrender.com/)

A real-time collaborative coding platform that I built to make team development seamless and efficient! 
</div>


<img width="1436" alt="DevSync Screenshot" src="https://github.com/user-attachments/assets/e85599fd-40aa-440f-96f4-74785de5aeeb" />

## What is DevSync?

DevSync is my take on creating the perfect collaborative coding environment. As someone who loves coding with others, I wanted to build a platform where developers can code together in real-time, share ideas, and create amazing things without the usual friction of collaboration tools.

## Key Features

- **Real-time Collaboration** - Code together with your team in perfect sync! Watch as changes appear instantly, track who's working where with live cursors, and never worry about code conflicts again.

- **Multi-Language Support** - Whether you're writing JavaScript, Python, Java, or C++, I've got you covered with syntax highlighting and smart code completion.

- **Instant Setup** - No complicated registration process! Just create a room and share the link with your team to get started.

- **Built-in Communication** - Chat with your team, share code snippets, and debug together all in one place.

## Tech Stack I Used

### Frontend
- React with TypeScript for a robust UI
- Monaco Editor for that sweet VS Code-like experience
- Socket.IO Client for real-time updates
- Vite for lightning-fast builds

### Backend
- Node.js + Express for the server
- Socket.IO for handling real-time communication
- Docker for easy deployment

## Want to Try It Out?

1. **Clone the repo:**
   ```bash
   git clone https://github.com/yourusername/collaborative-code-env.git
   cd collaborative-code-env
   ```

2. **Install everything you need:**
   ```bash
   npm run install:all
   ```

3. **Set up your environment:**
   ```bash
   # Frontend (.env)
   VITE_API_URL=http://localhost:5000
   VITE_WS_URL=ws://localhost:5000

   # Backend (.env)
   PORT=5000
   CLIENT_URL=http://localhost:3000
   NODE_ENV=development
   ```

4. **Fire it up:**
   ```bash
   npm start
   ```

## What I Learned

Building DevSync has been an amazing journey! I've learned so much about:
- Managing real-time data synchronization
- Building scalable WebSocket architectures
- Creating intuitive collaborative interfaces
- Handling concurrent user interactions
- Deploying and managing containerized applications

## Want to Contribute?

I'd love to have you on board! Feel free to:
- Fork the repo
- Create a feature branch
- Make your awesome changes
- Send me a pull request


