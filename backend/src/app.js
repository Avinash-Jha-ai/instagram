import dotenv from "dotenv";
dotenv.config();
import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express"
import authRouter from "./routes/auth.route.js";
import profileRouter from "./routes/profile.route.js";  
import postRouter from "./routes/post.route.js";
import reelRouter from "./routes/reel.route.js";


const app =express();
const allowedOrigins = [
  process.env.FRONTEND_URL,
  "https://instagram-gamma-taupe.vercel.app",
].filter(Boolean);

app.use(
  cors({
    origin: (origin, cb) => {
      // allow server-to-server / curl (no Origin header)
      if (!origin) return cb(null, true);
      if (allowedOrigins.includes(origin)) return cb(null, true);
      return cb(new Error(`CORS blocked for origin: ${origin}`), false);
    },
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());

app.use("/api/auth",authRouter)
app.use("/api/profile",profileRouter)
app.use("/api/posts",postRouter)
app.use("/api/reels",reelRouter)

export default app;