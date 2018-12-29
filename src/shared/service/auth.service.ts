import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class AuthService {
    private http: HttpClient;

    constructor(http: HttpClient) {
        this.http = http;
    }

    public userLogin(userName: string, password: string) {

        this.http.post('/api/authenticate', {
            userName: userName,
            password: password
        }).subscribe((value) => {
            console.log(value);
        });
    }

}
