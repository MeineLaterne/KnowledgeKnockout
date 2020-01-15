import { Request, Response } from 'express';
import { FightManager } from '../Fight/FightManager';
import { render } from '../views/render';
import { User } from '../user/User';

export async function match_route_get(req: Request, res: Response) {
    res.send(await render(['match'], {
        title: 'match'
    }));
}

export async function match_route_post(req: Request, res: Response) {
    if (req.session?.user && typeof req.body.isSearchingMatch === 'boolean') {
        req.session.user.isSearchingMatch = req.body.isSearchingMatch;

        if (req.session.user.isSearchingMatch) FightManager.searchingUsers.push(req.session.user);

        console.log(`Users still Users? ${FightManager.searchingUsers.every(u => u instanceof User)}`);

        if (FightManager.searchingUsers.length > 1) {
            FightManager.initialize();
        }
    }

    res.send({ isInMatch: !!req.session?.user?.isInMatch, isSearchingMatch: !!req.session?.user?.isSearchingMatch });
}