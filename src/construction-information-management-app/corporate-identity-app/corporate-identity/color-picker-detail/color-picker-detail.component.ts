import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Organisation } from '../../../../shared/packages/organisation-package/organisation.model';
import { OrganisationService } from '../../../../shared/packages/organisation-package/organisation.service';

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
    timerId: number;

    private organisation: Organisation;

    constructor(private organisationService: OrganisationService) { }

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

    onColorChange(value: string): void {
        if (this.timerId) {
            clearTimeout(this.timerId);
        }

        this.timerId = setTimeout(() => {
            console.log(value);
            const data = new FormData();
            const colorAttribute = this.colorType + 'Color';

            data.append(colorAttribute, value);
            this.organisation[colorAttribute] = value;
            console.log(this.organisation);
            this.organisationService.updateOrganisation(data, this.organisation).subscribe();
        }, 400);
    }
}
