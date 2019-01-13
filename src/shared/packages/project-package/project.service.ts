import { Injectable } from '@angular/core';

import { ApiService } from '../../service/api.service';
import { Project } from './project.model';
import { ApiProjectResponse } from './api-project.interface';

interface ProjectCache {
    [id: number]: Project;
}

@Injectable()
export class ProjectService {
    private apiService: ApiService;
    private projectsCache: ProjectCache = {};

    constructor(apiService: ApiService) {
        this.apiService = apiService;
    }

    public getProjects(): Promise<Project[]> {
        return new Promise<Project[]>((resolve) => {
            this.apiService.get('/projects', {format: 'json'}).subscribe((apiResponse: ApiProjectResponse[]) => {
                const projects = [];

                apiResponse.forEach((item) => {
                    const project = this.makeProject(item);
                    this.projectsCache[ project.getId() ] = project;
                    projects.push(project);
                });

                resolve(projects);
            }, (error) => {
                resolve(error.error);
            });
        });
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

    private makeProject(apiResponse: ApiProjectResponse): Project {
        const project: Project = new Project();

        project.setId(apiResponse.id);
        project.setName(apiResponse.name);
        project.setAgendaId(apiResponse.agendaId);
        project.setActionListId(apiResponse.actionListId);

        return project;
    }
}
