import { Injectable } from '@angular/core';
import { ActivatedRoute, ActivatedRouteSnapshot, Resolve, Router } from '@angular/router';
import { EMPTY, Observable, of } from 'rxjs';
import { Company } from '../../../shared/packages/company-package/company.model';
import { ProjectService } from '../../../shared/packages/project-package/project.service';
import { UserService } from '../../../shared/packages/user-package/user.service';
import { WorkFunction } from '../../../shared/packages/work-function-package/work-function.model';
import { ChildItemPackage } from '../work-function-package-resolver.service';

@Injectable({
  providedIn: 'root'
})
export class CompanyPackageResolverService implements Resolve<Observable<ChildItemPackage> | Observable<never>> {

    constructor(
        private projectService: ProjectService,
        private userService: UserService,
        private activatedRoute: ActivatedRoute,
        private router: Router,
    ) { }

    resolve(route: ActivatedRouteSnapshot): Observable<ChildItemPackage | never> {
        const companyId: number = parseInt(route.paramMap.get('id'), 10 );
        const parentPackage: ChildItemPackage = route.parent.data.functionPackage;

        const currentCompany: Company = (<WorkFunction>parentPackage.parent).companies.find(c => c.id === companyId);
        if (currentCompany) {
            return of({
                currentUser: parentPackage.currentUser,
                mainFunction: parentPackage.mainFunction,
                parent: currentCompany
            });
        } else { // no organisation
            this.router.navigate(['not-found/organisation']);
            return EMPTY;
        }
    }
}
