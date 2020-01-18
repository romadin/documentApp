import { Injectable } from '@angular/core';
import { ActivatedRoute, ActivatedRouteSnapshot, Resolve, Router } from '@angular/router';
import { EMPTY, Observable, of } from 'rxjs';
import { Company } from '../../../shared/packages/company-package/company.model';
import { ProjectService } from '../../../shared/packages/project-package/project.service';
import { UserService } from '../../../shared/packages/user-package/user.service';
import { HeaderWithFolderCommunicationService } from '../../../shared/service/communication/HeaderWithFolder.communication.service';

@Injectable({
  providedIn: 'root'
})
export class CompanyPackageResolverService implements Resolve<Observable<Company> | Observable<never>> {

    constructor(
        private projectService: ProjectService,
        private userService: UserService,
        private activatedRoute: ActivatedRoute,
        private router: Router,
        private headerCommunicationService: HeaderWithFolderCommunicationService,
    ) { }

    resolve(route: ActivatedRouteSnapshot): Observable<Company | never> {
        const workFunction = route.parent.data.parent;

        const companyId: number = parseInt(route.paramMap.get('id'), 10 );
        const currentCompany: Company = workFunction.companies.find(c => c.id === companyId);

        if (currentCompany) {
            this.headerCommunicationService.headerTitle.next(currentCompany.name);

            return of(currentCompany);
        } else { // no organisation
            this.router.navigate(['not-found/organisation']);
            return EMPTY;
        }
    }
}
