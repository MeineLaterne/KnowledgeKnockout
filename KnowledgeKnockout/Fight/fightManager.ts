import { User } from "../user/User";
import { Fight } from "./fight";

export class FightManager {
    public static searchingUsers: User[];

    public static initialize(): void {
        setInterval(FightManager.createMatches, 5000);
    }

    private static createMatches(): void {
        FightManager.searchingUsers = FightManager.searchingUsers.filter(searchingUser => searchingUser.isSearchingMatch);
        const sortedUsers = FightManager.searchingUsers.slice().sort((a, b) => a.avatarTotalLevel - b.avatarTotalLevel);
        for (let i = sortedUsers.length - 1; i > 0; i -= 2) {
            if (i - 1 >= 0) {
                new Fight([sortedUsers[i], sortedUsers[i - 1]]);
                sortedUsers[i].isSearchingMatch = sortedUsers[i - 1].isSearchingMatch = false;
                FightManager.searchingUsers.splice(i - 1, 2);
            }            
        }
    }
}