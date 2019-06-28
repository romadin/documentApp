import { animate, animateChild, keyframes, query, stagger, state, style, transition, trigger } from '@angular/animations';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { ActivatedRoute } from '@angular/router';
import { Company } from '../../../shared/packages/company-package/company.model';
import { CompanyService } from '../../../shared/packages/company-package/company.service';
import { isCompany } from '../../../shared/packages/company-package/interface/company.interface';
import { Project } from '../../../shared/packages/project-package/project.model';
import { User } from '../../../shared/packages/user-package/user.model';
import { WorkFunction } from '../../../shared/packages/work-function-package/work-function.model';
import { HeaderWithFolderCommunicationService } from '../../../shared/service/communication/HeaderWithFolder.communication.service';
import { UsersCommunicationService } from '../../../shared/service/communication/users-communication.service';
import { ChildItemPackage } from '../work-function-package-resolver.service';

export interface CompanyRightSidePackage {
    workFunction: WorkFunction;
    editCompany?: Company;
    companiesLinkedToProject?: Company[];
}
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
            state('openFullWidth', style({
                width: '100%',
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
            transition('openFullWidth => open', [
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
            state('noWidth', style({
                width: '0'
            })),
            transition('fullWidth <=> smallWidth', [
                animate('350ms cubic-bezier(0.0, 0.0, 0.2, 1)')
            ]),
            transition('fullWidth <=> noWidth', [
                animate('350ms cubic-bezier(0.0, 0.0, 0.2, 1)')
            ]),
            transition(':enter', [
                query('@items', stagger(300, animateChild()))
            ]),
        ]),
        trigger('items', [
            transition('void => *', [
                style({ transform: 'scale(0.5)', opacity: 0 }),  // initial
                animate('1s cubic-bezier(.8, -0.6, 0.2, 1.5)',
                    style({ transform: 'scale(1)', opacity: 1 })
                )  // final
            ])
        ])
    ]
})
export class CompanyComponent implements OnInit, OnDestroy {
    workFunction: WorkFunction;
    mainFunction: WorkFunction;
    currentUser: User;
    companiesLinkedToProject: Company[];
    rightSidePackage: CompanyRightSidePackage = {workFunction: null};
    rightSideActive: boolean;
    showWarningBox: boolean;
    warningMessage = 'Er zijn geen bedrijven gekoppeld aan het project.';
    private allCompanies: Company[];

    constructor(
        private companyService: CompanyService,
        private userCommunicationService: UsersCommunicationService,
        private headerCommunicationService: HeaderWithFolderCommunicationService,
        private activatedRoute: ActivatedRoute,
    ) { }

    ngOnInit() {
        const functionPackage: ChildItemPackage = this.activatedRoute.snapshot.data.functionPackage;
        this.rightSidePackage.workFunction = this.workFunction = <WorkFunction>functionPackage.parent;
        this.currentUser = functionPackage.currentUser;
        this.mainFunction = functionPackage.mainFunction;
        let streamCounter = 0;

        this.companyService.getCompaniesByProject(<Project>this.workFunction.parent).subscribe(companies => {
            if (companies) {
                this.allCompanies = companies;
                this.filterCompanies();
                this.headerCommunicationService.addCompanyButton.next({show: true});
                streamCounter++;

                if (streamCounter === 1) {
                    this.rightSideActive = this.companiesLinkedToProject.length > 0 && this.workFunction.companies.length === 0;
                    this.rightSidePackage.companiesLinkedToProject = this.companiesLinkedToProject;
                    this.showWarningBox = this.companiesLinkedToProject.length === 0 && this.workFunction.companies.length === 0;
                }
            }
        });
        this.headerCommunicationService.addCompanyButton.subscribe(buttonOptions => {
            if (buttonOptions && buttonOptions.trigger) {
                this.filterCompanies();
                this.resetView();
                setTimeout(() => {
                    this.companiesLinkedToProject.length === 0 ? this.showWarningBox = true : this.rightSideActive = true;
                }, 200);
                this.warningMessage = 'Alle bedrijven voor dit project zijn toegevoegd.';
                this.rightSidePackage.companiesLinkedToProject = this.companiesLinkedToProject;
            }
        });
    }

    ngOnDestroy() {
        this.headerCommunicationService.addCompanyButton.next({show: false});
    }

    addUser(e: Event): void {
        e.preventDefault();
        this.userCommunicationService.triggerAddUserPopup.next(true);
    }
    addCompany(e: Event | Company): void {
        this.rightSidePackage = { workFunction: this.workFunction };
        isCompany(e) ? this.rightSidePackage.editCompany = e : e.preventDefault();
        this.resetView();
        setTimeout(() => {
            this.rightSideActive = true;
        }, 200);
    }

    resetView(): void {
        this.showWarningBox = false;
        this.rightSideActive = false;
    }
    private filterCompanies(): void {
        this.companiesLinkedToProject = this.allCompanies.filter(c => !this.workFunction.companies.find(wc => wc.id === c.id));
    }


}
