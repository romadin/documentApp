import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { DefaultPopupData } from '../../../popups/project-popup/project-popup.component';
import { TemplateService } from '../../../../shared/packages/template-package/template.service';
import { FormControl, FormGroup } from '@angular/forms';
import { TemplatePostData } from '../../../../shared/packages/template-package/interface/template-api-response.interface';
import { ToastService } from '../../../../shared/toast.service';

@Component({
    selector: 'cim-add-template-popup',
    templateUrl: './add-template-popup.component.html',
    styleUrls: ['./add-template-popup.component.css']
})
export class AddTemplatePopupComponent {
    templateForm: FormGroup = new FormGroup({
        name: new FormControl(''),
    });
    constructor(
        public dialogRef: MatDialogRef<AddTemplatePopupComponent>,
        @Inject(MAT_DIALOG_DATA) public data: DefaultPopupData,
        private templateService: TemplateService,
        private toastService: ToastService,
    ) { }

    onSubmit() {
        if (this.templateForm.valid) {
            const body: TemplatePostData = {
                name: this.templateForm.get('name').value,
                organisationId: this.data.organisation.id,
            };
            this.templateService.postTemplate(body).subscribe(template => {
                this.toastService.showSuccess('Template: ' + template.name + ' is toegevoegd', 'Toegevoegd');
                this.dialogRef.close(template);
            });
        }
    }

    onNoClick(e: MouseEvent): void {
        e.preventDefault();
        e.stopPropagation();
        this.dialogRef.close();
    }

}
