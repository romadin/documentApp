import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';


import { DefaultPopupData } from '../../../popups/project-popup/project-popup.component';
import { TemplateService } from '../../../../shared/packages/template-package/template.service';
import { TemplatePostData } from '../../../../shared/packages/template-package/interface/template-api-response.interface';
import { ToastService } from '../../../../shared/toast.service';
import { Template } from '../../../../shared/packages/template-package/template.model';

@Component({
    selector: 'cim-add-template-popup',
    templateUrl: './add-template-popup.component.html',
    styleUrls: ['./add-template-popup.component.css']
})
export class AddTemplatePopupComponent implements OnInit {
    templateForm: FormGroup = new FormGroup({
        name: new FormControl(''),
    });
    constructor(
        public dialogRef: MatDialogRef<AddTemplatePopupComponent>,
        @Inject(MAT_DIALOG_DATA) public data: DefaultPopupData,
        private templateService: TemplateService,
        private toastService: ToastService,
    ) {
    }

    public ngOnInit(): void {
        this.templateForm.controls.name.setValue(this.data.item ? this.data.item.name : '');
    }

    onSubmit() {
        if (!this.templateForm.invalid) {
            const body: TemplatePostData = {
                name: this.templateForm.get('name').value,
                organisationId: this.data.organisation.id,
            };
            if (this.data.item) {
                this.templateService.updateTemplate(this.data.item, body).subscribe((template: Template) => {
                    this.toastService.showSuccess('Template: ' + template.name + ' is bewerkt', 'Bewerkt');
                    this.dialogRef.close(template);
                });
            } else {
                this.templateService.postTemplate(body).subscribe(template => {
                    this.toastService.showSuccess('Template: ' + template.name + ' is toegevoegd', 'Toegevoegd');
                    this.dialogRef.close(template);
                });
            }
        }
    }

    onNoClick(e: MouseEvent): void {
        e.preventDefault();
        e.stopPropagation();
        this.dialogRef.close();
    }

}
