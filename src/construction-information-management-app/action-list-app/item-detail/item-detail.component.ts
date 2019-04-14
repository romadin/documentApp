import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { Action } from '../../../shared/packages/action-package/action.model';
import { ActionService } from '../../../shared/packages/action-package/action.service';
import { LoadingService } from '../../../shared/loading.service';
import { ToastService } from '../../../shared/toast.service';
import { weekNumberValidator } from '../../../shared/form-validator/custom-validators';
import { UserService } from '../../../shared/packages/user-package/user.service';
import { User } from '../../../shared/packages/user-package/user.model';
import { Organisation } from '../../../shared/packages/organisation-package/organisation.model';
import { ActivatedRoute } from '@angular/router';
import { ApiActionNewPostData } from '../../../shared/packages/action-package/api-action.interface';

interface Status {
    name: string;
    value: boolean;
}

@Component({
    selector: 'cim-action-item-detail',
    templateUrl: './item-detail.component.html',
    styleUrls: ['./item-detail.component.css'],
})
export class ItemDetailComponent implements OnInit {
    @Input() projectId: number;
    @Output() closeEdit: EventEmitter<boolean> = new EventEmitter<boolean>();

    userSelected: any;
    currentUser: User;
    public actionForm: FormGroup = new FormGroup({
        description: new FormControl(),
        actionHolder: new FormControl(),
        week: new FormControl(),
        comments: new FormControl(),
        projectId: new FormControl(),
    });
    public selectedStatus: Status;
    public users: User[];

    private _action: Action | null;

    @Input()
    set action(action: Action | null) {
        this._action = action;
        this.setFormValue();
    }

    get action(): Action | null {
        return this._action;
    }

    constructor(private actionService: ActionService,
                private userService: UserService,
                private loadingService: LoadingService,
                private toastService: ToastService,
                private activatedRoute: ActivatedRoute) { }

    ngOnInit() {
        const organisation: Organisation = <Organisation>this.activatedRoute.snapshot.data.organisation;
        this.userService.getCurrentUser().subscribe(user => {
            this.currentUser = user;
        });
        this.actionForm.controls.description.setValidators([ Validators.required ]);
        this.actionForm.controls.week.setValidators([ Validators.maxLength(2), weekNumberValidator(52) ]);

        this.userService.getUsers({organisationId: organisation.id, projectId: this.projectId}).subscribe(users => {
            this.users = users;
        });
    }

    onSubmit() {
        if (this.actionForm.valid) {
            this.loadingService.isLoading.next(true);
            const data: ApiActionNewPostData =  {
                description: this.actionForm.controls.description.value,
                userId: this.userSelected !== '' ? this.userSelected : null,
                week: this.actionForm.controls.week.value !== '' ? this.actionForm.controls.week.value : null,
                comments: this.actionForm.controls.comments.value,
                projectId: this.projectId,
            };

            if ( this.action ) {
                this.action.update(data);
                this.actionService.editAction(this.action, data);
                this.hideLoadShowToast('Actie: ' + data.description + ' is bewerkt', 'Bewerkt');
                return;
            }

            this.actionService.postAction(data).subscribe((newAction: Action) => {
                if (newAction) {
                    this.hideLoadShowToast('Actie: ' + data.description + ' is toegevoegd', 'Toegevoegd');
                    this.closeEdit.emit(true);
                }
            });
        }
    }

    onCancel(e?: MouseEvent): void {
        if (e) {
            e.preventDefault();
            e.stopPropagation();
        }
        this.closeEdit.emit(true);
    }

    private setFormValue(): void {
        this.userSelected = this.action ? this.action.actionHolder.id : '';
        this.actionForm.controls.description.setValue(this.action ? this.action.description : '');
        this.actionForm.controls.actionHolder.setValue(this.action ? this.action.actionHolder.getFullName() : '');
        this.actionForm.controls.week.setValue(this.action ? this.action.week : '');
        this.actionForm.controls.comments.setValue(this.action ? this.action.comments : '');
    }

    private hideLoadShowToast(toastMessage: string, toastTitle): void {
        this.loadingService.isLoading.next(false);
        this.toastService.showSuccess(toastMessage, toastTitle);
    }
}
