import { Injectable } from '@angular/core';
import { ApiService } from '../../service/api.service';
import { User } from './user.model';
import { ApiUserResponse, UserBody } from './api-user.interface';
import { RoleService } from '../role-package/role.service';
import { Role } from '../role-package/role.model';
import { BehaviorSubject, Subject } from 'rxjs';

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
    }

    public getUsers(): BehaviorSubject<User[]> {
        if (Object.values(this.userCache).length === this.allUsers.getValue().length) {
            return this.allUsers;
        }

        this.apiService.get('/users', {}).subscribe((usersResponse: ApiUserResponse[]) => {
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

    public getCurrentUser(): BehaviorSubject<User> {
        return this.currentUser;
    }

    public setCurrentUser(user: User): void {
        this.currentUser.next(user);
    }

    public makeUser(value: ApiUserResponse): User {

        const user = new User();
        user.setId(value.id);
        user.setFirstName(value.firstName);
        user.setInsertion(value.insertion);
        user.setLastName(value.lastName);
        user.setEmail(value.email);
        user.setFunction(value.function);
        user.setRole(this.roleService.makeRole(value.role));

        this.userCache[user.getId()] = user;
        return user;
    }
}
