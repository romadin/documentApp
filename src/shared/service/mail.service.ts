import { Injectable } from '@angular/core';
import { User } from '../packages/user-package/user.model';
import { ApiService } from './api.service';

@Injectable()
export class MailService {

    constructor(private apiService: ApiService) { }

    /**
     * Send the mail to the user with the link to change password.
     */
    sendUserActivation(user: User) {
        this.apiService.get('/mail/activate/' + user.id, {}).subscribe();
    }
    /**
     * Send the mail to the user when there is a project added to that user.
     */
    sendProjectAdded(user: User, projectId: number) {
        this.apiService.get('/mail/user/' + user.id + '/project/' + projectId, {}).subscribe();
    }
}
