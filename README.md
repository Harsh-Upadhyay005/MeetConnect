<div align="center">

# 🎥 MeetConnect

<p align="center">
  <img src="https://img.shields.io/badge/React-18.2.0-61DAFB?style=for-the-badge&logo=react&logoColor=white" alt="React" />
  <img src="https://img.shields.io/badge/Node.js-Express-339933?style=for-the-badge&logo=node.js&logoColor=white" alt="Node.js" />
  <img src="https://img.shields.io/badge/MongoDB-Database-47A248?style=for-the-badge&logo=mongodb&logoColor=white" alt="MongoDB" />
  <img src="https://img.shields.io/badge/Socket.io-4.8.3-010101?style=for-the-badge&logo=socket.io&logoColor=white" alt="Socket.io" />
  <img src="https://img.shields.io/badge/WebRTC-Mediasoup-FF6B6B?style=for-the-badge" alt="WebRTC" />
</p>

**A modern, feature-rich video conferencing platform built with cutting-edge web technologies**

Experience seamless high-quality video calls. Connect with anyone, anywhere, anytime.

[Live Demo](#) • [Report Bug](https://github.com/Harsh-Upadhyay005/MeetConnect/issues) • [Request Feature](https://github.com/Harsh-Upadhyay005/MeetConnect/issues)

</div>

---

## 📖 Table of Contents

- [About The Project](#-about-the-project)
- [Key Features](#-key-features)
- [Tech Stack](#-tech-stack)
- [Getting Started](#-getting-started)
- [Project Structure](#-project-structure)
- [API Documentation](#-api-documentation)
- [Color Palette](#-color-palette)
- [Screenshots](#-screenshots)
- [Roadmap](#-roadmap)
- [Contributing](#-contributing)
- [License](#-license)
- [Contact](#-contact)

---

## 🌟 About The Project

**MeetConnect** is a full-stack video conferencing application that enables users to connect face-to-face from anywhere in the world. Built with **React** on the frontend and **Node.js/Express** on the backend, it leverages **WebRTC** and **Mediasoup** for high-quality peer-to-peer video communication and **Socket.IO** for real-time signaling.

### Why MeetConnect?

- 🎯 **Simple & Intuitive** - Clean, modern UI with easy navigation
- 🚀 **High Performance** - Optimized for low-latency video streaming
- 🔒 **Secure** - End-to-end encrypted communications
- 📱 **Responsive** - Works seamlessly across all devices
- 🆓 **Open Source** - Free to use and contribute

---

## ✨ Key Features

### Core Functionality
- 🔐 **User Authentication System**
  - Secure registration and login
  - Password hashing with bcrypt
  - Session management

- 🎥 **Real-Time Video Conferencing**
  - High-definition video streaming with WebRTC
  - Mediasoup SFU (Selective Forwarding Unit) architecture
  - Multi-party video calls support

- 💬 **Live Chat Messaging**
  - Real-time text communication during meetings
  - Message history tracking
  - Typing indicators

- 📊 **Activity Tracking**
  - User activity logging
  - Meeting history
  - Analytics dashboard

- 👥 **Guest Access**
  - Join meetings without registration
  - Quick join functionality
  - No-signup required option

### Additional Features
- 🎨 Modern, gradient-based UI design
- 📱 Fully responsive design
- 🌙 Smooth animations and transitions
- ⚡ Instant connection setup
- 🔄 Auto-reconnection handling
- 📍 Meeting room management

---

## 🛠️ Tech Stack

### Frontend
| Technology | Purpose |
|------------|---------|
| ![React](https://img.shields.io/badge/React-18.2.0-61DAFB?style=flat&logo=react) | UI Framework |
| ![Material-UI](https://img.shields.io/badge/Material--UI-5.18.0-007FFF?style=flat&logo=mui) | Component Library |
| ![React Router](https://img.shields.io/badge/React_Router-7.13.0-CA4245?style=flat&logo=react-router) | Client-side Routing |
| ![Socket.io Client](https://img.shields.io/badge/Socket.io_Client-4.8.3-010101?style=flat&logo=socket.io) | Real-time Communication |
| ![Mediasoup Client](https://img.shields.io/badge/Mediasoup_Client-3.18.4-FF6B6B?style=flat) | WebRTC Media Handling |
| ![Axios](https://img.shields.io/badge/Axios-1.13.4-5A29E4?style=flat) | HTTP Client |

### Backend
| Technology | Purpose |
|------------|---------|
| ![Node.js](https://img.shields.io/badge/Node.js-Express-339933?style=flat&logo=node.js) | Server Runtime |
| ![Express](https://img.shields.io/badge/Express-5.2.1-000000?style=flat&logo=express) | Web Framework |
| ![MongoDB](https://img.shields.io/badge/MongoDB-9.1.5-47A248?style=flat&logo=mongodb) | Database |
| ![Mongoose](https://img.shields.io/badge/Mongoose-9.1.5-880000?style=flat) | ODM |
| ![Socket.io](https://img.shields.io/badge/Socket.io-4.8.3-010101?style=flat&logo=socket.io) | WebSocket Server |
| ![Mediasoup](https://img.shields.io/badge/Mediasoup-3.19.14-FF6B6B?style=flat) | WebRTC SFU Server |
| ![bcrypt](https://img.shields.io/badge/bcrypt-6.0.0-338033?style=flat) | Password Hashing |

### DevOps & Tools
- **PM2** - Process Manager for Node.js
- **Nodemon** - Development Auto-reload
- **CORS** - Cross-Origin Resource Sharing
- **UUID** - Unique ID Generation

---

## 🚀 Getting Started

### Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v14.0 or higher)
- **npm** or **yarn**
- **MongoDB** (Atlas account or local installation)
- **Git**

### Installation

#### 1️⃣ Clone the Repository

```bash
git clone https://github.com/Harsh-Upadhyay005/MeetConnect.git
cd MeetConnect
```

#### 2️⃣ Backend Setup

```bash
# Navigate to Backend directory
cd Backend

# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Edit .env with your configuration
# Required: MONGO_URI, PORT, CORS_ORIGIN
```

**Environment Variables (.env)**
```env
PORT=8000
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/meetconnect
CORS_ORIGIN=http://localhost:3000
NODE_ENV=development
```

```bash
# Start the backend server
npm run dev        # Development mode with auto-reload
# OR
npm start          # Production mode
```

Backend will run on **http://localhost:8000**

#### 3️⃣ Frontend Setup

```bash
# Navigate to Frontend directory (from root)
cd Frontend

# Install dependencies
npm install

# Start the development server
npm start
```

Frontend will run on **http://localhost:3000**

#### 4️⃣ Quick Start Script

For Windows users, you can use the provided batch script:

```bash
# From the root directory
start.bat
```

Or for PowerShell:

```powershell
.\start.ps1
```

---

## 📁 Project Structure

```
MeetConnect/
│
├── 📂 Backend/                    # Server-side application
│   ├── 📂 src/
│   │   ├── 📄 app.js             # Express app & Socket.IO server
│   │   ├── 📂 controllers/
│   │   │   ├── 📄 user.controller.js      # Authentication & user logic
│   │   │   └── 📄 SocketManager.js        # WebSocket event handlers
│   │   ├── 📂 Models/
│   │   │   ├── 📄 user.model.js           # User schema (Mongoose)
│   │   │   └── 📄 meeting.model.js        # Meeting schema
│   │   └── 📂 Routes/
│   │       └── 📄 user.models.js          # REST API routes
│   ├── 📄 .env                   # Environment variables
│   ├── 📄 .env.example           # Environment template
│   └── 📄 package.json           # Backend dependencies
│
├── 📂 Frontend/                   # Client-side application
│   ├── 📂 public/
│   │   ├── 📄 index.html
│   │   └── 📄 manifest.json
│   ├── 📂 src/
│   │   ├── 📄 App.js             # Main React component
│   │   ├── 📄 index.js           # React entry point
│   │   ├── 📂 pages/
│   │   │   ├── 📄 landing.jsx    # Landing page
│   │   │   ├── 📄 authentication.jsx  # Login/Register
│   │   │   ├── 📄 home.jsx       # User dashboard
│   │   │   ├── 📄 videoMeet.jsx  # Video call interface
│   │   │   └── 📄 history.jsx    # Meeting history
│   │   ├── 📂 Contexts/
│   │   │   └── 📄 AuthContext.jsx     # Authentication context
│   │   ├── 📂 styles/
│   │   │   └── 📄 videoComponent.module.css
│   │   └── 📂 utils/
│   │       └── 📄 withAuth.jsx        # HOC for protected routes
│   └── 📄 package.json           # Frontend dependencies
│
├── 📄 README.md                  # Project documentation
├── 📄 PROJECT_STATUS.md          # Current project status
├── 📄 FIXES_SUMMARY.md           # Bug fixes log
├── 📄 start.bat                  # Windows startup script
└── 📄 start.ps1                  # PowerShell startup script
```

---

## 🔌 API Documentation

### Base URL
```
http://localhost:8000/api/v1
```

### Authentication Endpoints

#### Register New User
```http
POST /users/register
Content-Type: application/json

{
  "name": "John Doe",
  "username": "johndoe",
  "email": "john@example.com",
  "password": "securepassword123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "User registered successfully",
  "user": {
    "id": "user_id",
    "name": "John Doe",
    "email": "john@example.com"
  }
}
```

#### User Login
```http
POST /users/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "securepassword123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "token": "jwt_token_here",
  "user": {
    "id": "user_id",
    "name": "John Doe",
    "email": "john@example.com"
  }
}
```

### Activity Tracking

#### Add Activity
```http
POST /users/add_to_activity
Content-Type: application/json

{
  "userId": "user_id_here",
  "activity": "Joined meeting XYZ"
}
```

#### Get User Activities
```http
GET /users/get_to_activity?userId=user_id_here
```

**Response:**
```json
{
  "success": true,
  "activities": [
    {
      "id": "activity_id",
      "activity": "Joined meeting XYZ",
      "timestamp": "2026-01-28T10:30:00Z"
    }
  ]
}
```

### WebSocket Events

**Client → Server:**
- `connection` - Initial connection
- `join-room` - Join a meeting room
- `offer` - WebRTC offer signal
- `answer` - WebRTC answer signal
- `ice-candidate` - ICE candidate exchange
- `leave-room` - Leave meeting room
- `send-message` - Send chat message

**Server → Client:**
- `user-joined` - New user joined
- `user-left` - User left the room
- `offer` - WebRTC offer from peer
- `answer` - WebRTC answer from peer
- `ice-candidate` - ICE candidate from peer
- `new-message` - New chat message

---

## 🎨 Color Palette

The application uses a carefully curated color scheme for a modern, vibrant look:

| Color | Hex Code | Usage |
|-------|----------|-------|
| 🟠 Warm Orange | `#FFC067` | Primary accents, CTA buttons, highlights |
| 🩵 Cyan | `#66F4FF` | Secondary accents, hover effects, icons |
| 🔵 Light Blue | `#66C4FF` | Brand color, links, active states |
| 🔘 Slate Gray | `#7D99AA` | Secondary text, borders, subtle elements |
| ⚫ Dark Background | `#1a1a2e` | Main background, navbar |
| 🌑 Deep Blue | `#16213e` | Gradient backgrounds |

**Design Philosophy:**
- Dark theme with bright, cheerful accents
- Gradient effects for modern aesthetics
- High contrast for accessibility
- Smooth color transitions

---

## 📸 Screenshots

> *Screenshots coming soon!*

---

## 🗺️ Roadmap

### Current Version (v1.0.0)
- ✅ User authentication
- ✅ Real-time video calls
- ✅ Basic chat functionality
- ✅ Activity tracking
- ✅ Guest access
- ✅ Screen sharing

### Upcoming Features
- [ ] Recording functionality
- [ ] Virtual backgrounds
- [ ] Breakout rooms
- [ ] Meeting scheduling
- [ ] Calendar integration
- [ ] Mobile apps (iOS/Android)
- [ ] File sharing during calls
- [ ] Polls and reactions
- [ ] AI-powered noise cancellation
- [ ] Live transcription
- [ ] Multi-language support

---

## 🤝 Contributing

Contributions are what make the open-source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**!

### How to Contribute

1. **Fork the Project**
2. **Create your Feature Branch**
   ```bash
   git checkout -b feature/AmazingFeature
   ```
3. **Commit your Changes**
   ```bash
   git commit -m 'Add some AmazingFeature'
   ```
4. **Push to the Branch**
   ```bash
   git push origin feature/AmazingFeature
   ```
5. **Open a Pull Request**

### Contribution Guidelines

- Follow the existing code style
- Write clear commit messages
- Add tests for new features
- Update documentation as needed
- Ensure all tests pass before submitting PR

---

## 📝 License

Distributed under the ISC License. See `LICENSE` for more information.

---

## 👤 Contact

**Harsh Upadhyay**

- GitHub: [@Harsh-Upadhyay005](https://github.com/Harsh-Upadhyay005)
- Project Link: [https://github.com/Harsh-Upadhyay005/MeetConnect](https://github.com/Harsh-Upadhyay005/MeetConnect)

---

## 🙏 Acknowledgments

- [React Documentation](https://reactjs.org/)
- [Material-UI](https://mui.com/)
- [Socket.IO](https://socket.io/)
- [Mediasoup](https://mediasoup.org/)
- [MongoDB](https://www.mongodb.com/)
- [WebRTC](https://webrtc.org/)

---

<div align="center">

### ⭐ Star this repository if you find it helpful!

**Made with ❤️ by Harsh Upadhyay**

</div>
