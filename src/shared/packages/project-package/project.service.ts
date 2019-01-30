import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';

import { Project } from './project.model';
import { ApiProjectResponse } from './api-project.interface';
import { ApiService } from '../../service/api.service';

interface ProjectCache {
    [id: number]: Project;
}

@Injectable()
export class ProjectService {
    private apiService: ApiService;
    private projectsCache: ProjectCache = {};
    private allProjectSubject: BehaviorSubject<Project[]> = new BehaviorSubject([]);

    constructor(apiService: ApiService) {
        this.apiService = apiService;
    }

    public getProjects(): Subject<Project[]> {
        if ( !this.objectIsEmpty(this.projectsCache) ) {
            this.allProjectSubject.next(Object.values(this.projectsCache));
            return this.allProjectSubject;
        }

        this.apiService.get('/projects', {format: 'json'}).subscribe((apiResponse: ApiProjectResponse[]) => {
            const projects = [];

            apiResponse.forEach((item) => {
                const project = this.makeProject(item);
                this.projectsCache[ project.getId() ] = project;
                projects.push(project);
            });
            this.allProjectSubject.next(projects);
        }, (error) => {
            this.allProjectSubject.error(error);
        });
        return this.allProjectSubject;
    }

    public getProject(id: number): Promise<Project> {
        if (this.projectsCache.hasOwnProperty(id)) {
            return Promise.resolve(this.projectsCache[id]);
        }

        return new Promise<Project>((resolve) => {
            this.apiService.get('/projects/' + id, {format: 'json'}).subscribe((apiResponse: ApiProjectResponse) => {
                resolve(this.makeProject(apiResponse));
            }, (error) => {
                resolve(error.error);
            });
        });
    }

    public postProject(data: { name: string } ): Promise<Project> {
        return new Promise<Project>((resolve) => {
            this.apiService.post('/projects', data).subscribe((apiResponse: ApiProjectResponse) => {
                    const newProject = this.makeProject(apiResponse);
                    this.projectsCache[ newProject.getId() ] = newProject;
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
    public postProjectWithDefaultTemplate(data: { name: string } ): Promise<Project> {
        return new Promise<Project>((resolve) => {
            this.apiService.post('/projects', data, { template: 'default'} )
                .subscribe((apiResponse: ApiProjectResponse) => {
                    const newProject = this.makeProject(apiResponse);
                    this.projectsCache[ newProject.getId() ] = newProject;

                    this.allProjectSubject.next(Object.values(this.projectsCache));
                    resolve(newProject);
                }, (error) => {
                    resolve(error.error);
                });
        });
    }

    public updateProject(data: { name: string }, id: number ): Promise<Project> {
        return new Promise<Project>((resolve) => {
            this.apiService.post('/projects/' + id, data, ).subscribe((apiResponse: ApiProjectResponse) => {
                console.log(apiResponse);
                this.projectsCache[id].update(apiResponse);
                this.allProjectSubject.next(Object.values(this.projectsCache));
                resolve(this.projectsCache[id]);
            }, (error) => {
                this.allProjectSubject.error(error);
                resolve(error.error);
            });
        });
    }

    public deleteProject(id: number): void {
        this.apiService.delete('/projects/' + id, {}).subscribe((apiResponse: ApiProjectResponse[]) => {
            if (this.projectsCache.hasOwnProperty(id) ) {
                delete this.projectsCache[id];
            }

            apiResponse.forEach((item) => {
                if (this.projectsCache.hasOwnProperty(item.id) ) {
                    return;
                }
                const project = this.makeProject(item);
                this.projectsCache[ project.getId() ] = project;
            });

            this.allProjectSubject.next(Object.values(this.projectsCache));
        }, (error) => {
            this.allProjectSubject.error(error);
        });
    }

    private makeProject(apiResponse: ApiProjectResponse): Project {
        const project: Project = new Project();

        project.setId(apiResponse.id);
        project.setName(apiResponse.name);
        project.setAgendaId(apiResponse.agendaId);
        project.setActionListId(apiResponse.actionListId);

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
