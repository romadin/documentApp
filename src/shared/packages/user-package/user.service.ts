import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { map } from 'rxjs/operators';
import { CompanyService } from '../company-package/company.service';
import { Organisation } from '../organisation-package/organisation.model';

import { ApiUserResponse, EditUserBody, isApiUserResponse } from './api-user.interface';
import { ErrorMessage } from '../../type-guard/error-message';
import { ApiDocResponse } from '../document-package/api-document.interface';
import { ApiService } from '../../service/api.service';
import { RoleService } from '../role-package/role.service';
import { User } from './user.model';

interface ActivationParams {
    params: { activationToken: string; };
}

interface UsersCache {
    [id: number]: BehaviorSubject<User[]>;
}
interface UserCache {
    [id: number]: BehaviorSubject<User>;
}
interface DeleteUserParams {
    projectId?: number;
}
export interface UserParams {
    organisationId: number;
}

export interface GetUserParams extends UserParams {
    projectId?: number;
}


@Injectable()
export class UserService {
    private currentUser: BehaviorSubject<User> = new BehaviorSubject(null);
    private usersByOrganisationCache: UsersCache = {};
    private userByIdCache: UserCache = {};

    constructor(
        private apiService: ApiService,
        private roleService: RoleService,
        private companyService: CompanyService,
        private router: Router
    ) {
        const user: ApiUserResponse = JSON.parse(sessionStorage.getItem('currentUser'));
        if ( user ) {
            this.setCurrentUser(this.makeUser(user));
        }
    }

    getUsers(params: GetUserParams): BehaviorSubject<User[]> {
        const organisationId = params.organisationId;
        if (this.usersByOrganisationCache[organisationId]) {
            return this.usersByOrganisationCache[organisationId];
        }

        this.usersByOrganisationCache[organisationId] = new BehaviorSubject<User[]>([]);
        this.apiService.get('/users', params).subscribe((usersResponse: ApiUserResponse[]) => {
            const usersArray: User[] = [];

            usersResponse.forEach((user) => {
                usersArray.push(this.makeUser(user));
            });
            this.usersByOrganisationCache[organisationId].next(usersArray);
        }, (error: HttpErrorResponse) => {
            if (error.status === 401 && error.error === 'Unauthorized.') {
                this.router.navigate(['/login']);
            }
        });

        return this.usersByOrganisationCache[organisationId];
    }

    getUserById(id: number): Subject<User> {
        if ( this.userByIdCache[id] ) {
            return this.userByIdCache[id];
        }

        this.userByIdCache[id] = new BehaviorSubject(null);
        this.apiService.get('/users/' + id, {}).subscribe((value: ApiUserResponse) => {
            const user = this.makeUser(value);
            this.userByIdCache[id].next(user);
        });

        return this.userByIdCache[id];
    }

    public getUserByIdActivationCode(activationToken: string): Observable<User> {
        return this.apiService.noTokenGet('/users/activate',   {activationToken: activationToken})
            .pipe( map( user => this.makeUser(user)) );
    }

    public activateUser( user: User, body: EditUserBody, params: ActivationParams ): Subject<User> {
        const subject: Subject<User> = new Subject();
        this.apiService.noTokenPost('/users/' + user.id, body, params).subscribe((value: ApiUserResponse) => {
            this.updateUser(user, value, true);
            subject.next(user);
        });
        return subject;
    }

    public postUser(body: FormData, params: UserParams): Subject<User | ErrorMessage> {
        const subject: Subject<User | ErrorMessage> = new Subject();
        this.apiService.post('/users', body, params).subscribe((value: ApiUserResponse | ErrorMessage) => {
            if (isApiUserResponse(value)) {
                const user = this.makeUser(value);
                subject.next(user);
                const users = this.usersByOrganisationCache[params.organisationId].getValue();
                users.push(user);
                this.usersByOrganisationCache[params.organisationId].next(users);
            } else {
                subject.next(value);
            }
        });
        return subject;
    }

    public editUser( user: User, body: FormData ): Subject<User | ErrorMessage> {
        const subject: Subject<User | ErrorMessage> = new Subject();
        this.apiService.post('/users/' + user.id, body).subscribe((value: ApiUserResponse | ErrorMessage) => {
            if (isApiUserResponse(value)) {
                this.updateUser(user, value);
                subject.next(user);
            } else {
                subject.next(value);
            }
        });
        return subject;
    }

    public getCurrentUser(): BehaviorSubject<User> {
        return this.currentUser;
    }

    public setCurrentUser(user: User): void {
        this.currentUser.next(user);
    }

    public deleteUser(user: User, params: DeleteUserParams, organisation: Organisation): Subject<boolean> {
        const deleted: Subject<boolean> = new Subject<boolean>();
        this.apiService.delete('/users/' + user.id, params).subscribe((response: ApiDocResponse) => {
            if (response) {
                if (this.usersByOrganisationCache[organisation.id]) {
                    const users = this.usersByOrganisationCache[organisation.id].getValue();
                    if (!params.projectId) {
                        users.splice(users.findIndex((u) => u === user), 1);
                    }
                    this.usersByOrganisationCache[organisation.id].next(users);
                }

                deleted.next(true );
            }
        });
        return deleted;
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
        user.phoneNumber = value.phoneNumber;

        if (value.company) {
            user.company = this.companyService.makeCompany(value.company);
        }
        if (value.hasImage) {
            user.image = this.getUserImage(user.id);
        }

        return user;
    }

    private updateUser(user: User, value: ApiUserResponse, activate?: boolean): void {
        user.id = value.id;
        user.firstName = value.firstName;
        user.insertion = value.insertion;
        user.lastName = value.lastName;
        user.email = value.email;
        user.function = value.function;
        user.projectsId = value.projectsId;
        user.phoneNumber = value.phoneNumber;
        if (activate) {
            return;
        }
        if (value.hasImage) {
            user.image = this.getUserImage(user.id);
        }
    }

    private getUserImage(id: number): BehaviorSubject<Blob> {
        const subject: BehaviorSubject<Blob> = new BehaviorSubject(null);

        this.apiService.getBlob('/users/' + id + '/image', {}).subscribe((value: Blob) => {
            subject.next(value);
        });

        return subject;
    }
}
