import { Action } from 'routing-controllers';
import { Connection } from 'typeorm';


export function currentUserChecker(connection: Connection): (action: Action) => Promise<CurrentUser> {
    return async function innerCurrentUserChecker(action: Action): Promise<CurrentUser> {
        return action.request.currentUser;
    };
}