import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, Router } from '@angular/router';
import { EMPTY, Observable } from 'rxjs';
import { first, map } from 'rxjs/operators';
import { Organisation } from '../organisation-package/organisation.model';

import { Project } from './project.model';
import { ProjectService } from './project.service';

@Injectable()
export class ProjectResolver implements Resolve<Project | Observable<never>> {

    constructor(private projectService: ProjectService, private router: Router) { }

    resolve(route: ActivatedRouteSnapshot) {
        const organisation = <Organisation>route.parent.data.organisation;

        return this.projectService.getProject(route.params.id, organisation).pipe(first(v => v !== undefined)).pipe(
            map( project => {
                if (project) {
                    return project;
                } else { // no project
                    this.router.navigate(['not-found/organisation']);
                    return EMPTY;
                }
            })
        );
    }
}
