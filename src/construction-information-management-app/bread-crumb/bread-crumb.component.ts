import { Component, Input, OnInit } from '@angular/core';

export interface Breadcrumb {
    name: string;
    url: string;
}
@Component({
  selector: 'cim-bread-crumb',
  templateUrl: './bread-crumb.component.html',
  styleUrls: ['./bread-crumb.component.css']
})
export class BreadCrumbComponent implements OnInit {
    @Input() breadcrumbs: Breadcrumb[];

    constructor() {
    }

    ngOnInit() {
    }

}
