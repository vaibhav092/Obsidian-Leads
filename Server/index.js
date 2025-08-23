import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import prisma from './lib/prisma.js';
import userRoutes from './Router/user.routes.js';
import leadRoutes from './Router/lead.routes.js';

const app = express();

app.use(cors());
app.use(express.json());
app.use(cookieParser());
app.use(morgan());

app.use('/api/users', userRoutes);
app.use('/api/leads', leadRoutes);

const PORT = process.env.PORT || 3000;

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
