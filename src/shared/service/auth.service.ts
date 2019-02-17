import { Injectable } from '@angular/core';
import { ApiAuthResponse } from '../../construction-information-management-app/authenticate-app/interfaces/api-auth.interface';
import { ApiService } from './api.service';
import { UserService } from '../packages/user-package/user.service';

@Injectable()
export class AuthService {
    private apiService: ApiService;

    constructor(apiService: ApiService, private userService: UserService) {
        this.apiService = apiService;
    }

    /**
     * login a user with the given data.
     */
    public AuthenticateUser(userName: string, password: string): Promise<boolean | string> {

        const body = {
            email: userName,
            password: password
        };

        return new Promise((resolve) => {
            this.apiService.postAuthenticate( '/authenticate', body).subscribe((value: ApiAuthResponse) => {
                this.userService.getUserById(value.user_id).subscribe(user => {
                    this.userService.setCurrentUser(user);
                    localStorage.setItem('token', value.token);
                });
                resolve(true);
            },  (error) => {
                resolve(error.error);
            });
        });
    }

}
