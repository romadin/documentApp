import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';

import { ApiUserResponse, EditUserBody, UserBody } from './api-user.interface';
import { ApiService } from '../../service/api.service';
import { RoleService } from '../role-package/role.service';
import { User } from './user.model';

interface UserCache {
    [id: number]: User;
}

@Injectable()
export class UserService {
    private currentUser: BehaviorSubject<User> = new BehaviorSubject(null);
    private apiService: ApiService;
    private userCache: UserCache = {};
    private allUsers: BehaviorSubject<User[]> = new BehaviorSubject([]);

    constructor(apiService: ApiService, private roleService: RoleService) {
        this.apiService = apiService;
        const user: ApiUserResponse = JSON.parse(localStorage.getItem('currentUser'));
        if ( user ) {
            this.setCurrentUser(this.makeUser(user));
        }
    }

    public getUsers(options?): BehaviorSubject<User[]> {
        const params = options ? options : {};
        if (Object.values(this.userCache).length === this.allUsers.getValue().length) {
            return this.allUsers;
        }

        this.apiService.get('/users', params).subscribe((usersResponse: ApiUserResponse[]) => {
            const usersArray: User[] = [];

            usersResponse.forEach((user) => {
                usersArray.push(this.makeUser(user));
            });
            this.allUsers.next(usersArray);
        });

        return this.allUsers;
    }

    public getUserById(id: number): Subject<User> {
        const subject: Subject<User> = new Subject();

        if ( this.userCache[id] ) {
            subject.next(this.userCache[id]);
            return subject;
        }
        this.apiService.get('/users/' + id, {}).subscribe((value: ApiUserResponse) => {
            /** We do the check here because the first user we are getting is the user trying to log in.  */
            if ( ! localStorage.getItem('currentUser')) {
                localStorage.setItem('currentUser', JSON.stringify(value));
            }
            subject.next(this.makeUser(value));
        });

        return subject;
    }

    public postUser(body: UserBody): Subject<User> {
        const subject: Subject<User> = new Subject();
        this.apiService.post('/users', body).subscribe((value: ApiUserResponse) => {
            subject.next(this.makeUser(value));
            this.allUsers.next(Object.values(this.userCache));
        });
        return subject;
    }

    public editUser( user: User, body: EditUserBody): Subject<User> {
        const subject: Subject<User> = new Subject();
        this.apiService.post('/users/' + user.id, body).subscribe((value: ApiUserResponse) => {
            this.updateUser(user, value);
            subject.next(user);
        });
        return subject;
    }

    public getCurrentUser(): BehaviorSubject<User> {
        return this.currentUser;
    }

    public setCurrentUser(user: User): void {
        this.currentUser.next(user);
    }

    public makeUser(value: ApiUserResponse): User {
        const user = new User();
        user.id = value.id;
        user.firstName = value.firstName;
        user.insertion = value.insertion;
        user.lastName = value.lastName;
        user.email = value.email;
        user.function = value.function;
        user.role = this.roleService.makeRole(value.role);
        user.projectsId = value.projectsId;

        this.userCache[user.id] = user;
        return user;
    }

    private updateUser(user: User, value: ApiUserResponse): void {
        user.id = value.id;
        user.firstName = value.firstName;
        user.insertion = value.insertion;
        user.lastName = value.lastName;
        user.email = value.email;
        user.function = value.function;
        user.projectsId = value.projectsId;
    }
}
