import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { DomSanitizer, SafeStyle } from '@angular/platform-browser';
import { MatDialog } from '@angular/material';

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
    @Input() currentUser: User;
    @Input() user: User;
    @Input() projectId: number;
    @Output() public userToEdit: EventEmitter<User> = new EventEmitter<User>();
    @Output() public userToDelete: EventEmitter<User> = new EventEmitter<User>();
    public image: SafeStyle;
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
        const popupData: ConfirmPopupData = {
            title: 'Gebruiker verwijderen',
            name: this.user.getFullName(),
            message: `Weet u zeker dat u <strong>${this.user.getFullName()}</strong> wilt verwijderen`,
            firstButton: 'ja',
            secondButton: 'nee'
        };
        this.dialog.open(ConfirmPopupComponent, {width: '400px', data: popupData}).afterClosed().subscribe((action) => {
            if (action) {
                const params = this.projectId ? {projectId: this.projectId} : {};
                this.userService.deleteUser(this.user, params).subscribe((deleted) => {
                    if (deleted) {
                        this.toast.showSuccess('Gebruiker: ' + this.user.getFullName() + ' is verwijderd', 'Verwijderd');
                        this.userToDelete.emit(this.user);
                    }
                });
            }
        });
    }
}
