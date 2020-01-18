import { Injectable } from '@angular/core';
import { merge, Observable, of, Subject, timer } from 'rxjs';
import { WorkFunctionService } from '../work-function-package/work-function.service';

import { Project } from './project.model';
import { ApiProjectResponse, ProjectUpdateData } from './api-project.interface';
import { ApiService } from '../../service/api.service';
import { Organisation } from '../organisation-package/organisation.model';
import { map, mergeMap, shareReplay, switchMap, take } from 'rxjs/operators';

interface ProjectCache {
    [id: number]: Project;
}

@Injectable()
export class ProjectService {
    private projectsCache: ProjectCache = {};

    private projectsCache$: Observable<Project[]>;
    private updateProjectsCache$: Subject<void> = new Subject<void>();

    constructor(private apiService: ApiService, private workFunctionService: WorkFunctionService) {
    }

    getProjects(organisation: Organisation): Observable<Project[]> {
        if (!this.projectsCache$) {
            // const timer$ = timer(0, 10000);
            //
            // this.projectsCache$ = timer$.pipe(
            //     switchMap(_ => this.requestProjects(organisation)),
            //     shareReplay(1)
            // );

            const initialProjects$ = this.getDataOnce(organisation);
            const updates$ = this.updateProjectsCache$.pipe(
                mergeMap(() => this.getDataOnce(organisation))
            );
            this.projectsCache$ = merge(initialProjects$, updates$);
        }

        return this.projectsCache$;
    }

    getDataOnce(organisation: Organisation) {
        return this.requestProjects(organisation).pipe(shareReplay(1), take(1));
    }

    requestProjects(organisation: Organisation): Observable<Project[]> {
        const params = {format: 'json', organisationId: organisation.id};

        return this.apiService.get('/projects', params).pipe(
            map((apiResponse: ApiProjectResponse[]) => apiResponse.map((item) => this.makeProject(item, organisation)))
        );
    }

    getProject(id: number, organisation: Organisation): Observable<Project> {
        const params = {format: 'json', organisationId: organisation.id};
        if (this.projectsCache[id]) {
            return of(this.projectsCache[id]);
        } else {
            return this.apiService.get('/projects/' + id, params).pipe(
                map((projectResponse) => this.makeProject(projectResponse, organisation))
            );
        }
    }

    /**
     * Doing a post projectId but this call does also do workFunctions and documents. That is the default projectId.
     */
    postProjectWithDefaultTemplate(data: { name: string, templateId: number }, organisation: Organisation  ): Observable<Project[]> {
        const params = { organisationId: organisation.id };

        return this.requestPostProject(data, organisation, params).pipe(
            map((project: Project) => {
                this.updateProjectsCache$.next();
                return [project];
            })
        );
    }

    requestPostProject(data: { name: string, templateId: number }, organisation: Organisation, params): Observable<Project> {
        return this.apiService.post('/projects', data, params).pipe(
            map((apiResponse: ApiProjectResponse) => this.makeProject(apiResponse, organisation))
        );
    }

    updateProject(data: ProjectUpdateData, id: number): Observable<Project> {
        return this.apiService.post('/projects/' + id, data, ).pipe(map(() => {
            this.projectsCache[id].update(data);
            return this.projectsCache[id];
        }));
    }

    deleteProject(id: number, organisation: Organisation): void {
        this.apiService.delete('/projects/' + id, {organisationId: organisation.id}).subscribe((apiResponse: ApiProjectResponse[]) => {
            if (this.projectsCache.hasOwnProperty(id) ) {
                delete this.projectsCache[id];
            }
            this.updateProjectsCache$.next();
        }, (error) => {
            // @todo show error the right way.
            console.log(error);
        });
    }

    breadcrumbLabel(id: number, organisation: Organisation): Observable<string> {
        return this.getProject(id, organisation).pipe(map(p => p.name));
    }

    private makeProject(apiResponse: ApiProjectResponse, organisation: Organisation): Project {
        const project: Project = new Project();

        project.id = apiResponse.id;
        project.name = apiResponse.name;
        project.organisation = organisation;
        project.workFunctions = this.workFunctionService.getWorkFunctionsByProject({projectId: project.id}, project).pipe(
            map(workFunctions => workFunctions.sort((a, b) => a.order - b.order))
        );

        this.projectsCache[ project.id ] = project;
        return project;
    }
}
