import { Component, Input, OnInit } from '@angular/core';
import { Company } from '../../../../shared/packages/company-package/company.model';
import { User } from '../../../../shared/packages/user-package/user.model';

@Component({
  selector: 'cim-company-row',
  templateUrl: './company-row.component.html',
  styleUrls: ['./company-row.component.css']
})
export class CompanyRowComponent implements OnInit {
    @Input() company: Company;
    @Input() currentUser: User;

    constructor() { }

    ngOnInit() {
    }

    onEditCompany(e: Event): void {
        e.preventDefault();
        e.stopPropagation();
        console.log('edit Company', this.company.name);
    }

    deleteCompany(e: Event): void {
        e.preventDefault();
        e.stopPropagation();
        console.log('DELETE Company', this.company.name);
    }

}
