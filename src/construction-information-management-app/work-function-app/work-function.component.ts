import { Component, OnInit } from '@angular/core';
import { RouterService } from '../../shared/service/router.service';
import { ActivatedRoute } from '@angular/router';
import { MenuAction } from '../header/header.component';

@Component({
  selector: 'cim-work-function',
  templateUrl: './work-function.component.html',
  styleUrls: ['./work-function.component.css']
})
export class WorkFunctionComponent implements OnInit {

    constructor(
        private route: ActivatedRoute,
        private routerService: RouterService
    ) { }

    ngOnInit() {
        this.routerService.setBackRouteParentFromActivatedRoute(this.route.parent);
    }
}
