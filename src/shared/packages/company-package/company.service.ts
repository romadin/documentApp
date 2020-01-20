import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';
import {
    ConfirmPopupComponent,
    ConfirmPopupData
} from '../../../construction-information-management-app/popups/confirm-popup/confirm-popup.component';
import { ApiService } from '../../service/api.service';
import { ToastService } from '../../toast.service';
import { DocumentService } from '../document-package/document.service';
import { Project } from '../project-package/project.model';
import { WorkFunction } from '../work-function-package/work-function.model';
import {
    CompanyApiPostData,
    CompanyApiResponseInterface,
    CompanyApiUpdateData,
    CompanyDeleteParam
} from './interface/company-api-response.interface';
import { Company } from './company.model';

interface CompaniesCacheObservable {
    [id: number]: BehaviorSubject<Company[]>;
}
interface CompanyCacheObservable {
    [id: number]: BehaviorSubject<Company>;
}
@Injectable()
export class CompanyService {
    updateCacheObject = false;
    private path = '/companies';
    private companiesByProjectCache: CompaniesCacheObservable = {};
    private companiesByIdCache: CompanyCacheObservable = {};
    constructor(
        private apiService: ApiService,
        private documentService: DocumentService,
        private toast: ToastService,
        private dialog: MatDialog,
    ) {}

    getCompaniesByProject(project: Project, workFunction?: WorkFunction): BehaviorSubject<Company[]> {
        if (this.companiesByProjectCache[project.id] && !this.updateCacheObject) {
            if (workFunction) {
                this.companiesByProjectCache[project.id].getValue().map(c => {
                    /* if the parent has changed that means that there are other documents linked to the companies*/
                    if (c.parent !== workFunction) {
                        c.parent = workFunction;
                        c.documents = this.documentService.getDocumentsByCompany(c);
                    }
                    return c;
                });
            }
            return this.companiesByProjectCache[project.id];
        }

        const params = { 'projectsId[]': project.id};
        const newSubject: BehaviorSubject<Company[]> = new BehaviorSubject<Company[]>(null);
        this.apiService.get(this.path, params).subscribe(
            results => {
                newSubject.next(results.map(result => this.makeCompany(result, workFunction)));
                this.updateCacheObject = false;
            }
        );
        this.companiesByProjectCache[project.id] = newSubject;
        return this.companiesByProjectCache[project.id];
    }

    createCompany(body: CompanyApiPostData, projectsId: number[], workFunction?: WorkFunction): Observable<Company> {
        return this.apiService.post(this.path, body).pipe(map(result => {
            const company = this.makeCompany(result, workFunction);
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

    deleteCompany(company, workFunction: WorkFunction): Observable<boolean> {
        const popupData: ConfirmPopupData = {
            title: 'Bedrijf verwijderen',
            name: company.name,
            message: `Weet u zeker dat u <strong>${company.name}</strong> wilt verwijderen`,
            firstButton: 'ja',
            secondButton: 'nee'
        };
        const params = {workFunctionId: workFunction.id};

        return this.dialog.open(ConfirmPopupComponent, {width: '400px', data: popupData}).afterClosed().pipe(mergeMap((action: boolean) => {
            if (action) {
                return this.apiService.delete(this.path + '/' + company.id, params).pipe(map(result => {
                    this.toast.showSuccess('Bedrijf: ' + company.name + ' is verwijderd', 'Verwijderd');
                    if (result === 'Company deleted' && this.companiesByProjectCache[workFunction.parent.id]) {
                        const companies = this.companiesByProjectCache[workFunction.parent.id].getValue();
                        companies.splice(companies.findIndex(c => c.id === company.id), 1);
                        this.companiesByProjectCache[workFunction.parent.id].next(companies);
                    }
                    return true;
                }));
            }
            return of(false);
        }));
    }

    makeCompany(data: CompanyApiResponseInterface, parent: WorkFunction = null): Company {
        const company = new Company();
        company.id = data.id;
        company.name = data.name;
        company.parent = parent;
        if (parent) {
            company.documents = this.documentService.getDocumentsByCompany(company);
        }
        return company;
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
