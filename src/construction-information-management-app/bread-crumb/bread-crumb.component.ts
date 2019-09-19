import { Component, Input, OnInit } from '@angular/core';
import { Breadcrumb } from '../../shared/packages/breadcrumb-package/breadcrumb.service';

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
