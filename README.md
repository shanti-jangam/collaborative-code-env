# Real-time Collaborative Code Editor
[![Live Demo](https://img.shields.io/badge/demo-online-green.svg)](https://collaborative-code-env-frontend.onrender.com/)
<img width="1436" alt="Screenshot 2025-04-16 at 9 48 07 PM" src="https://github.com/user-attachments/assets/e85599fd-40aa-440f-96f4-74785de5aeeb" />


A full-stack application that allows multiple users to collaborate on code in real-time, similar to Google Docs but for code editing.

## Features

- Real-time code collaboration
- Syntax highlighting for multiple languages
- Code execution environment
- Version control integration
- Chat functionality
- User authentication and permissions
- Room-based collaboration
- Cursor tracking for multiple users

## Tech Stack

- Frontend: React + TypeScript
- Backend: Node.js + Express
- Database: MongoDB
- Real-time Communication: Socket.IO
- Containerization: Docker
- Deployment: AWS/GCP

## Project Structure

```
collaborative-code-editor/
├── frontend/           # React + TypeScript frontend
├── backend/            # Node.js + Express backend
├── docker/             # Docker configuration files
└── docs/              # Documentation
```

## Getting Started

1. Clone the repository
2. Install dependencies:
   ```bash
   npm run install:all
   ```
3. Start the development servers:
   ```bash
   npm start
   ```

## Development

- Frontend runs on: http://localhost:3000
- Backend runs on: http://localhost:5000

## Environment Variables

Create `.env` files in both frontend and backend directories with the following variables:

### Frontend (.env)
```
REACT_APP_API_URL=http://localhost:5000
REACT_APP_WS_URL=ws://localhost:5000
```

### Backend (.env)
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/code-editor
JWT_SECRET=your_jwt_secret
```

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a new Pull Request

## License

MIT 
