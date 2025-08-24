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

// CORS must be the first middleware
app.use(
    cors({
        origin: true, // Allow all origins temporarily for debugging
        credentials: true,
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization', 'Cookie', 'X-Requested-With'],
    })
);

app.use(express.json());
app.use(cookieParser());
app.use(morgan('tiny'));

app.use('/api', (req, res, next) => {
    console.log('API Request:', req.method, req.path, 'Origin:', req.headers.origin);
    res.set({
        'Cache-Control': 'no-cache, no-store, must-revalidate, private',
        'Pragma': 'no-cache',
        'Expires': '0',
        'Surrogate-Control': 'no-store',
        'Last-Modified': new Date().toUTCString(),
        'ETag': `"${Date.now()}"`
    });
    next();
});

app.use('/api/users', userRoutes);
app.use('/api/leads', leadRoutes);

const PORT = process.env.PORT || 3000;

async function startServer() {
    try {
        await prisma.$connect();
        console.log('DB connected successfully');
        app.listen(PORT, '0.0.0.0', () => {
            console.log(`Server listening on port ${PORT}`);
        });
    } catch (error) {
        console.error('Failed to connect to the database:', error.message);
        process.exit(1);
    }
}

startServer();
