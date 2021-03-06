import { Component, Inject } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

import { ProjectService } from '../../../shared/packages/project-package/project.service';
import { Organisation } from '../../../shared/packages/organisation-package/organisation.model';
import { ToastService } from '../../../shared/toast.service';
import { TemplateService } from '../../../shared/packages/template-package/template.service';
import { Template } from '../../../shared/packages/template-package/template.model';
import { ProjectPostDataInterface } from '../../../shared/packages/project-package/api-project.interface';

export interface DefaultPopupData {
    title: string;
    placeholder: string;
    submitButton: string;
    id?: number;
    organisation?: Organisation;
    item?: any;
}

@Component({
    selector: 'cim-project-popup.component',
    templateUrl: './project-popup.component.html',
    styleUrls: ['./project-popup.component.css']
})
export class ProjectPopupComponent {
    templateId: any;
    projectForm: FormGroup = new FormGroup({
        projectName: new FormControl(''),
    });
    templates: Template[];
    disableTemplateSelect = true;

    constructor(
        public dialogRef: MatDialogRef<ProjectPopupComponent>,
        @Inject(MAT_DIALOG_DATA) public data: DefaultPopupData,
        private projectService: ProjectService,
        private toastService: ToastService,
        private templateService: TemplateService,
    ) {
        const templateModule = this.data.organisation.modules.find(m => m.id === 1);
        this.disableTemplateSelect = templateModule ? !templateModule.on : true;
        this.projectForm.controls.projectName.setValue(data.id ? data.placeholder : '');
        this.templateService.getTemplates(this.data.organisation).subscribe((templates) => {
            this.templates = templates;
            this.templateId = templates[0].id;
        });
    }

    onNoClick(e: MouseEvent): void {
        e.preventDefault();
        e.stopPropagation();
        this.dialogRef.close();
    }

    public onSubmit() {
        const projectName = this.projectForm.controls.projectName.value;
        if (projectName !== '') {
            if (this.data.id) {
                this.projectService.updateProject({ name: projectName }, this.data.id).subscribe((value) => {
                    this.toastService.showSuccess('Project: ' + this.data.placeholder + ' is bewerkt', 'Bewerkt');
                    this.dialogRef.close(value);
                });
            } else {
                const data: ProjectPostDataInterface = {
                    name: projectName,
                    templateId: this.templateId,
                    organisationId: this.data.organisation.id
                };


                this.projectService.postProjectWithDefaultTemplate(data, this.data.organisation)
                    .subscribe((value) => {
                        this.toastService.showSuccess('Project: ' + projectName + ' is toegevoegd', 'Toegevoegd');
                        this.dialogRef.close(value);
                    });
            }
        }
    }
}
