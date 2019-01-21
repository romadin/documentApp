import { Injectable } from '@angular/core';
import { ApiService } from '../../service/api.service';
import { User } from './user.model';
import { ApiUserResponse } from './api-user.interface';
import { RoleService } from '../role-package/role.service';
import { Role } from '../role-package/role.model';
import { Subject } from 'rxjs';

interface UserCache {
    [id: number]: Subject<User>;
}

@Injectable()
export class UserService {
    private currentUser: Subject<User> = new Subject();
    private apiService: ApiService;
    private userCache: UserCache = {};

    constructor(apiService: ApiService, private roleService: RoleService) {
        this.apiService = apiService;
    }

    public getUserById(id: number): Subject<User> {
        if ( this.userCache[id] ) {
            return this.userCache[id];
        }
        const subject: Subject<User> = new Subject();
        this.apiService.get('/users/' + id, {}).subscribe((value: ApiUserResponse) => {
            subject.next(this.makeUser(value, subject));
        });
        return subject;
    }

    public getCurrentUser(): Subject<User> {
        return this.currentUser;
    }

    public setCurrentUser(user: User): void {
        this.currentUser.next(user);
    }

    public makeUser(value: ApiUserResponse, subject): User {

        const user = new User();
        user.setId(value.id);
        user.setFirstName(value.firstName);
        user.setInsertion(value.insertion);
        user.setLastName(value.lastName);
        user.setEmail(value.email);

        // give user role
        this.roleService.getRoleById(value.role_id).then((role: Role) => {
            user.setRole(role);
            subject.next(user);
        });
        this.userCache[user.getId()] = subject;
        return user;
    }
}
