import { Injectable } from '@angular/core';
import { ToastrManager } from 'ng6-toastr-notifications';

@Injectable()
export class ToastService {

    private defaultOptions = {
        position: 'top-center',
        toastTimeout: 2000,
        newestOnTop: true,
        maxShown: 2,
        animate: 'slideFromTop',
        messageClass: 'toastWrapper',
        enableHTML: true,
        showCloseButton: false,
    };

    constructor(private toast: ToastrManager) {}

    showSuccess(message: string, title?: string) {
        console.log(this.defaultOptions);
        this.toast.successToastr(message, title, this.defaultOptions);
    }

    showError(message: string, title?: string, options?: any) {
        const op = Object.assign( {}, this.defaultOptions );
        Object.assign( op, options );
        this.toast.errorToastr(message, title, op);
    }

    showWarning() {
        this.toast.warningToastr('This is warning toast.', 'Alert!');
    }

    showInfo() {
        this.toast.infoToastr('This is info toast.', 'Info');
    }

    showCustom(html: string, title?: string) {
        this.toast.customToastr(html, title, this.defaultOptions);
    }

    showToast(position: any = 'top-left') {
        this.toast.infoToastr('This is a toast.', 'Toast', {
            position: position
        });
    }
}
