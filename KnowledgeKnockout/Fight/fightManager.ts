import { User } from '../user/User';
import { Fight } from './Fight';
import { asyncTimeout } from '../helpers';

export class FightManager {
    public static searchingUsers: User[] = [];
    private static isInitialized: boolean = false;

    public static initialize(): void {
        if (FightManager.isInitialized === true) return; 

        //setInterval(FightManager.createMatches, 5000);
        FightManager.createMatches();
        FightManager.isInitialized = true;
    }

    private static async createMatches(): Promise<void> {
        FightManager.searchingUsers = FightManager.searchingUsers.filter(user => user.isSearchingMatch);
        const sortedUsers = FightManager.searchingUsers.sort((a, b) => a.avatarTotalLevel - b.avatarTotalLevel);
        
        for (let i = sortedUsers.length - 1; i > 0; i -= 2) {
            if (i - 1 >= 0) {

                console.log(sortedUsers[i] instanceof User);

                console.log(`creating match: ${sortedUsers[i]} vs. ${sortedUsers[i-1]}`);

                //let fight = new Fight([sortedUsers[i].getId(), sortedUsers[i - 1].getId()]);

                //console.log(`match created: ${fight.players.join(' vs. ')}`);

                sortedUsers[i].isSearchingMatch = sortedUsers[i - 1].isSearchingMatch = false;
            }
        }

        await asyncTimeout(5000);

        FightManager.createMatches();
    }
}