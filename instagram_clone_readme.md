# 📸 Instagram Clone (MERN Stack)

A full-stack Instagram clone built using the MERN stack, replicating core social media functionalities like authentication, posts, reels, and user interactions.

🔗 **Live Demo:** [https://instagram-gamma-taupe.vercel.app](https://instagram-gamma-taupe.vercel.app)\
💻 **GitHub Repo:** [https://github.com/Avinash-Jha-ai/instagram](https://github.com/Avinash-Jha-ai/instagram)

---

## 🚀 Features

- 🔐 User Authentication (JWT-based)
- 📸 Create & upload posts and reels
- 👤 User profile with post and reel
- 📰 Dynamic feed system
- 🎨 Responsive UI with smooth animations

---

## 🛠️ Tech Stack

### Frontend

- React.js (Vite)
- HTML, CSS, Tailwind CSS
- GSAP (animations)

### Backend

- Node.js
- Express.js

### Database

- MongoDB

### Other Tools

- Cloudinary (media storage)
- JWT (authentication)
- Multer (file uploads)
- Git & GitHub
- Vercel & Render (deployment)

---

## 📂 Project Structure

```
instagram/
│
├── backend/
│   ├── src/
│   │   ├── configs/        # Cloudinary & DB configs
│   │   ├── controllers/    # Business logic (auth, post, reel, profile)
│   │   ├── middleware/     # Auth & file upload middleware
│   │   ├── models/         # MongoDB schemas
│   │   ├── routes/         # API routes
│   │   ├── services/       # Service layer
│   │   ├── utils/          # Helper functions
│   │   └── validators/     # Input validation
│   ├── uploads/            # Temporary file storage
│   ├── app.js              # Express app setup
│   └── server.js           # Server entry point
│
├── frontend/
│   ├── src/
│   │   ├── api/            # Axios config
│   │   ├── assets/         # Static files
│   │   ├── components/     # Reusable UI components
│   │   ├── context/        # Global state management
│   │   ├── pages/          # App pages
│   │   ├── App.jsx         # Root component
│   │   └── main.jsx        # Entry point
│   └── index.html
```

---

## ⚙️ Installation & Setup

### 1. Clone the repository

```bash
git clone https://github.com/Avinash-Jha-ai/instagram.git
cd instagram
```

### 2. Install dependencies

```bash
# backend
cd backend
npm install

# frontend
cd ../frontend
npm install
```

### 3. Setup Environment Variables

Create a `.env` file in the backend folder:

```
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_secret_key
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

### 4. Run the project

```bash
# backend
npm run dev

# frontend
npm run dev
```

---

## 📚 What I Learned

- Designing scalable backend architecture (controllers, services, middleware)
- Implementing secure authentication using JWT
- Handling file uploads using Multer + Cloudinary
- Managing global state using React Context API
- Debugging real-world issues like authorization errors across devices
- Deploying full-stack apps on Vercel & Render

---

## 🔮 Future Improvements

- 💬 Real-time chat system (Socket.io)
- 🔔 Notifications system
- 🔍 Explore page with recommendations
- ⚡ Performance optimization & caching

---

## 🤝 Contributing

Contributions are welcome! Feel free to fork this repo and submit a pull request.

---

## 📬 Contact

- GitHub: [https://github.com/Avinash-Jha-ai](https://github.com/Avinash-Jha-ai)
- LinkedIn: [https://www.linkedin.com/in/avinash-jha-0a261b385/](https://www.linkedin.com/in/avinash-jha-0a261b385/)

---

⭐ If you like this project, don’t forget to give it a star!

