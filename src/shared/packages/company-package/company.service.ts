import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiService } from '../../service/api.service';
import { Project } from '../project-package/project.model';
import { CompanyApiPostData, CompanyApiResponseInterface } from './company-api-response.interface';
import { Company } from './company.model';

interface CompanyCacheObservable {
    [id: number]: BehaviorSubject<Company[]>;
}
@Injectable()
export class CompanyService {
    private path = '/companies';
    private companiesByProjectCache: CompanyCacheObservable = {};
    constructor(private apiService: ApiService) {}

    static makeCompany(data: CompanyApiResponseInterface): Company {
        const company = new Company();
        company.id = data.id;
        company.name = data.name;

        return company;
    }

    getCompaniesByProject(project: Project): BehaviorSubject<Company[]> {
        if (this.companiesByProjectCache[project.id]) {
            return this.companiesByProjectCache[project.id];
        }

        const params = { 'projectsId[]': project.id};
        const newSubject: BehaviorSubject<Company[]> = new BehaviorSubject<Company[]>(null);
        this.apiService.get(this.path, params).subscribe(
            results => newSubject.next(results.map(result => CompanyService.makeCompany(result)))
        );
        this.companiesByProjectCache[project.id] = newSubject;
        return this.companiesByProjectCache[project.id];
    }

    createCompany(body: CompanyApiPostData, projectsId: number[]): Observable<Company> {
        return this.apiService.post(this.path, body).pipe(map(result => {
            const company = CompanyService.makeCompany(result);
            this.updateCache(company, projectsId);
            return company;
        }));
    }

    private updateCache(company: Company, projectsId: number[]): void {
        projectsId.forEach((projectId) => {
            if (this.companiesByProjectCache[projectId]) {
                const companies = this.companiesByProjectCache[projectId].getValue();
                const replaceCompanyIndex = companies.findIndex(c => c.id === company.id);
                replaceCompanyIndex !== -1 ? companies[replaceCompanyIndex] = company : companies.push(company);
                this.companiesByProjectCache[projectId].next(companies);
            }
        });
    }

}
