import { Injectable } from '@angular/core';
import { ApiService } from '../../service/api.service';
import { User } from './user';

interface UserCache {
    email: User;
}

@Injectable()
export class UserService {
    private apiService: ApiService;
    private userCache: Array<UserCache>;

    constructor(apiService: ApiService) {
        this.apiService = apiService;
    }

    public getUserByEmail(email: string): Promise<User> {

        if ( this.userCache[email] ) {
            return Promise.resolve(this.userCache[email]);
        } else {
            return new Promise<User>((resolve) => {
                this.apiService.get('/user', { email: email }).subscribe((value) => {
                    resolve(value);
                });
            });
        }

    }
}
