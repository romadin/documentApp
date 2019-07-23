import { animate, keyframes, state, style, transition, trigger } from '@angular/animations';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Organisation } from '../../../shared/packages/organisation-package/organisation.model';
import { OrganisationService } from '../../../shared/packages/organisation-package/organisation.service';
import { HeaderWithFolderCommunicationService } from '../../../shared/service/communication/HeaderWithFolder.communication.service';
import { ColorPackage, ColorType } from './color-picker-detail/color-picker-detail.component';

@Component({
    selector: 'cim-corporate-identity',
    templateUrl: './corporate-identity.component.html',
    styleUrls: ['./corporate-identity.component.css'],
    animations: [
        trigger('toggleInView', [
            state('close', style({
                transform: 'translateX(110%)'
            })),
            state('open', style({
                width: '48%',
                transform: 'translateX(0)',
                overflow: 'unset'
            })),
            transition('close => open', [
                animate('300ms cubic-bezier(0.0, 0.0, 0.2, 1)')
            ]),
            transition('open => close', [
                animate('300ms cubic-bezier(0.0, 0.0, 0.2, 1)')
            ]),
            transition('void => *', [
                style({ opacity: '0'}),
                animate('100ms cubic-bezier(0.0, 0.0, 0.2, 1)', style({ opacity: '1'})),
            ]),
            transition('* => void', [
                animate('100ms cubic-bezier(0.0, 0.0, 0.2, 1)', keyframes([
                    style({ opacity: '0'})
                ])),
            ])
        ]),
        trigger('resizeWidth', [
            state('fullWidth', style({
                width: '100%'
            })),
            state('smallWidth', style({
                width: '50%',
                marginRight: '10px'
            })),
            transition('fullWidth <=> smallWidth', [
                animate('350ms cubic-bezier(0.0, 0.0, 0.2, 1)')
            ]),
        ])
    ]
})
export class CorporateIdentityComponent implements OnInit {
    organisation: Organisation;
    showRightSide = false;
    showEditLogo = false;
    colorPackage: ColorPackage;

    constructor(private headerCommunication: HeaderWithFolderCommunicationService,
                private organisationService: OrganisationService,
                private activatedRoute: ActivatedRoute,
    ) { }

    ngOnInit() {
        this.organisation = this.activatedRoute.snapshot.data.organisation;
        this.headerCommunication.headerTitle.next('Huisstijl');
    }

    onEditColor(type: ColorType, color: string): void {
        let timer = 0;
        if (this.showEditLogo) {
            this.showEditLogo = false;
            timer = 200;
        }

        setTimeout(() => {
            this.colorPackage = {
                color: color,
                colorType: type,
                organisation: this.organisation
            };
            this.showRightSide = true;
        }, timer);
    }

    onClose(close: boolean) {
        if (close) {
            this.colorPackage = undefined;
            this.showRightSide = false;
            this.showEditLogo = false;
        }
    }

    onEditLogo() {
        this.onClose(true);
        setTimeout(() => {
            this.showEditLogo = true;
        }, 200);
    }

}
