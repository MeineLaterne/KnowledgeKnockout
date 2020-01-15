import { Request, Response } from 'express';
import { Users } from '../user/Sessions';
import { render } from '../views/render';

export async function match_route_get(req: Request, res: Response) {
    res.send(await render(['match'], {
        title: 'match'
    }));
}

export async function match_route_post(req: Request, res: Response) {
    if (req.session?.user && typeof req.body.isSearchingMatch === 'boolean') {
        req.session.user.isSearchingMatch = req.body.isSearchingMatch;
    }

    if (req.session) console.log(Users.get(req.session.id), req.session);
    res.send(!!req.session?.user?.isInMatch);
}