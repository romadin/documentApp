import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Company } from '../../../../../shared/packages/company-package/company.model';
import { CompanyService } from '../../../../../shared/packages/company-package/company.service';
import { CompanyApiPostData } from '../../../../../shared/packages/company-package/interface/company-api-response.interface';
import { WorkFunction } from '../../../../../shared/packages/work-function-package/work-function.model';
import { WorkFunctionService } from '../../../../../shared/packages/work-function-package/work-function.service';
import { ToastService } from '../../../../../shared/toast.service';

@Component({
    selector: 'cim-company-detail',
    templateUrl: './company-detail.component.html',
    styleUrls: ['./company-detail.component.css']
})
export class CompanyDetailComponent implements OnInit {
    @Input() workFunction: WorkFunction;
    @Output() closeView: EventEmitter<boolean> = new EventEmitter<boolean>();
    companyForm: FormGroup = new FormGroup({
        name: new FormControl('')
    });
    private _company: Company;

    constructor(private companyService: CompanyService, private workFunctionService: WorkFunctionService, private toast: ToastService) { }

    @Input()
    set company(company: Company) {
        this._company = company;
        if (company) {
            this.setFormValue();
        }
    }

    get company(): Company {
        return this._company;
    }

    ngOnInit() {
    }

    onCloseView(e: Event): void {
        e.preventDefault();
        e.stopPropagation();
        this.closeView.emit(true);
    }

    onSubmit(): void {
        if (!this.companyForm.invalid) {
            const body: CompanyApiPostData = { name: this.companyForm.controls.name.value };
            const projectsId: number[] = [this.workFunction.parent.id];
            if (this.company) {
                this.company.name = this.companyForm.controls.name.value;
                this.companyService.updateCompany(this.company, body, projectsId).subscribe();
            } else {
                this.companyService.createCompany(body, projectsId).subscribe(company => {
                    if (company) {
                        this.workFunction.companies.push(company);
                        this.workFunctionService.updateWorkFunction(this.workFunction, { companies: [ company.id ] }).subscribe();
                        this.toast.showSuccess('Bedrijf: ' + company.name + ' is toegevoegd', 'Toegevoegd');
                    }
                });
            }
        }
    }

    private setFormValue() {
        this.companyForm.controls.name.setValue(this.company.name);
    }
}
