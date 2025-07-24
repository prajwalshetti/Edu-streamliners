# 🏫 School Management System 
[![MIT License](https://img.shields.io/badge/License-MIT-green.svg)](https://choosealicense.com/licenses/mit/)
[![Contributions Welcome](https://img.shields.io/badge/contributions-welcome-brightgreen.svg?style=flat)](CONTRIBUTING.md)
[![Stars](https://img.shields.io/github/stars/Visheshpgowda/Hackthon?style=social)](https://github.com/Visheshpgowda/Hackthon)

<div align="center">
  <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRKdAVNJnkY8n2NovBUhlijTSDF4RH7UQizDA&s" alt="Project Banner">
  
  A comprehensive school management system built with React and Node.js, designed to streamline educational operations.

  [Live Demo](https://hackathon-frontend-lime.vercel.app) • [Report Bug](https://github.com/Visheshpgowda/Hackthon/issues) • [Request Feature](https://github.com/Visheshpgowda/Hackthon/issues)
</div>

## ✨ Features

- 📊 Comprehensive dashboard for teachers and headmasters
- 📝 Advanced attendance tracking system
- ⏰ Dynamic timetable management
- 📢 School-wide announcement system
- 👥 User role management (Admin, Teacher, Student)
- 📱 Responsive design for all devices

## 🚀 Tech Stack

**Client:** 
- ![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
- ![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)
- ![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)

**Server:** 
- ![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
- ![Express.js](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)
- ![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white)

## 🗂️ Project Structure

```text
school-management-system/
├── frontend/                 # React frontend application
│   ├── src/
│   │   ├── components/      # Reusable UI components
│   │   ├── pages/          # Page components
│   │   ├── assets/         # Static assets
│   │   └── services/       # API services
│   └── public/             # Public assets
└── backend/                # Node.js backend application
    ├── controllers/        # Request handlers
    ├── models/            # Database models
    ├── routes/            # API routes
    └── services/          # Business logic
```

## 🛠️ Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Visheshpgowda/Hackthon.git
   cd school-management-system
   ```

2. **Set up the backend**
   ```bash
   cd backend
   npm install
   cp .env.example .env    # Configure your environment variables
   npm run dev
   ```

3. **Set up the frontend**
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

## 🌍 Environment Variables

Create a `.env` file in the backend directory:

```env
# Server Configuration
PORT=8080
CORS_ORIGIN=*

# Twilio Configuration
TWILIO_ACCOUNT_SID=your_account_sid
TWILIO_AUTH_TOKEN=your_auth_token
TWILIO_PHONE_NUMBER=your_phone_number

# MongoDB Configuration
MONGODB_URI=your_mongodb_uri

# JWT Configuration
ACCESS_TOKEN_SECRET=your_access_token_secret
ACCESS_TOKEN_EXPIRY=1d
REFRESH_TOKEN_SECRET=your_refresh_token_secret
REFRESH_TOKEN_EXPIRY=10d

# Client Configuration
CLIENT_URL=http://localhost:5173
```

## 📱 Screenshots

<div align="center">
  <h3>Dashboard View</h3>
  <img src="./WhatsApp Image 2025-02-23 at 23.23.10_232d2724.jpg" alt="Dashboard Screenshot" width="800">
  
  <h3>Attendance Management</h3>
  <img src="./dash2.jpg" alt="Attendance Management" width="800">
  
  <h3>Timetable Management</h3>
  <img src="./time_table.jpg" alt="Timetable Management" width="800">
  
  <h3>Announcements Interface</h3>
  <img src="./anounce.jpg" alt="Announcements Interface" width="800">
</div>

## 👥 Authors

### Prajwal P Shetti
- 📧 Email: [prajwal.is22@bmsce.ac.in](mailto:prajwal.is22@bmsce.ac.in)
- 📱 Phone: 9380005468
- 🎓 Role: Backend Developer

### Shreyas D K
- 📧 Email: [shreyasdk.is22@bmsce.ac.in](mailto:shreyasdk.is22@bmsce.ac.in)
- 📱 Phone: 8317424204
- 🎓 Role: Frontend Developer

### Somanath Mikali
- 📧 Email: [somanath.is22@bmsce.ac.in](mailto:somanath.is22@bmsce.ac.in)
- 📱 Phone: 9731957518
- 🎓 Role: Full Stack Developer

### Vishesh P Gowda
- 📧 Email: [vishesh.is22@bmsce.ac.in](mailto:vishesh.is22@bmsce.ac.in)
- 📱 Phone: 9481262426
- 🎓 Role: Project Lead & DevOps

## 📜 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🤝 Contributing

Contributions make the open source community an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 🙏 Acknowledgments

- [React Documentation](https://reactjs.org/)
- [Node.js](https://nodejs.org/)
- [MongoDB](https://www.mongodb.com/)
- [Tailwind CSS](https://tailwindcss.com/)

---

<div align="center">
  Made with ❤️ by the Edu-Streamliners

</div>