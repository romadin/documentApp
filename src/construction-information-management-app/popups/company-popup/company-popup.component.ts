import { Component, Inject } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { CompanyApiPostData } from '../../../shared/packages/company-package/interface/company-api-response.interface';
import { CompanyService } from '../../../shared/packages/company-package/company.service';
import { WorkFunction } from '../../../shared/packages/work-function-package/work-function.model';
import { ToastService } from '../../../shared/toast.service';
import { DefaultPopupData } from '../project-popup/project-popup.component';

export interface CompanyPopupData extends DefaultPopupData {
    workFunction?: WorkFunction;
}

@Component({
  selector: 'cim-company-popup',
  templateUrl: './company-popup.component.html',
  styleUrls: ['./company-popup.component.css']
})
export class CompanyPopupComponent {
    companyForm: FormGroup = new FormGroup({
        name: new FormControl(''),
    });
    constructor(
        @Inject(MAT_DIALOG_DATA) public data: CompanyPopupData,
        private dialogRef: MatDialogRef<CompanyPopupComponent>,
        private companyService: CompanyService,
        private toast: ToastService,
    ) { }

    onCancel(e: MouseEvent): void {
        e.preventDefault();
        e.stopPropagation();
        this.dialogRef.close();
    }

    onSubmit() {
        console.log(this.companyForm.invalid);
        if (!this.companyForm.invalid) {
            if (this.data.id) {
                // this.companyService.updateProject({ name: companyName }, this.data.id).subscribe((value) => {
                //     this.toast.showSuccess('Project: ' + this.data.placeholder + ' is bewerkt', 'Bewerkt');
                //     this.dialogRef.close(value);
                // });
            } else {
                const data: CompanyApiPostData = {
                    name: this.companyForm.controls.name.value
                };

                this.companyService.createCompany(data, [this.data.workFunction.parent.id]).subscribe((company) => {
                    this.toast.showSuccess('Bedrijf: ' + company.name + ' is toegevoegd', 'Toegevoegd');
                    this.dialogRef.close(company);
                });
            }
        }
    }

}
