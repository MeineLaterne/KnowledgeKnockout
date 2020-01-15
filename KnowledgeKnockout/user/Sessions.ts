import { User } from './User';

export class Users {
    public static users: Map<string, User> = new Map();
    public static get(sessionID: string): any {
        return Users.users.get(sessionID);
    }
    public static add(session: any) {
        Users.users.set(session.id, session);
    }
    public static remove(sessionID: string) {
        Users.users.delete(sessionID);
    }
}