# 📝 To-Do List Application

A full-stack ToDo application built with FastAPI, Supabase (PostgreSQL), and modern frontend technologies. Features secure authentication, RESTful APIs, and production-ready deployment.

![Language Distribution](https://img.shields.io/badge/JavaScript-50%25-yellow)
![Language Distribution](https://img.shields.io/badge/CSS-30%25-blue)
![Language Distribution](https://img.shields.io/badge/Python-18.3%25-blue)
![Language Distribution](https://img.shields.io/badge/HTML-1.7%25-orange)

## ✨ Features

- 🔐 **Secure Authentication**: User registration and login with JWT tokens
- ✅ **Task Management**: Create, read, update, and delete tasks
- 👤 **User-Specific Tasks**: Each user has their own private task list
- 📊 **Real-time Statistics**: Track total, pending, and completed tasks
- 🎨 **Modern UI**: Clean and responsive interface
- 🔄 **Live Updates**: Refresh tasks on demand
- 🌐 **CORS Enabled**: Ready for deployment with separate frontend/backend
- ⚡ **Production Ready**: Deployed on Render with Vercel frontend

## 🚀 Tech Stack

### Backend
- **FastAPI**: Modern, fast web framework for building APIs
- **SQLAlchemy**: SQL toolkit and ORM
- **PostgreSQL**: Robust relational database (via Supabase)
- **Python-Jose**: JWT token handling
- **Passlib**: Password hashing with bcrypt
- **Uvicorn**: ASGI server

### Frontend
- **Vanilla JavaScript**: Clean, dependency-free frontend
- **HTML5/CSS3**: Modern, responsive design
- **Fetch API**: RESTful API communication

## 📁 Project Structure

```
To-Do-List/
├── frontend/               # Frontend files
│   ├── index.html         # Main HTML entry point
│   ├── style.css          # Main application styles
│   ├── login.css          # Authentication page styles
│   ├── script.js          # Main application logic
│   └── functions.js       # Helper functions and API calls
├── main.py                # FastAPI application entry point
├── auth.py                # Authentication routes and logic
├── database.py            # Database configuration
├── database_model.py      # SQLAlchemy models
├── models.py              # Pydantic models for validation
├── requirements.txt       # Python dependencies
└── .gitignore            # Git ignore rules
```

## 🎨 Frontend Features

- **Dynamic UI**: JavaScript-powered interface with no page reloads
- **Task Statistics**: Live counters for total, pending, and completed tasks
- **Skeleton Loading**: Smooth loading states for better UX
- **Form Validation**: Client-side validation for user inputs
- **Session Management**: Secure cookie-based authentication
- **Responsive Design**: Works on desktop and mobile devices

## 🔒 Security Features

- Password hashing with bcrypt
- JWT token authentication
- HTTP-only cookies for token storage
- CORS protection
- Input validation with Pydantic
- Protected routes requiring authentication

## 🌐 Deployment

### Backend (Render)
The backend is deployed on Render at: `https://to-do-list-95ir.onrender.com`

### Frontend (Vercel)
The frontend is deployed on Vercel at: `https://to-do-list-lyart-eight-83.vercel.app`

### Environment Variables for Production
Make sure to set the following in your hosting platform:
- `DATABASE_URL`
- `SECRET_KEY`
- `ALGORITHM`
- `ACCESS_TOKEN_EXPIRE_MINUTES`

## 👤 Author

**hitheshn208**

- GitHub: [@hitheshn208](https://github.com/hitheshn208)
- Repository: [To-Do-List](https://github.com/hitheshn208/To-Do-List)

## 🙏 Acknowledgments

- FastAPI for the excellent web framework
- Supabase for PostgreSQL hosting
- Render for backend hosting
- Vercel for frontend hosting

---

⭐ If you find this project useful, please consider giving it a star!