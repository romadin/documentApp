import { Component, EventEmitter, Input, NgZone, OnInit, Output } from '@angular/core';
import { Event } from '../../../../../shared/packages/agenda-package/event.model';
import { User } from '../../../../../shared/packages/user-package/user.model';
import { Observable } from 'rxjs';
import { animate, keyframes, style, transition, trigger } from '@angular/animations';

interface GeoLocation {
    longitude: number;
    latitude: number;
}

declare global {
    interface Window { google: any; }
}

window.google = window.google || {};
const geocoder = new window.google.maps.Geocoder();
@Component({
    selector: 'cim-event-detail-public',
    templateUrl: './public.component.html',
    styleUrls: ['./public.component.css'],
    animations: [
        trigger('fadeIn', [
            transition('void => *', [
                style({ opacity: '0', }),
                animate('500ms', style({ opacity: '1' })),
            ]),
            transition('* => void', [
                animate('500ms', keyframes([
                    style({ opacity: '0' })
                ])),
            ])
        ]),
    ]
})
export class PublicComponent implements OnInit {
    @Input() event: Event;
    @Input() user: User;
    @Output() closeView: EventEmitter<boolean> = new EventEmitter<boolean>();
    public location: GeoLocation;
    public testBool: boolean;

    constructor(private ngZone: NgZone) { }

    ngOnInit() {
        this.getLocation(this.event.location.streetName).subscribe((location) => {
            this.ngZone.run(() => {
                this.location = {
                    latitude: location.lat(),
                    longitude: location.lng()
                };
            });
        });
    }

    onCloseView() {
        this.closeView.emit(true);
    }

    getLocation(address: string): Observable<any> {

        return Observable.create(observer => {
            geocoder.geocode({
                'address': address
            }, (results, status) => {
                if (status === window.google.maps.GeocoderStatus.OK) {
                    observer.next(results[0].geometry.location);
                    observer.complete();
                } else {
                    console.log('Error: ', results, ' & Status: ', status);
                    observer.error();
                }
            });
        });
    }
}
