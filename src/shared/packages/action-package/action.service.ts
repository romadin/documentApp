import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

import { ApiService } from '../../service/api.service';
import { Action } from './action.model';
import { ApiActionEditPostData, ApiActionNewPostData, ApiActionResponse } from './api-action.interface';

interface ActionCache {
    [id: number]: Action;
}
interface ActionsByProjectCache {
    [id: number]: Action[];
}

interface ActionsByProject {
    [id: number]: Subject<Action[]>;
}

@Injectable()
export class ActionService {
    private actionCache: ActionCache = {};
    private actionsByProjectCache: ActionsByProjectCache = [];
    private actionsByProject: ActionsByProject = [];

    constructor(private apiService: ApiService) { }

    public getActionsByProject(projectId: number): Subject<Action[]> {
        const params = { projectId: projectId, format: 'json' };
        if ( !this.actionsByProject[projectId]) {
            this.actionsByProjectCache[projectId] = [];
            this.actionsByProject[projectId] = new Subject();
        }

        this.apiService.get('/actions', params).subscribe((actionsResponse: ApiActionResponse[]) => {
            const actionContainer: Action[] = [];

            actionsResponse.forEach((actionResponse: ApiActionResponse) => {
                if (this.actionCache[actionResponse.id]) {
                    actionContainer.push(this.actionCache[actionResponse.id]);
                    return;
                }
                const action = this.makeAction(actionResponse);
                actionContainer.push(action);
            });

            this.actionsByProjectCache[projectId] = actionContainer;
            this.actionsByProject[projectId].next(actionContainer);
        });

        return this.actionsByProject[projectId];
    }

    public postAction(data: ApiActionNewPostData): Subject<Action> {
        let newAction: Action;
        const action: Subject<Action> = new Subject();

        this.apiService.post('/actions', data).subscribe((actionResponse: ApiActionResponse) => {
            newAction = this.makeAction(actionResponse);
            const actions = this.actionsByProjectCache[newAction.projectId];
            actions.push(newAction);
            this.actionsByProject[newAction.projectId].next(actions);
            action.next(newAction);
        }, (error) => {
            throw error.error;
        });

        return action;
    }

    public editAction(action: Action, data: ApiActionEditPostData): Action {
        this.apiService.post('/actions/' + action.id, data).subscribe((actionResponse: ApiActionResponse) => {
        }, (error) => {
            throw error.error;
        });
        return action;
    }

    private makeAction(data: ApiActionResponse): Action {
        const action = new Action();

        action.id = data.id;
        action.code = data.code;
        action.description = data.description;
        action.actionHolder = data.actionHolder;
        action.week = data.week;
        action.isDone = data.isDone;
        action.comments = data.comments;
        action.projectId = data.projectId;

        this.actionCache[action.id] = action;

        return action;
    }
}
