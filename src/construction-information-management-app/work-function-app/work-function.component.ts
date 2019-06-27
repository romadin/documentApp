import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { RouterService } from '../../shared/service/router.service';

@Component({
  selector: 'cim-work-function',
  templateUrl: './work-function.component.html',
  styleUrls: ['./work-function.component.css']
})
export class WorkFunctionComponent implements OnInit {

    constructor(private activatedRoute: ActivatedRoute, private routerService: RouterService,) { }

    ngOnInit() {
        this.routerService.setBackRouteParentFromActivatedRoute(this.activatedRoute.parent);
    }
}
