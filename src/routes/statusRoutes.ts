import { Router, type Request, type Response } from 'express';
import { checkDatabaseConnection } from '../utils/dbCheck';

const router = Router();

router.get('/', (req: Request, res: Response) => {
    const dbConnection = checkDatabaseConnection();

    if (dbConnection.stateCode !== 1) {
        return res.status(503).json({
            message: "Service Unavailable",
            database: dbConnection.status
        });
    }

    res.json({
        status: "OK",
        database: dbConnection.status
    });
});

export default router;