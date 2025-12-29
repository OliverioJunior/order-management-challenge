import 'dotenv/config';
import express from 'express';
import connectDB from './config/database';
import statusRoutes from './routes/statusRoutes.ts';
const app = express();
app.use(express.json());

app.get('/', (req, res) => {

    res.json({ message: 'Express + TypeScript Server' });
});

app.use('/status', statusRoutes);
connectDB();

export default app;
