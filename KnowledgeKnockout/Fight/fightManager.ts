import { Users } from '../user/Sessions';
import { Fight } from './fight';

export class FightManager {
    public static initialize(): void {
        setInterval(FightManager.createMatches, 5000);
    }
    private static createMatches(): void {
        const searchingUsers = [...Users.users.values()];

        const sortedUsers = searchingUsers.sort((a, b) => a.avatarTotalLevel - b.avatarTotalLevel);
        for (let i = sortedUsers.length - 1; i > 0; i -= 2) {
            if (i - 1 >= 0) {
                console.log('creating match');
                new Fight([sortedUsers[i].sessionID, sortedUsers[i - 1].sessionID]);
                sortedUsers[i].isSearchingMatch = sortedUsers[i - 1].isSearchingMatch = false;
            }
        }
    }
}