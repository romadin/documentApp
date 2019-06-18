import { Injectable } from '@angular/core';
import { Observable, of, Subject } from 'rxjs';
import { WorkFunctionService } from '../work-function-package/work-function.service';

import { Project } from './project.model';
import { ApiProjectResponse, ProjectPostDataInterface, ProjectUpdateData } from './api-project.interface';
import { ApiService } from '../../service/api.service';
import { Organisation } from '../organisation-package/organisation.model';
import { map, mergeMap } from 'rxjs/operators';

interface ProjectCache {
    [id: number]: Project;
}

interface ProjectsCache {
    [id: number]: Project[];
}

@Injectable()
export class ProjectService {
    private projectsCache: ProjectCache = {};
    private projectsByOrganisationCache: ProjectsCache = {};
    private allProjectSubject: Subject<Project[]> = new Subject();

    constructor(private apiService: ApiService, private workFunctionService: WorkFunctionService) {
    }

    public getProjects(organisation: Organisation): Observable<Project[]> {
        if ( this.projectsByOrganisationCache[organisation.id] ) {
            return of(this.projectsByOrganisationCache[organisation.id]);
        }

        const params = {format: 'json', organisationId: organisation.id};
        return this.apiService.get('/projects', params).pipe(map((apiResponse: ApiProjectResponse[]) => {
            const projects = [];
            apiResponse.forEach((item) => {
                const project = this.makeProject(item, organisation);
                projects.push(project);
            });

            this.projectsByOrganisationCache[organisation.id] = projects;
            return this.projectsByOrganisationCache[organisation.id];
        }));
    }

    public getProject(id: number, organisation: Organisation): Observable<Project> {
        const params = {format: 'json', organisationId: organisation.id};
        return this.apiService.get('/projects/' + id, params).pipe(
            mergeMap(projectResponse => {
                const project = this.makeProject(projectResponse, organisation);
                return this.workFunctionService.getWorkFunctionsByParent({projectId: project.id}, project).pipe(map(workFunctions => {
                    workFunctions = workFunctions.sort((a, b) => a.order - b.order);
                    project.workFunctions = workFunctions;
                    return project;
                }));
            })
        );
    }

    public postProject(data: ProjectPostDataInterface, organisation: Organisation ): Promise<Project> {
        return new Promise<Project>((resolve) => {
            this.apiService.post('/projects', data, {}).subscribe((apiResponse: ApiProjectResponse) => {
                    const newProject = this.makeProject(apiResponse, organisation);
                    this.allProjectSubject.next(Object.values(this.projectsCache));
                    resolve(newProject);
                }, (error) => {
                    resolve(error.error);
                });
        });
    }

    /**
     * Doing a post projectId but this call does also do workFunctions and documents. That is the default projectId.
     */
    public postProjectWithDefaultTemplate(data: { name: string, templateId: number }, organisation: Organisation  ): Promise<Project> {
        const params = { organisationId: organisation.id };

        return new Promise<Project>((resolve) => {
            this.apiService.post('/projects', data, params)
                .subscribe((apiResponse: ApiProjectResponse) => {
                    const newProject = this.makeProject(apiResponse, organisation);
                    this.projectsByOrganisationCache[organisation.id].push(newProject);
                    resolve(newProject);
                }, (error) => {
                    resolve(error.error);
                });
        });
    }

    public updateProject(data: ProjectUpdateData, id: number): Observable<Project> {
        return this.apiService.post('/projects/' + id, data, ).pipe(map(() => {
            this.projectsCache[id].update(data);
            return this.projectsCache[id];
        }));
    }

    public deleteProject(id: number, organisation: Organisation): void {
        this.apiService.delete('/projects/' + id, {organisationId: organisation.id}).subscribe((apiResponse: ApiProjectResponse[]) => {
            if (this.projectsCache.hasOwnProperty(id) ) {
                delete this.projectsCache[id];
            }
            const index = this.projectsByOrganisationCache[organisation.id].findIndex(project => project.id === id);
            this.projectsByOrganisationCache[organisation.id].splice(index, 1);
        }, (error) => {
            // @todo show error the right way.
            console.log(error);
        });
    }

    private makeProject(apiResponse: ApiProjectResponse, organisation: Organisation): Project {
        const project: Project = new Project();

        project.id = apiResponse.id;
        project.name = apiResponse.name;
        project.organisation = organisation;

        this.projectsCache[ project.id ] = project;
        return project;
    }

    private objectIsEmpty(object: any): boolean {
        for (const key in object ) {
            if (object.hasOwnProperty(key)) {
                return false;
            }
        }
        return true;
    }
}
