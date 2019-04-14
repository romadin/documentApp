import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Action } from '../../../../shared/packages/action-package/action.model';

@Component({
  selector: 'cim-action-detail-public',
  templateUrl: './action-detail-public.component.html',
  styleUrls: ['./action-detail-public.component.css']
})
export class ActionDetailPublicComponent implements OnInit {
    @Input() action: Action;
    @Output() closeView: EventEmitter<boolean> = new EventEmitter<boolean>();

    constructor() { }

    ngOnInit() {
    }

    onCloseView() {
        this.closeView.emit(true);
    }

}
