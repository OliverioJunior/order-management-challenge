import 'dotenv/config';
import express from 'express';
import connectDB from './config/database';
import statusRoutes from './routes/statusRoutes.ts';
import userRoutes from './routes/userRoutes.ts';
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.get('/', (req, res) => {

    res.json({ message: 'Express + TypeScript Server' });
});

app.use('/status', statusRoutes);
app.use('/users', userRoutes);
connectDB();

export default app;
