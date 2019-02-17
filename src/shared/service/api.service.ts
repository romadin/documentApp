import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiAuthResponse } from '../../construction-information-management-app/authenticate-app/interfaces/api-auth.interface';
import { map } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { User } from '../packages/user-package/user.model';
import { UserService } from '../packages/user-package/user.service';

@Injectable()
export class ApiService {
    private token: ApiAuthResponse;
    private APIURL = environment.APIURL;
    private http: HttpClient;

    constructor(http: HttpClient) {
        this.http = http;

        const user: User = JSON.parse(localStorage.getItem('currentUser'));
        if ( localStorage.getItem('token') && user ) {
            this.token = {
                token: localStorage.getItem('token'),
                user_id: user.id,
            };
        }
    }

    public postAuthenticate(path: string, body: any): Observable<ApiAuthResponse> {
        return this.http.post(this.APIURL + path, body).pipe(map(response => this.token = <ApiAuthResponse>response ));
    }

    public post(path: string, body: any, params?: any): Observable<any> {
        const paramObject = { params: { token: this.token.token, format: 'json'}};
        if ( params ) {
            Object.assign( paramObject.params, params );
        }

        return this.http.post(this.APIURL + path, body, paramObject);
    }

    public get(path: string, params: any): Observable<any> {
        const paramObject = { params: { token: this.token.token }};
        Object.assign( paramObject.params, params );

        return this.http.get(this.APIURL + path, paramObject );
    }

    public delete(path: string, params: any): Observable<any> {
        const paramObject = { params: { token: this.token.token }};
        Object.assign( params, paramObject.params );

        return this.http.delete(this.APIURL + path, paramObject);
    }

    public tokenExist(): boolean {
        return this.token !== undefined;
    }
}
