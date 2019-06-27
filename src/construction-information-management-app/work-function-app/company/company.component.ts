import { animate, keyframes, state, style, transition, trigger } from '@angular/animations';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { ActivatedRoute } from '@angular/router';
import { Company } from '../../../shared/packages/company-package/company.model';
import { CompanyService } from '../../../shared/packages/company-package/company.service';
import { Project } from '../../../shared/packages/project-package/project.model';
import { User } from '../../../shared/packages/user-package/user.model';
import { WorkFunction } from '../../../shared/packages/work-function-package/work-function.model';
import { WorkFunctionService } from '../../../shared/packages/work-function-package/work-function.service';
import { HeaderWithFolderCommunicationService } from '../../../shared/service/communication/HeaderWithFolder.communication.service';
import { UsersCommunicationService } from '../../../shared/service/communication/users-communication.service';
import { CompanyPopupComponent, CompanyPopupData } from '../../popups/company-popup/company-popup.component';
import { ChildItemPackage } from '../work-function-package-resolver.service';

@Component({
    selector: 'cim-company',
    templateUrl: './company.component.html',
    styleUrls: ['./company.component.css'],
    animations: [
        trigger('toggleInView', [
            state('close', style({
                transform: 'translateX(110%)'
            })),
            state('open', style({
                width: '48%',
                transform: 'translateX(0)'
            })),
            transition('close => open', [
                animate('300ms cubic-bezier(0.0, 0.0, 0.2, 1)')
            ]),
            transition('open => close', [
                animate('300ms cubic-bezier(0.0, 0.0, 0.2, 1)', keyframes([
                    style({ transform: 'translateX(5%)', offset: 0.1}),
                    style({ transform: 'translateX(10%)', offset: 0.8}),
                    style({ transform: 'translateX(110%)', offset: 1}),
                ]))
            ]),
            transition('void => *', [
                style({ opacity: '0'}),
                animate('100ms cubic-bezier(0.0, 0.0, 0.2, 1)', style({ opacity: '1'})),
            ]),
            transition('* => void', [
                animate('100ms cubic-bezier(0.0, 0.0, 0.2, 1)', keyframes([
                    style({ opacity: '0'})
                ])),
            ])
        ]),
        trigger('resizeWidth', [
            state('fullWidth', style({
                width: '100%'
            })),
            state('smallWidth', style({
                width: '50%'
            })),
            transition('fullWidth <=> smallWidth', [
                animate('350ms cubic-bezier(0.0, 0.0, 0.2, 1)')
            ]),
            transition('void => *', [
                style({ opacity: '0'}),
                animate('100ms cubic-bezier(0.0, 0.0, 0.2, 1)', style({ opacity: '1'})),
            ]),
            transition('* => void', [
                animate('100ms cubic-bezier(0.0, 0.0, 0.2, 1)', keyframes([
                    style({ opacity: '0'})
                ])),
            ])
        ])
    ]
})
export class CompanyComponent implements OnInit {
    workFunction: WorkFunction;
    mainFunction: WorkFunction;
    currentUser: User;
    companiesLinkedToProject: Company[];
    showAddCompaniesList: boolean;
    showWarningBox: boolean;
    warningMessage = 'Er zijn geen bedrijven gekoppeld aan het project.';
    private allCompanies: Company[];

    constructor(
        private companyService: CompanyService,
        private workFunctionService: WorkFunctionService,
        private userCommunicationService: UsersCommunicationService,
        private headerCommunicationService: HeaderWithFolderCommunicationService,
        private activatedRoute: ActivatedRoute,
        private dialog: MatDialog,
    ) { }

    ngOnInit() {
        const functionPackage: ChildItemPackage = this.activatedRoute.snapshot.data.functionPackage;
        this.workFunction = <WorkFunction>functionPackage.parent;
        this.currentUser = functionPackage.currentUser;
        this.mainFunction = functionPackage.mainFunction;

        this.companyService.getCompaniesByProject(<Project>this.workFunction.parent).subscribe(companies => {
            if (companies) {
                this.allCompanies = companies;
                this.filterCompanies();
                this.headerCommunicationService.addCompanyButton.next({show: true});
            }
        });
        this.headerCommunicationService.addCompanyButton.subscribe(buttonOptions => {
            if (buttonOptions && buttonOptions.trigger) {
                this.filterCompanies();
                this.companiesLinkedToProject.length === 0 ? this.showWarningBox = true : this.showAddCompaniesList = true;
                this.warningMessage = 'Alle bedrijven voor dit project zijn toegevoegd.';
            }
        });
    }

    addUser(e: Event): void {
        e.preventDefault();
        this.userCommunicationService.triggerAddUserPopup.next(true);
    }
    addCompany(e: Event): void {
        e.preventDefault();
        const data: CompanyPopupData =  {
            title: 'Voeg een Bedrijf toe',
            placeholder: 'Bedrijfs naam',
            submitButton: 'Voeg toe',
            workFunction: this.workFunction,
        };
        this.dialog.open(CompanyPopupComponent, {
            width: '400px',
            data: data,
        }).afterClosed().subscribe(company => {
            if (company) {
                this.workFunction.companies.push(company);
                this.workFunctionService.updateWorkFunction(this.workFunction, {companies: [company.id]}).subscribe();
                this.resetView();
            }
        });
    }

    resetView(): void {
        this.showWarningBox = false;
        this.showAddCompaniesList = false;
    }
    private filterCompanies(): void {
        this.companiesLinkedToProject = this.allCompanies.filter(c => !this.workFunction.companies.find(wc => wc.id === c.id));
        this.showAddCompaniesList = this.companiesLinkedToProject.length > 0 && this.workFunction.companies.length === 0;
        this.showWarningBox = this.companiesLinkedToProject.length === 0 && this.workFunction.companies.length === 0;
    }


}
