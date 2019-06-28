import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CompanyRightSidePackage } from '../company.component';

@Component({
    selector: 'cim-company-right-side',
    templateUrl: './company-right-side.component.html',
    styleUrls: ['./company-right-side.component.css']
})
export class CompanyRightSideComponent implements OnInit {
    @Output() closeSide: EventEmitter<boolean> = new EventEmitter();

    private _package: CompanyRightSidePackage;

    constructor() { }

    @Input()
    set package(rightSidePackage: CompanyRightSidePackage) {
        this._package = rightSidePackage;
    }

    get package(): CompanyRightSidePackage {
        return this._package;
    }

    ngOnInit() {
    }

    onCancel() {
        this.closeSide.emit(true);
    }
}
