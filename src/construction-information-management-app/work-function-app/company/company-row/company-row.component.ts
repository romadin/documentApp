import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
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
    @Output() editCompany: EventEmitter<Company> = new EventEmitter<Company>();

    constructor() { }

    ngOnInit() {
    }

    onEditCompany(e: Event): void {
        e.preventDefault();
        e.stopPropagation();
        this.editCompany.emit(this.company);
    }

    deleteCompany(e: Event): void {
        e.preventDefault();
        e.stopPropagation();
        console.log('DELETE Company', this.company.name);
    }

}
