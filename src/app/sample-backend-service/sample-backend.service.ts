import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {SERVER_URL} from "../consts";
import {Observable} from "rxjs";
import {AuthenticationService, SignupOrLoginResponse} from "../services/authentication.service";

@Injectable({
  providedIn: 'root'
})
export class SampleBackendService {

  constructor(private httpClient: HttpClient, private authService: AuthenticationService) {}


  getUsers(){
    const token = this.authService.token;
    const headers = {'Authorization': `Bearer ${token}`};
    return (this.httpClient.get(`${SERVER_URL}accounts`, {headers}) as Observable<any>);
  }
}
