import { Request, Response } from 'express';
import { resolve } from 'path';
import { User } from '../user/User';

export async function mainpage_route_get(req: Request, res: Response) {
    res.sendFile(resolve('./public/HTML_CSS/html/mainpage.html'));
}

export async function mainpage_route_post(req: Request, res: Response): Promise<void> {
    console.log(req.body);
}

