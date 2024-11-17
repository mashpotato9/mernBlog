import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import userRoutes from './routes/user.route.js';
import authRoutes from './routes/auth.route.js';

dotenv.config();

mongoose.connect(process.env.MONGODB_URL )
    .then( () =>
    {console.log('Connected to MongoDB')}
)

const app = express();
app.use(express.json());

app.use('/api/user', userRoutes);
app.use("/api/auth", authRoutes);

app.use((req, res, err, next) => {
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

