import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { DomSanitizer, SafeStyle } from '@angular/platform-browser';
import { MatDialog } from '@angular/material';
import { Organisation } from '../../../../shared/packages/organisation-package/organisation.model';

import { ConfirmPopupComponent, ConfirmPopupData } from '../../../popups/confirm-popup/confirm-popup.component';
import { User } from '../../../../shared/packages/user-package/user.model';
import { UserService } from '../../../../shared/packages/user-package/user.service';
import { ToastService } from '../../../../shared/toast.service';

@Component({
  selector: 'cim-user-row',
  templateUrl: './user-row.component.html',
  styleUrls: ['./user-row.component.css']
})
export class UserRowComponent implements OnInit {
    @Input() organisation: Organisation;
    @Input() currentUser: User;
    @Input() user: User;
    @Input() projectId: number;
    @Output() userToEdit: EventEmitter<User> = new EventEmitter<User>();
    image: SafeStyle;
    private fileReader: FileReader = new FileReader();

    constructor(public dialog: MatDialog,
                private userService: UserService,
                private sanitizer: DomSanitizer,
                private toast: ToastService,
    ) { }

    ngOnInit() {
        this.image = this.sanitizer.bypassSecurityTrustStyle('url( "/assets/images/defaultProfile.png")');
        if (this.user.image) {
            this.fileReader.addEventListener('loadend', () => {
                const imageString =  JSON.stringify(this.fileReader.result).replace(/\\n/g, '');
                this.image = this.sanitizer.bypassSecurityTrustStyle('url(' + imageString + ')');
            }, false);
            this.user.image.subscribe((blobValue) => {
                if (blobValue) {
                    this.fileReader.readAsDataURL(blobValue);
                }
            });
        }
    }

    public editUser (event: MouseEvent) {
        event.preventDefault();
        event.stopPropagation();
        this.userToEdit.emit(this.user);
    }

    public deleteUser (event: MouseEvent) {
        event.preventDefault();
        event.stopPropagation();

        const message = `Weet u zeker dat u  <strong>${this.user.getFullName()}</strong> wilt ${this.projectId ? ' ontkoppelen van het huidige project' : ' verwijderen'}`;

        const popupData: ConfirmPopupData = {
            title: 'Gebruiker verwijderen',
            name: this.user.getFullName(),
            message: message,
            firstButton: 'ja',
            secondButton: 'nee'
        };
        this.dialog.open(ConfirmPopupComponent, {width: '400px', data: popupData}).afterClosed().subscribe((action) => {
            if (action) {
                let params = {};
                if (this.projectId) {
                    params = {projectId: this.projectId};
                    this.user.projectsId.splice(this.user.projectsId.findIndex(p => p === this.projectId), 1);
                }

                this.userService.deleteUser(this.user, params, this.organisation).subscribe((deleted) => {
                    if (deleted) {
                        this.toast.showSuccess('Gebruiker: ' + this.user.getFullName() + ' is verwijderd', 'Verwijderd');
                    }
                });
            }
        });
    }
}
