import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Company } from '../../../../shared/packages/company-package/company.model';
import { WorkFunctionUpdateBody } from '../../../../shared/packages/work-function-package/interface/work-function-api-response.interface';
import { WorkFunction } from '../../../../shared/packages/work-function-package/work-function.model';
import { WorkFunctionService } from '../../../../shared/packages/work-function-package/work-function.service';

@Component({
  selector: 'cim-add-companies-list',
  templateUrl: './add-companies-list.component.html',
  styleUrls: ['./add-companies-list.component.css']
})
export class AddCompaniesListComponent implements OnInit {
    @Input() companies: Company[];
    @Input() workFunction: WorkFunction;
    @Output() closeList: EventEmitter<boolean> = new EventEmitter();
    companiesSelected: Company[];

    constructor(private workFunctionService: WorkFunctionService) { }

    ngOnInit() {
    }

    saveCompany(e: MouseEvent) {
        e.stopPropagation();
        e.preventDefault();
        const postData: WorkFunctionUpdateBody = {};

        this.companiesSelected.forEach(company => {
            postData.companies ? postData.companies.push(company.id) : postData.companies = [company.id];
            this.workFunction.companies.push(company);
        });
        this.workFunctionService.updateWorkFunction(this.workFunction, postData).subscribe(() => {
            this.closeList.emit(true);
        });
    }

    onCancel(e: MouseEvent) {
        e.stopPropagation();
        e.preventDefault();
        this.closeList.emit(true);
    }

}
