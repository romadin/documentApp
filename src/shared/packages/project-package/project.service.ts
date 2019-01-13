import { Injectable } from '@angular/core';

import { ApiService } from '../../service/api.service';
import { Project } from './project.model';
import { ApiProjectResponse } from './api-project.interface';

@Injectable()
export class ProjectService {
    private apiService: ApiService;

    constructor(apiService: ApiService) {
        this.apiService = apiService;
    }

    public getProjects(): Promise<Project[]> {
        return new Promise<Project[]>((resolve) => {
            this.apiService.get('/projects', {format: 'json'}).subscribe((apiResponse: ApiProjectResponse[]) => {
                const projects = [];

                apiResponse.forEach((item) => {
                    projects.push(this.makeProject(item));
                });

                resolve(projects);
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
