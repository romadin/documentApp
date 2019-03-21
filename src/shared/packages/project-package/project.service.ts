import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

import { Project } from './project.model';
import { ApiProjectResponse } from './api-project.interface';
import { ApiService } from '../../service/api.service';
import { Organisation } from '../organisation-package/organisation.model';

interface ProjectCache {
    [id: number]: Project;
}

@Injectable()
export class ProjectService {
    private apiService: ApiService;
    private projectsCache: ProjectCache = {};
    private allProjectSubject: Subject<Project[]> = new Subject();

    constructor(apiService: ApiService) {
        this.apiService = apiService;
    }

    public getProjects(organisation: Organisation): Subject<Project[]> {
        if ( !this.objectIsEmpty(this.projectsCache) ) {
            this.allProjectSubject.next(Object.values(this.projectsCache));
            return this.allProjectSubject;
        }
        const params = {format: 'json', organisationId: organisation.id};

        this.apiService.get('/projects', params).subscribe((apiResponse: ApiProjectResponse[]) => {
            const projects = [];

            apiResponse.forEach((item) => {
                const project = this.makeProject(item, organisation);
                projects.push(project);
            });
            this.allProjectSubject.next(projects);
        }, (error) => {
            this.allProjectSubject.error(error);
        });
        return this.allProjectSubject;
    }

    public getProject(id: number, organisation: Organisation): Promise<Project> {
        if (this.projectsCache.hasOwnProperty(id)) {
            return Promise.resolve(this.projectsCache[id]);
        }
        const params = {format: 'json', organisationId: organisation.id};

        return new Promise<Project>((resolve) => {
            this.apiService.get('/projects/' + id, params).subscribe((apiResponse: ApiProjectResponse) => {
                resolve(this.makeProject(apiResponse, organisation));
            }, (error) => {
                resolve(error.error);
            });
        });
    }

    public postProject(data: { name: string }, organisation: Organisation ): Promise<Project> {
        const params = { organisationId: organisation.id };

        return new Promise<Project>((resolve) => {
            this.apiService.post('/projects', data, params).subscribe((apiResponse: ApiProjectResponse) => {
                    const newProject = this.makeProject(apiResponse, organisation);
                    this.allProjectSubject.next(Object.values(this.projectsCache));
                    resolve(newProject);
                }, (error) => {
                    resolve(error.error);
                });
        });
    }

    /**
     * Doing a post project but this call does also do folders and documents. That is the default template.
     */
    public postProjectWithDefaultTemplate(data: { name: string }, organisation: Organisation  ): Promise<Project> {
        const params = { template: 'default', organisationId: organisation.id };

        return new Promise<Project>((resolve) => {
            this.apiService.post('/projects', data, params)
                .subscribe((apiResponse: ApiProjectResponse) => {
                    const newProject = this.makeProject(apiResponse, organisation);
                    this.allProjectSubject.next(Object.values(this.projectsCache));
                    resolve(newProject);
                }, (error) => {
                    resolve(error.error);
                });
        });
    }

    public updateProject(data: { name: string }, id: number): Promise<Project> {
        return new Promise<Project>((resolve) => {
            this.apiService.post('/projects/' + id, data, ).subscribe((apiResponse: ApiProjectResponse) => {
                this.projectsCache[id].update(apiResponse);
                this.allProjectSubject.next(Object.values(this.projectsCache));
                resolve(this.projectsCache[id]);
            }, (error) => {
                this.allProjectSubject.error(error);
                resolve(error.error);
            });
        });
    }

    public deleteProject(id: number, organisation: Organisation): void {
        this.apiService.delete('/projects/' + id, {organisationId: organisation.id}).subscribe((apiResponse: ApiProjectResponse[]) => {
            if (this.projectsCache.hasOwnProperty(id) ) {
                delete this.projectsCache[id];
            }

            apiResponse.forEach((item) => {
                if (this.projectsCache.hasOwnProperty(item.id) ) {
                    return;
                }
                this.makeProject(item, organisation);
            });

            this.allProjectSubject.next(Object.values(this.projectsCache));
        }, (error) => {
            this.allProjectSubject.error(error);
        });
    }

    private makeProject(apiResponse: ApiProjectResponse, organisation: Organisation): Project {
        const project: Project = new Project();

        project.setId(apiResponse.id);
        project.setName(apiResponse.name);
        project.setAgendaId(apiResponse.agendaId);
        project.setActionListId(apiResponse.actionListId);
        project.organisation = organisation;

        this.projectsCache[ project.getId() ] = project;
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
