import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, Router } from '@angular/router';
import { UserService } from './user.service';
import { mergeMap } from 'rxjs/operators';
import { EMPTY, Observable, of } from 'rxjs';
import { UserActivation } from '../../../construction-information-management-app/user-app/activate-user/activate-user.component';


@Injectable()
export class UserResolver implements Resolve<Observable<UserActivation> | Observable<never>> {

    constructor(private userService: UserService, private router: Router) {}

    resolve(route: ActivatedRouteSnapshot): Observable<UserActivation> | Observable<never> {
        const activationToken: string = route.params.token;

        return this.userService.getUserByIdActivationCode(activationToken).pipe(
            mergeMap(user => {
                if (user) {
                    (<UserActivation>user).activationToken = activationToken;
                    return of(<UserActivation>user);
                } else { // id not found
                    this.router.navigate(['/login']);
                    return EMPTY;
                }
            })
        );
    }
}
