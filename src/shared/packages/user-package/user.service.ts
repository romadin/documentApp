import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';

import { ApiUserResponse, EditUserBody, UserBody } from './api-user.interface';
import { ApiService } from '../../service/api.service';
import { RoleService } from '../role-package/role.service';
import { User } from './user.model';
import { map } from 'rxjs/operators';

interface ActivationParams {
    params: { activationToken: string; };
}

interface UserCache {
    [id: number]: User;
}

@Injectable()
export class UserService {
    private currentUser: BehaviorSubject<User> = new BehaviorSubject(null);
    private userCache: UserCache = {};
    private allUsers: BehaviorSubject<User[]> = new BehaviorSubject([]);

    constructor(private apiService: ApiService, private roleService: RoleService, private router: Router) {
        const user: ApiUserResponse = JSON.parse(sessionStorage.getItem('currentUser'));
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
        }, (error: HttpErrorResponse) => {
            if (error.status === 401 && error.error === 'Unauthorized.') {
                this.router.navigate(['/login']);
            }
        });

        return this.allUsers;
    }

    public getUserById(id: number): Subject<User> {
        const subject: BehaviorSubject<User> = new BehaviorSubject(null);

        if ( this.userCache[id] ) {
            subject.next(this.userCache[id]);
            return subject;
        }
        this.apiService.get('/users/' + id, {}).subscribe((value: ApiUserResponse) => {
            subject.next(this.makeUser(value));
        });

        return subject;
    }

    public getUserByIdActivationCode(activationToken: string): Observable<User> {
        return this.apiService.noTokenGet('/users/activate',  { params: {activationToken: activationToken}})
            .pipe( map( user => this.makeUser(user)) );
    }

    public activateUser( user: User, body: EditUserBody, params: ActivationParams ): Subject<User> {
        const subject: Subject<User> = new Subject();
        this.apiService.noTokenPost('/users/' + user.id, body, params).subscribe((value: ApiUserResponse) => {
            this.updateUser(user, value);
            subject.next(user);
        });
        return subject;
    }

    public getUserImage(id: number): BehaviorSubject<Blob> {
        const subject: BehaviorSubject<Blob> = new BehaviorSubject(null);

        this.apiService.getBlob('/users/' + id + '/image', {}).subscribe((value: Blob) => {
            subject.next(value);
        });

        return subject;
    }

    public postUser(body: FormData): Subject<User> {
        const subject: Subject<User> = new Subject();
        this.apiService.post('/users', body).subscribe((value: ApiUserResponse) => {
            subject.next(this.makeUser(value));
            this.allUsers.next(Object.values(this.userCache));
        });
        return subject;
    }

    public editUser( user: User, body: EditUserBody ): Subject<User> {
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

        if (value.hasImage) {
            user.image = this.getUserImage(user.id);
        }

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
