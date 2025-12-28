import { Router, type Request, type Response } from 'express';

const router = Router();

router.get('/', (req: Request, res: Response) => {
    res.json({
        users: [{
            id: 1,
            name: 'John Doe',
            email: 'john.doe@example.com',
        }]
    });
});

export default router;
