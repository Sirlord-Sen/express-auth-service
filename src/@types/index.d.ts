type CurrentUser = {
    email: string,
    userId: string
}

declare namespace Express {
    export interface Request {
        currentUser: CurrentUser,
        params: any;
    }
}