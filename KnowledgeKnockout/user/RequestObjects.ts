import { Request } from "express";

export class RequestObjects {
    public static requests: Map<string, Request> = new Map();
    public static get(sessionID: string): any {
        return RequestObjects.requests.get(sessionID);
    }
    public static set(req: Request) {
        if (req.session) RequestObjects.requests.set(req.session.id, req);
    }
    public static remove(sessionID: string) {
        RequestObjects.requests.delete(sessionID);
    }
}