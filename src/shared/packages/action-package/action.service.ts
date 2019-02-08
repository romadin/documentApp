import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

import { ApiService } from '../../service/api.service';
import { Action } from './action.model';
import { ApiActionNewPostData, ApiActionResponse } from './api-action.interface';

interface ActionCache {
    [id: number]: Action;
}

interface ActionsByProject {
    [id: number]: BehaviorSubject<Action[]>;
}

@Injectable()
export class ActionService {
    private actionCache: ActionCache = {};
    private actionsByProject: ActionsByProject = [];

    constructor(private apiService: ApiService) { }

    public getActionsByProject(projectId: number): BehaviorSubject<Action[]> {
        const params = { projectId: projectId, format: 'json' };
        if ( !this.actionsByProject[projectId]) {
            this.actionsByProject[projectId] = new BehaviorSubject([]);
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

            this.actionsByProject[projectId].next(actionContainer);
        });

        return this.actionsByProject[projectId];
    }

    public postAction(data: ApiActionNewPostData): BehaviorSubject<Action> {
        let newAction: Action;
        const action: BehaviorSubject<Action> = new BehaviorSubject(null);

        this.apiService.post('/actions', data).subscribe((actionResponse: ApiActionResponse) => {
            newAction = this.makeAction(actionResponse);
            const actions = this.actionsByProject[newAction.projectId].getValue();
            actions.push(newAction);
            this.actionsByProject[newAction.projectId].next(actions);
            action.next(newAction);
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
