import express from 'express';
import cors from 'cors';
import path from 'path';
import dotenv from 'dotenv';
import indexRoutes from './routes/indexRoutes';
import apiRoutes from './routes/apiRoutes';
import { seedFirestore } from './seed/seedData';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static files
app.use(express.static(path.join(__dirname, '../public')));

// View Engine Setup (EJS)
app.set('views', path.join(__dirname, '../views'));
app.set('view engine', 'ejs');

// Routes
app.use('/', indexRoutes);
app.use('/api', apiRoutes);

// Seed database on server start
seedFirestore();

// Start Server
if (process.env.NODE_ENV !== 'test') {
    app.listen(PORT, () => {
        console.log(`==================================================`);
        console.log(`🚀 AquaAura Node.js / Express Server is running!`);
        console.log(`🌐 Local URL: http://localhost:${PORT}`);
        console.log(`==================================================`);
    });
}

export default app;
