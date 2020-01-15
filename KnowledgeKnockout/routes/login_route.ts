import { Request, Response } from 'express';
import { resolve } from 'path';
import { Authentication } from '../user/Authentication';
import { User } from '../user/User';

export async function login_route_get(req: Request, res: Response) {
    res.sendFile(resolve('./public/HMTL_CSS/html/login.html'));
}

export async function login_route_post(req: Request, res: Response) {
    if (req.body.name && req.body.password && req.session && !req.session.user) {
        
        req.session.user = await Authentication.login(req.body.name, req.body.password);
        if (req.session.user) {
            req.session.user.sessionID = req.session.id;

            console.log(`user ${req.session.user.id} is User: ${req.session.user instanceof User}`);
            const sessionUser = req.session.user;
            console.log(`user ${sessionUser.id} is User: ${sessionUser instanceof User}`);
        }
    }

    res.send(!!req.session?.user);
}