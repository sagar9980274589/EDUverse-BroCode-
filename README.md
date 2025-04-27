# EDUverse - Educational Social Platform

## 🌟 About EDUverse

EDUverse is a comprehensive educational social platform developed by team 'BROcode' from Adichunchanagiri Institute of Technology. The platform connects students and mentors in an interactive learning environment, combining educational resources with social networking features.

## 👥 Team BROcode

- **Sagar H D**
- **Karan S Gowda**
- **Madan K**
- **Afnan**

## 🚀 Features

### 🎓 Educational Components
- **Separate signup flows** for mentors and students
- **Course creation** for mentors with YouTube video links, playlists, and notes upload
- **Course publishing** functionality for mentors
- **Course enrollment** for students
- **Course rating** system

### 💬 Social Components
- **Chat functionality** between followers using Socket.io
- **Follow/unfollow system** with request acceptance/rejection
- **Social feed** for sharing posts about projects and skills
- **Post interaction** with likes, comments, and bookmarks
- **User profiles** showcasing skills and projects

### 🔗 Integration Features
- **GitHub integration** to display users' public repositories
- **Project showcase** from connected GitHub accounts
- **Persistent connections** that remain after page refresh or logout

### 🔐 Authentication
- **Email-based authentication** with secure password handling
- **Forgot password** functionality with OTP verification
- **User role management** (student, mentor, regular)

## 🛠️ Technology Stack

### Frontend
- **React.js** - UI library
- **Redux** - State management
- **Tailwind CSS** - Styling
- **Socket.io-client** - Real-time communication
- **React Router** - Navigation

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Socket.io** - Real-time communication
- **JWT** - Authentication
- **Multer** - File uploads
- **Cloudinary** - Image storage

## 📋 Project Structure

```
EDUverse(BroCode)/
├── Frontend/                # React frontend application
│   ├── public/              # Public assets
│   └── src/                 # Source files
│       ├── components/      # React components
│       │   ├── edu/         # Educational components
│       │   └── ...          # Other components
│       ├── hooks/           # Custom React hooks
│       ├── AxiosInstance.js # API configuration
│       ├── chatSlice.js     # Redux slice for chat
│       └── ...              # Other files
├── Backend/                 # Node.js backend application
│   ├── controller/          # Route controllers
│   ├── middleware/          # Express middlewares
│   ├── model/               # MongoDB models
│   ├── route/               # API routes
│   ├── service/             # Services (multer, etc.)
│   └── index.js             # Entry point
└── README.md                # Project documentation
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- MongoDB
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/EDUverse-BroCode.git
   cd EDUverse-BroCode
   ```

2. **Install backend dependencies**
   ```bash
   cd Backend
   npm install
   ```

3. **Install frontend dependencies**
   ```bash
   cd ../Frontend
   npm install
   ```

4. **Set up environment variables**

   Create a `.env` file in the Backend directory with the following variables:
   ```
   PORT=3000
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
   CLOUDINARY_API_KEY=your_cloudinary_api_key
   CLOUDINARY_API_SECRET=your_cloudinary_api_secret
   EMAIL_USER=your_email_for_sending_otps
   EMAIL_PASS=your_email_password
   ```

5. **Start the backend server**
   ```bash
   cd Backend
   npm start
   ```

6. **Start the frontend development server**
   ```bash
   cd Frontend
   npm run dev
   ```

7. **Access the application**

   Open your browser and navigate to `http://localhost:5173`

## 🧪 Testing

```bash
# Run backend tests
cd Backend
npm test

# Run frontend tests
cd Frontend
npm test
```

## 📱 Usage

1. **Register as a student or mentor**
2. **Explore courses** or create your own if you're a mentor
3. **Connect with other users** by following them
4. **Share your projects and skills** in the social hub
5. **Chat with your connections** using the chat feature
6. **Connect your GitHub account** to showcase your projects

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgements

- [React.js](https://reactjs.org/)
- [Node.js](https://nodejs.org/)
- [MongoDB](https://www.mongodb.com/)
- [Socket.io](https://socket.io/)
- [Tailwind CSS](https://tailwindcss.com/)
- [GitHub API](https://docs.github.com/en/rest)
- Adichunchanagiri Institute of Technology for their support
