import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiService } from '../../service/api.service';
import { DocumentService } from '../document-package/document.service';
import { FolderService } from '../folder-package/folder.service';
import { Project } from '../project-package/project.model';
import { CompanyApiPostData, CompanyApiResponseInterface, CompanyApiUpdateData } from './interface/company-api-response.interface';
import { Company } from './company.model';

interface CompanyCacheObservable {
    [id: number]: BehaviorSubject<Company[]>;
}
@Injectable()
export class CompanyService {
    private path = '/companies';
    private companiesByProjectCache: CompanyCacheObservable = {};
    constructor(
        private apiService: ApiService,
        private foldersService: FolderService,
        private documentService: DocumentService,
    ) {}

    makeCompany(data: CompanyApiResponseInterface): Company {
        const company = new Company();
        company.id = data.id;
        company.name = data.name;
        company.folders = this.foldersService.getFoldersByCompany(company);
        company.documents = this.documentService.getDocumentsByCompany(company);
        company.items = company.getItems();
        return company;
    }

    getCompaniesByProject(project: Project): BehaviorSubject<Company[]> {
        if (this.companiesByProjectCache[project.id]) {
            return this.companiesByProjectCache[project.id];
        }

        const params = { 'projectsId[]': project.id};
        const newSubject: BehaviorSubject<Company[]> = new BehaviorSubject<Company[]>(null);
        this.apiService.get(this.path, params).subscribe(
            results => newSubject.next(results.map(result => this.makeCompany(result)))
        );
        this.companiesByProjectCache[project.id] = newSubject;
        return this.companiesByProjectCache[project.id];
    }

    createCompany(body: CompanyApiPostData, projectsId: number[]): Observable<Company> {
        return this.apiService.post(this.path, body).pipe(map(result => {
            const company = this.makeCompany(result);
            this.updateCache(company, projectsId);
            return company;
        }));
    }

    updateCompany(company: Company, body: CompanyApiUpdateData, projectsId: number[]): Observable<Company> {
        return this.apiService.post(this.path + '/' + company.id, body).pipe(map(result => {
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
