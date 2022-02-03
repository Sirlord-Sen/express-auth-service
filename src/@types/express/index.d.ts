type CurrentUser = {
    email: string,
    userId: string
}

declare global{
    declare namespace Express {
        export interface Request {
            currentUser: CurrentUser
        }
    }
}
