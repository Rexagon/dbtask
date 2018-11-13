import { Request, Response } from 'express';

import db from '@/db';

export const getUsers = (req: Request, res: Response) => {
    const users = db.query('SELECT * FROM users');
}