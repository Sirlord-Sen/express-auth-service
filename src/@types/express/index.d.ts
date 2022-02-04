type CurrentUser = {
    email: string,
    userId: string
}

declare global{
    namespace Express {
        interface Request {
            currentUser?: CurrentUser
        }
    }
}
