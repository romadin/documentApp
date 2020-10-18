import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

export interface ConfirmPopupData {
    title: string;
    name: string;
    message: string;
    firstButton: string;
    secondButton: string;
}

@Component({
    selector: 'cim-confirm-popup',
    templateUrl: './confirm-popup.component.html',
    styleUrls: ['./confirm-popup.component.css']
})
export class ConfirmPopupComponent implements OnInit {

    constructor(
        @Inject(MAT_DIALOG_DATA) public data: ConfirmPopupData,
        private dialogRef: MatDialogRef<ConfirmPopupComponent>,
    ) { }

    ngOnInit() {

    }

    onClose(e: MouseEvent): void {
        e.preventDefault();
        e.stopPropagation();
        this.dialogRef.close(false);
    }

    onNoClick(e: MouseEvent): void {
        e.preventDefault();
        e.stopPropagation();
        this.dialogRef.close(false);
    }

    onAcceptClick(e: MouseEvent): void {
        e.preventDefault();
        e.stopPropagation();
        this.dialogRef.close(true);
    }

}
