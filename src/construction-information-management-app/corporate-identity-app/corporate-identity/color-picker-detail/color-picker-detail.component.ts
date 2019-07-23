import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Organisation } from '../../../../shared/packages/organisation-package/organisation.model';
import { OrganisationService } from '../../../../shared/packages/organisation-package/organisation.service';
import { ToastService } from '../../../../shared/toast.service';

export type ColorType = 'primary' | 'secondary';

export interface ColorPackage {
    color: string;
    colorType: ColorType;
    organisation: Organisation;
}
@Component({
  selector: 'cim-color-picker-detail',
  templateUrl: './color-picker-detail.component.html',
  styleUrls: ['./color-picker-detail.component.css']
})
export class ColorPickerDetailComponent implements OnInit {
    @Output() closeView: EventEmitter<boolean> = new EventEmitter<boolean>();
    colorType: ColorType;
    color: string;
    colorLabel: string;
    cancel = false;

    private organisation: Organisation;

    constructor(private organisationService: OrganisationService, private toast: ToastService) { }

    ngOnInit() {
    }

    @Input()
    set colorPackage(colorPackage: ColorPackage) {
        if (colorPackage) {
            this.colorType = colorPackage.colorType;
            this.color = colorPackage.color;
            this.colorLabel = this.colorType === 'primary' ? 'Hoofd kleur' : 'Sub kleur';
            this.organisation = colorPackage.organisation;
        }
    }

    onCloseView(e: Event): void {
        e.preventDefault();
        e.stopPropagation();
        this.closeView.emit(true);
    }

    onCancel(): void {
        this.cancel = true;
    }


    onClosePicker(color: string): void {
        // we set the Timeout because the onCancel function is slower then the onClosePicker function.
        setTimeout(() => {
            const colorAttribute = this.colorType + 'Color';
            if (!this.cancel && this.organisation[colorAttribute] !== color) {
                const data = new FormData();

                data.append(colorAttribute, color);
                this.organisation[colorAttribute] = color;
                this.organisationService.updateOrganisation(data, this.organisation).subscribe(() => {
                    this.toast.showSuccess('Organisatie: ' +  this.colorLabel + ' is bewerkt', 'Bewerkt');
                });
            }
            this.cancel = false;
        }, 100);
    }
}
