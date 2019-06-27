import { Injectable } from '@angular/core';
import { ActivatedRoute, ActivatedRouteSnapshot, Resolve, Router } from '@angular/router';
import { EMPTY, Observable, of } from 'rxjs';
import { mergeMap } from 'rxjs/operators';
import { Company } from '../../shared/packages/company-package/company.model';

import { Organisation } from '../../shared/packages/organisation-package/organisation.model';
import { ProjectService } from '../../shared/packages/project-package/project.service';
import { WorkFunction } from '../../shared/packages/work-function-package/work-function.model';
import { UserService } from '../../shared/packages/user-package/user.service';
import { User } from '../../shared/packages/user-package/user.model';

export interface ChildItemPackage {
    currentUser: User;
    parent: WorkFunction | Company;
    mainFunction: WorkFunction;
}

@Injectable({
  providedIn: 'root'
})
export class WorkFunctionPackageResolverService implements Resolve<Observable<ChildItemPackage> | Observable<never>> {

    constructor(
        private projectService: ProjectService,
        private userService: UserService,
        private activatedRoute: ActivatedRoute,
        private router: Router,
    ) { }

    resolve(route: ActivatedRouteSnapshot): Observable<ChildItemPackage | never> {
        const workFunctionId: number = parseInt(
            route.paramMap.get('id') !== null ? route.paramMap.get('id') : route.parent.paramMap.get('id'),
            10
        );
        const projectId: number = parseInt(location.pathname.split('/')[2], 10);
        const organisation: Organisation = route.parent.data.organisation;
        const functionPackage: ChildItemPackage = { currentUser: null, mainFunction: null, parent: null};

        return this.projectService.getProject(projectId, organisation).pipe(
            mergeMap( project => {
                if (project) {
                    (<WorkFunction>functionPackage.parent) = project.workFunctions.find(w => w.id === workFunctionId);
                    functionPackage.mainFunction = project.workFunctions.find(w => w.isMainFunction);

                    functionPackage.currentUser = this.userService.getCurrentUser().getValue();
                    return of(functionPackage);
                } else { // no organisation
                    this.router.navigate(['not-found/organisation']);
                    return EMPTY;
                }
            })
        );
    }
}
