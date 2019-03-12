import { Injectable } from '@angular/core';
import { ApiAuthResponse } from '../../construction-information-management-app/login-app/interfaces/api-auth.interface';
import { ApiService } from './api.service';
import { UserService } from '../packages/user-package/user.service';
import { User } from '../packages/user-package/user.model';
import { Subject, Subscriber } from 'rxjs';

@Injectable()
export class AuthService {
    private apiService: ApiService;

    constructor(apiService: ApiService, private userService: UserService) {
        this.apiService = apiService;
    }

    private static setCurrentUserInSessionStorage(user: User): void {
        const publicUser = {
            id: user.id,
            firstName: user.firstName,
            insertion: user.insertion,
            lastName: user.lastName,
            email: user.email,
            function: user.function,
            role: { id: user.role.getId(), name: user.role.getName() } ,
            projectsId: user.projectsId,
        };

        sessionStorage.setItem('currentUser', JSON.stringify(publicUser));
    }

    /**
     * login a user with the given data.
     */
    public AuthenticateUser(userName: string, password: string): Subject<boolean | string> {
        const authSubscription: Subject<boolean | string> = new Subject<boolean | string>();
        const body = {
            email: userName,
            password: password
        };

        this.apiService.postAuthenticate( '/authenticate', body).subscribe((value: ApiAuthResponse) => {
            this.userService.getUserById(value.user_id).subscribe(user => {
                if ( user ) {
                    /** We set the current user in the auth service because this the user trying to log in. */
                    if ( ! sessionStorage.getItem('currentUser')) {
                        AuthService.setCurrentUserInSessionStorage(user);
                    }
                    this.userService.setCurrentUser(user);
                    sessionStorage.setItem('token', value.token);
                    authSubscription.next(true);
                }
            });
        },  (error) => {
            authSubscription.next(error.error);
        });

        return authSubscription;
    }

}
