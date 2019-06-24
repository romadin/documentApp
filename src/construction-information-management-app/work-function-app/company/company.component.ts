import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { Company } from '../../../shared/packages/company-package/company.model';
import { CompanyService } from '../../../shared/packages/company-package/company.service';
import { Project } from '../../../shared/packages/project-package/project.model';
import { User } from '../../../shared/packages/user-package/user.model';
import { WorkFunction } from '../../../shared/packages/work-function-package/work-function.model';
import { WorkFunctionService } from '../../../shared/packages/work-function-package/work-function.service';
import { HeaderWithFolderCommunicationService } from '../../../shared/service/communication/HeaderWithFolder.communication.service';
import { UsersCommunicationService } from '../../../shared/service/communication/users-communication.service';
import { CompanyPopupComponent, CompanyPopupData } from '../../popups/company-popup/company-popup.component';

@Component({
  selector: 'cim-company',
  templateUrl: './company.component.html',
  styleUrls: ['./company.component.css']
})
export class CompanyComponent implements OnInit {
    @Input() workFunction: WorkFunction;
    @Input() mainFunction: WorkFunction;
    @Input() currentUser: User;
    companiesLinkedToProject: Company[];
    showAddCompaniesList: boolean;
    showWarningBox: boolean;
    private allCompanies: Company[];

    constructor(
        private companyService: CompanyService,
        private workFunctionService: WorkFunctionService,
        private userCommunicationService: UsersCommunicationService,
        private headerCommunicationService: HeaderWithFolderCommunicationService,
        private dialog: MatDialog,
    ) { }

    ngOnInit() {
        this.headerCommunicationService.addCompanyButton.next({show: true});
        this.companyService.getCompaniesByProject(<Project>this.workFunction.parent).subscribe(companies => {
            if (companies) {
                this.allCompanies = companies;
                this.filterCompanies();
            }
        });
        this.headerCommunicationService.addCompanyButton.subscribe(buttonOptions => {
            if (buttonOptions && buttonOptions.trigger) {
                this.filterCompanies();
                this.companiesLinkedToProject.length === 0 ? this.showWarningBox = true : this.showAddCompaniesList = buttonOptions.trigger;
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
            this.workFunction.companies.push(company);
            this.workFunctionService.updateWorkFunction(this.workFunction, {companies: [company.id]}).subscribe();
            this.resetView();
        });
    }

    private filterCompanies(): void {
        this.companiesLinkedToProject = this.allCompanies.filter(c => !this.workFunction.companies.find(wc => wc.id === c.id));
    }
    private resetView(): void {
        this.showWarningBox = false;
        this.showAddCompaniesList = false;
    }


}
