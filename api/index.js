import { fileURLToPath } from 'url';
import path from 'path';
import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import userRoutes from './routes/user.route.js';
import authRoutes from './routes/auth.route.js';
import postRoutes from './routes/post.route.js';
import commentRoutes from './routes/comment.route.js';
import cors from 'cors';
import cookieParser from 'cookie-parser';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '.env') });

mongoose.connect(process.env.MONGODB_URL )
    .then( () =>
    {console.log('Connected to MongoDB')}
)

const app = express();
app.use(cookieParser());
app.use(express.json());
app.use(cors({
    origin: process.env.NODE_ENV === 'production' 
    ? 'https://your-render-app.onrender.com'
    : 'http://localhost:5173',
    credentials: true
}));

app.use('/api/user', userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/post", postRoutes);
app.use('/api/comment', commentRoutes);

app.use(express.static(path.join(__dirname, '/client/dist')));
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    const message = err.message || 'An error occurred';
    res.status(statusCode).json({ 
        success: false,
        statusCode,
        message 
    });
});

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});

