import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Company } from '../../../../shared/packages/company-package/company.model';
import { CompanyService } from '../../../../shared/packages/company-package/company.service';
import { User } from '../../../../shared/packages/user-package/user.model';
import { WorkFunction } from '../../../../shared/packages/work-function-package/work-function.model';

@Component({
  selector: 'cim-company-row',
  templateUrl: './company-row.component.html',
  styleUrls: ['./company-row.component.css']
})
export class CompanyRowComponent implements OnInit {
    @Input() company: Company;
    @Input() currentUser: User;
    @Input() workFunction: WorkFunction;
    @Output() editCompany: EventEmitter<Company> = new EventEmitter<Company>();
    @Output() deleteCompany: EventEmitter<Company> = new EventEmitter<Company>();

    constructor(private companyService: CompanyService) { }

    ngOnInit() {
    }

    onEditCompany(e: Event): void {
        e.preventDefault();
        e.stopPropagation();
        this.editCompany.emit(this.company);
    }

    onDeleteCompany(e: Event): void {
        e.preventDefault();
        e.stopPropagation();
        const param = {workFunctionId: this.workFunction.id};
        this.companyService.deleteCompany(this.company, param).subscribe(() => {
            this.workFunction.companies.splice(this.workFunction.companies.findIndex(c => c.id === this.company.id), 1);
            this.deleteCompany.emit(this.company);
        });
    }

}
