import { Injectable } from '@angular/core';
import { ActivatedRoute, ActivatedRouteSnapshot, Resolve, Router } from '@angular/router';
import { combineLatest, EMPTY, forkJoin, Observable, of } from 'rxjs';
import { first, map, mergeMap, switchMap, take } from 'rxjs/operators';
import { Company } from '../../shared/packages/company-package/company.model';

import { Organisation } from '../../shared/packages/organisation-package/organisation.model';
import { ProjectService } from '../../shared/packages/project-package/project.service';
import { WorkFunction } from '../../shared/packages/work-function-package/work-function.model';
import { UserService } from '../../shared/packages/user-package/user.service';
import { User } from '../../shared/packages/user-package/user.model';
import { HeaderWithFolderCommunicationService } from '../../shared/service/communication/HeaderWithFolder.communication.service';
import { Project } from '../../shared/packages/project-package/project.model';

export interface ChildItemPackage {
    currentUser: User;
    parent: WorkFunction | Company;
    mainFunction: WorkFunction;
}

@Injectable({
  providedIn: 'root'
})
export class WorkFunctionPackageResolverService implements Resolve<WorkFunction | Observable<never>> {

    constructor(
        private projectService: ProjectService,
        private userService: UserService,
        private activatedRoute: ActivatedRoute,
        private router: Router,
        private headerCommunicationService: HeaderWithFolderCommunicationService,
    ) { }

    resolve(route: ActivatedRouteSnapshot) {
        let routeParent = route.parent;
        let project: Project;
        while (!project) {
            project = routeParent.data.project;
            routeParent = routeParent.parent;
        }
        const currentWorkFunctionId = parseInt(route.params.id, 10);

        return project.workFunctions.pipe(first(v => v !== undefined)).pipe(
            map( workFunctions => {
                if (workFunctions) {
                    const parent = workFunctions.find(w => w.id === currentWorkFunctionId);
                    this.headerCommunicationService.headerTitle.next(parent.name);
                    return parent;
                } else { // no project
                    this.router.navigate(['not-found/organisation']);
                    return EMPTY;
                }
            })
        );
    }
}
