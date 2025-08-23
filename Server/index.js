import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import prisma from './lib/prisma.js';
import userRoutes from './Router/user.routes.js';
import leadRoutes from './Router/lead.routes.js';

const app = express();

dotenv.config();

const allowedOrigins = [
    'http://localhost:5173', // Development
    'https://obsidian-leads.vercel.app', // Vercel preview
    'https://your-actual-production-domain.com', // Your real production domain
];

app.use(
    cors({
        origin: function (origin, callback) {
            if (!origin || allowedOrigins.includes(origin)) {
                callback(null, true);
            } else {
                callback(new Error('Not allowed by CORS'));
            }
        },
        credentials: true,
    })
);
app.use(express.json());
app.use(cookieParser());
app.use(morgan('tiny'));

app.use('/api/users', userRoutes);
app.use('/api/leads', leadRoutes);

const PORT = 3000;

async function startServer() {
    try {
        await prisma.$connect();
        console.log('DB connected successfully');
        app.listen(PORT, () => {
            console.log(`Server listening on http://localhost:${PORT}`);
        });
    } catch (error) {
        console.error('Failed to connect to the database:', error.message);
        process.exit(1);
    }
}

startServer();
