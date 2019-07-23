import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { take } from 'rxjs/operators';
import { Organisation } from '../../../../shared/packages/organisation-package/organisation.model';
import { OrganisationService } from '../../../../shared/packages/organisation-package/organisation.service';
import { ToastService } from '../../../../shared/toast.service';

@Component({
  selector: 'cim-organisation-logo-detail',
  templateUrl: './logo-detail.component.html',
  styleUrls: ['./logo-detail.component.css']
})
export class LogoDetailComponent implements OnInit {
    @Input() organisation: Organisation;
    @Output() closeView: EventEmitter<boolean> = new EventEmitter<boolean>();
    imageSrc: any;
    imageToUpload: File;
    private fileReader = new FileReader();

    constructor(private sanitizer: DomSanitizer, private organisationService: OrganisationService, private toast: ToastService) { }

    ngOnInit() {
        if (this.organisation.logo) {
            this.organisation.logo.pipe(take(2)).subscribe((blobValue) => {
                if (blobValue && blobValue.size > 4) {
                    this.fileReader.readAsDataURL(blobValue);
                } else {
                    this.imageSrc = '/assets/images/logoBimUvp.png';
                }
            });
        }
        this.fileReader.addEventListener('loadend', () => {
            this.imageSrc = this.sanitizer.bypassSecurityTrustUrl(<string>this.fileReader.result);
        }, false);
    }

    onImageUpload(event: Event): void {
        if ((<HTMLInputElement>event.target).files && (<HTMLInputElement>event.target).files[0]) {
            this.imageToUpload = (<HTMLInputElement>event.target).files[0];
            this.fileReader.readAsDataURL(this.imageToUpload);
        }
    }

    onSubmit(e: Event):  void {
        e.preventDefault();
        e.stopPropagation();
        if (this.imageToUpload) {
            const data: FormData = new FormData();
            data.append('logo', this.imageToUpload, this.imageToUpload.name);
            this.organisation.logo.next(this.imageToUpload);
            this.organisationService.updateOrganisation(data, this.organisation).subscribe(() => {
                this.toast.showSuccess('Logo is gewijzigd', 'Wijzigen');
            });
        }
    }

    onCloseView(e: Event): void {
        e.preventDefault();
        e.stopPropagation();
        this.closeView.emit(true);
    }
}
