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
];

app.use(
    cors({
        origin: function (origin, callback) {
            console.log('CORS check - Origin:', origin);
            if (!origin || allowedOrigins.includes(origin)) {
                console.log('✅ CORS allowed for origin:', origin);
                callback(null, true);
            } else {
                console.log('❌ CORS blocked for origin:', origin);
                callback(new Error('Not allowed by CORS'));
            }
        },
        credentials: true,
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization', 'Cookie'],
    })
);
app.use(express.json());
app.use(cookieParser());
app.use(morgan('tiny'));

app.use('/api/users', userRoutes);
app.use('/api/leads', leadRoutes);

// Debug route to check environment variables
app.get('/api/debug', (req, res) => {
    res.json({
        nodeEnv: process.env.NODE_ENV,
        cookieDomain: process.env.COOKIE_DOMAIN,
        corsOrigins: allowedOrigins,
        timestamp: new Date().toISOString()
    });
});

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
