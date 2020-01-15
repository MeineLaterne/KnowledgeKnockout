import { User } from '../user/User';
import { Fight } from './Fight';

export class FightManager {
    public static searchingUsers: User[] = [];
    public static initialize(): void {
        setInterval(FightManager.createMatches, 5000);
    }
    private static createMatches(): void {
        FightManager.searchingUsers = FightManager.searchingUsers.filter(user => user.isSearchingMatch);
        const sortedUsers = FightManager.searchingUsers.sort((a, b) => a.avatarTotalLevel - b.avatarTotalLevel);
        console.log(FightManager.searchingUsers);
        for (let i = sortedUsers.length - 1; i > 0; i -= 2) {
            if (i - 1 >= 0) {
                console.log('creating match');
                console.log(sortedUsers);
                new Fight([sortedUsers[i], sortedUsers[i - 1]]);
                sortedUsers[i].isSearchingMatch = sortedUsers[i - 1].isSearchingMatch = false;
            }
        }
    }
}