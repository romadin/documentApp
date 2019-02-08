import { Component, Input, OnInit } from '@angular/core';

import { Action } from '../../../shared/packages/action-package/action.model';

@Component({
  selector: 'cim-action-item',
  templateUrl: './item.component.html',
  styleUrls: ['./item.component.css']
})
export class ItemComponent implements OnInit {
    @Input() action: Action;

  constructor() { }

  ngOnInit() {
  }

}
